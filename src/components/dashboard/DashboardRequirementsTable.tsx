import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Eye, Bell, ChevronRight, AlertCircle } from "lucide-react";
import { format, isPast, isToday } from "date-fns";

interface RequirementWithStats {
  id: string;
  title: string;
  status: string | null;
  due_date: string | null;
  updated_at: string;
  created_at: string;
  total_recipients: number;
  completed_count: number;
  pending_count: number;
}

interface DashboardRequirementsTableProps {
  organizationId: string;
}

export function DashboardRequirementsTable({ organizationId }: DashboardRequirementsTableProps) {
  const [requirements, setRequirements] = useState<RequirementWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequirements();
  }, [organizationId]);

  const fetchRequirements = async () => {
    try {
      // Fetch all requirements (not just published)
      const { data: reqs, error: reqError } = await supabase
        .from("requirements")
        .select("*")
        .eq("organization_id", organizationId)
        .order("status", { ascending: true }) // drafts last
        .order("due_date", { ascending: true, nullsFirst: false })
        .order("updated_at", { ascending: false });

      if (reqError) throw reqError;

      // For each requirement, get signing request stats
      const requirementsWithStats = await Promise.all(
        (reqs || []).map(async (req) => {
          const { count: totalCount } = await supabase
            .from("signing_requests")
            .select("*", { count: "exact", head: true })
            .eq("requirement_id", req.id);

          const { count: completedCount } = await supabase
            .from("signing_requests")
            .select("*", { count: "exact", head: true })
            .eq("requirement_id", req.id)
            .eq("status", "completed");

          const { count: pendingCount } = await supabase
            .from("signing_requests")
            .select("*", { count: "exact", head: true })
            .eq("requirement_id", req.id)
            .eq("status", "pending");

          return {
            ...req,
            total_recipients: totalCount || 0,
            completed_count: completedCount || 0,
            pending_count: pendingCount || 0,
          };
        })
      );

      // Sort: Active first, overdue at top, drafts last
      const sorted = requirementsWithStats.sort((a, b) => {
        // Drafts always last
        if (a.status === "draft" && b.status !== "draft") return 1;
        if (a.status !== "draft" && b.status === "draft") return -1;

        // Among non-drafts, overdue first
        const aOverdue = a.due_date && isPast(new Date(a.due_date)) && !isToday(new Date(a.due_date));
        const bOverdue = b.due_date && isPast(new Date(b.due_date)) && !isToday(new Date(b.due_date));
        if (aOverdue && !bOverdue) return -1;
        if (!aOverdue && bOverdue) return 1;

        // Then by due date
        if (a.due_date && b.due_date) {
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        }
        if (a.due_date && !b.due_date) return -1;
        if (!a.due_date && b.due_date) return 1;

        return 0;
      });

      setRequirements(sorted);
    } catch (error) {
      console.error("Error fetching requirements:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string | null, dueDate: string | null) => {
    const isOverdue = dueDate && isPast(new Date(dueDate)) && !isToday(new Date(dueDate));
    
    if (status === "draft") {
      return <Badge variant="secondary">Draft</Badge>;
    }
    if (isOverdue && status === "published") {
      return <Badge variant="destructive">Overdue</Badge>;
    }
    if (status === "published") {
      return <Badge className="bg-accent text-accent-foreground">Active</Badge>;
    }
    return <Badge variant="outline">{status || "Unknown"}</Badge>;
  };

  const getCompletionDisplay = (completed: number, total: number) => {
    if (total === 0) {
      return <span className="text-muted-foreground text-sm">No recipients</span>;
    }
    const percentage = Math.round((completed / total) * 100);
    return (
      <div className="flex items-center gap-2">
        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm text-muted-foreground">
          {completed}/{total}
        </span>
      </div>
    );
  };

  const formatDueDate = (dueDate: string | null) => {
    if (!dueDate) return <span className="text-muted-foreground">—</span>;
    const date = new Date(dueDate);
    const isOverdue = isPast(date) && !isToday(date);
    const isDueToday = isToday(date);
    
    return (
      <span className={`flex items-center gap-1 ${isOverdue ? "text-destructive" : isDueToday ? "text-amber-600" : "text-muted-foreground"}`}>
        {isOverdue && <AlertCircle className="h-3 w-3" />}
        {format(date, "MMM d, yyyy")}
      </span>
    );
  };

  const formatLastActivity = (date: string) => {
    return format(new Date(date), "MMM d, yyyy");
  };

  if (loading) {
    return (
      <div className="card-elevated p-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card-elevated overflow-hidden">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Requirements</h2>
          <p className="text-sm text-muted-foreground">
            {requirements.length} requirement{requirements.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/requirements">
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Requirement</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Completion</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Last Activity</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requirements.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No requirements yet
              </TableCell>
            </TableRow>
          ) : (
            requirements.map((req) => (
              <TableRow key={req.id} className="group">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <Link 
                        to={`/requirements/${req.id}`}
                        className="font-medium text-foreground hover:text-accent transition-colors"
                      >
                        {req.title}
                      </Link>
                      {req.pending_count > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {req.pending_count} pending response{req.pending_count !== 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(req.status, req.due_date)}</TableCell>
                <TableCell>{getCompletionDisplay(req.completed_count, req.total_recipients)}</TableCell>
                <TableCell>{formatDueDate(req.due_date)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatLastActivity(req.updated_at)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/requirements/${req.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    {req.status === "published" && req.pending_count > 0 && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link to="/signatures">
                          <Bell className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
