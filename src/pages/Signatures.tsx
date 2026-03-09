import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useOrganization } from "@/hooks/useOrganization";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Search, FileSignature, Clock, CheckCircle2, XCircle, Send, Download, FileText, Bell, AlertTriangle, Loader2, Trash2, MoreHorizontal } from "lucide-react";
import { format, isPast } from "date-fns";
import { useResendSigningLink } from "@/hooks/useResendSigningLink";
import { BulkReminderDialog } from "@/components/signatures/BulkReminderDialog";
import { toast } from "sonner";
import { generateSignaturePdf } from "@/lib/generateSignaturePdf";
import { exportSignaturesToCSV } from "@/lib/csvExport";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SigningRequest {
  id: string;
  status: string | null;
  sent_at: string | null;
  completed_at: string | null;
  signed_name: string | null;
  expires_at: string | null;
  ip_address: string | null;
  user_agent: string | null;
  recipient: {
    full_name: string;
    email: string;
  } | null;
  requirement: {
    title: string;
  } | null;
}

export default function Signatures() {
  const { user, loading: authLoading } = useAuth();
  const { organization, profile, loading: orgLoading } = useOrganization(user);
  const [searchParams, setSearchParams] = useSearchParams();
  const [signingRequests, setSigningRequests] = useState<SigningRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get("status") || "all");
  const [bulkReminderDialogOpen, setBulkReminderDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 25;
  const { resend, resending } = useResendSigningLink();

  // Sync status filter with URL params
  useEffect(() => {
    const urlStatus = searchParams.get("status");
    if (urlStatus && ["pending", "completed", "expired", "overdue"].includes(urlStatus)) {
      setStatusFilter(urlStatus === "overdue" ? "overdue" : urlStatus);
    }
  }, [searchParams]);

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    if (value === "all") {
      searchParams.delete("status");
    } else {
      searchParams.set("status", value);
    }
    setSearchParams(searchParams);
  };

  useEffect(() => {
    if (organization?.id) {
      fetchSigningRequests();
    }
  }, [organization?.id]);

  const fetchSigningRequests = async () => {
    if (!organization?.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("signing_requests")
        .select(`
          id,
          status,
          sent_at,
          completed_at,
          signed_name,
          expires_at,
          ip_address,
          user_agent,
          recipient:recipients(full_name, email),
          requirement:requirements(title)
        `)
        .eq("organization_id", organization.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSigningRequests(data || []);
    } catch (error) {
      console.error("Error fetching signing requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string | null, expiresAt: string | null) => {
    const isExpired = expiresAt && new Date(expiresAt) < new Date();
    const isOverdue = status === "pending" && isExpired;
    
    if (status === "completed") {
      return (
        <Badge variant="default" className="bg-primary/10 text-primary border-primary/20">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
    }
    
    if (isOverdue) {
      return (
        <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Overdue
        </Badge>
      );
    }

    if (isExpired) {
      return (
        <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
          <XCircle className="h-3 w-3 mr-1" />
          Expired
        </Badge>
      );
    }
    
    return (
      <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
        <Clock className="h-3 w-3 mr-1" />
        Pending
      </Badge>
    );
  };

  const filteredRequests = signingRequests.filter((req) => {
    const matchesSearch =
      req.recipient?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.recipient?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.requirement?.title.toLowerCase().includes(searchQuery.toLowerCase());

    const isExpired = req.expires_at && new Date(req.expires_at) < new Date();
    const isOverdue = req.status === "pending" && isExpired;
    
    // Determine effective status
    let effectiveStatus = req.status;
    if (isOverdue) effectiveStatus = "overdue";
    else if (req.status === "pending" && isExpired) effectiveStatus = "expired";

    // Handle filter matching
    let matchesStatus = false;
    if (statusFilter === "all") {
      matchesStatus = true;
    } else if (statusFilter === "overdue") {
      matchesStatus = isOverdue;
    } else if (statusFilter === "pending") {
      // Pending filter excludes overdue
      matchesStatus = req.status === "pending" && !isExpired;
    } else if (statusFilter === "expired") {
      matchesStatus = req.status === "pending" && isExpired && !isOverdue;
    } else {
      matchesStatus = effectiveStatus === statusFilter;
    }

    return matchesSearch && matchesStatus;
  });

  const isRequestPendingOrExpired = (request: SigningRequest) => {
    const isExpired = request.expires_at && new Date(request.expires_at) < new Date();
    return request.status === "pending" || isExpired;
  };

  const handleResendClick = (request: SigningRequest) => {
    if (!organization) return;
    
    resend({
      signingRequestId: request.id,
      recipientName: request.recipient?.full_name || "Unknown",
      recipientEmail: request.recipient?.email || "",
      requirementTitle: request.requirement?.title || "Unknown",
      organizationId: organization.id,
      organizationName: organization.name,
      senderName: organization.sender_name,
      senderEmail: organization.sender_email,
      logoUrl: organization.logo_url,
      isPro: organization.plan === "pro",
      userId: user?.id,
      onSuccess: fetchSigningRequests,
    });
  };

  const handleDownloadPdf = async (request: SigningRequest) => {
    if (request.status !== "completed") {
      toast.error("PDF export is only available for completed signatures");
      return;
    }

    toast.info("Generating PDF...");

    await generateSignaturePdf({
      recipientName: request.recipient?.full_name || "Unknown",
      recipientEmail: request.recipient?.email || "",
      requirementTitle: request.requirement?.title || "Unknown",
      signedName: request.signed_name || "",
      sentAt: request.sent_at,
      completedAt: request.completed_at,
      ipAddress: request.ip_address,
      userAgent: request.user_agent,
      signingRequestId: request.id,
      organizationName: organization?.name,
      organizationLogoUrl: organization?.logo_url,
    });

    toast.success("PDF certificate downloaded");
  };

  const handleExportCSV = () => {
    const completedRequests = signingRequests.filter((r) => r.status === "completed");
    
    if (completedRequests.length === 0) {
      toast.error("No completed signatures to export");
      return;
    }

    exportSignaturesToCSV(signingRequests, false);
    toast.success(`Exported ${completedRequests.length} completed signature(s)`);
  };

  const handleDeleteRequest = async (request: SigningRequest) => {
    const name = request.recipient?.full_name || "this contact";
    if (!confirm(`Remove tracking for ${name}? This cannot be undone.`)) return;
    
    try {
      const { error } = await supabase
        .from("signing_requests")
        .delete()
        .eq("id", request.id);
      
      if (error) throw error;
      setSigningRequests(prev => prev.filter(r => r.id !== request.id));
      toast.success(`Removed tracking for ${name}`);
    } catch (error) {
      console.error("Error deleting signing request:", error);
      toast.error("Failed to remove. Please try again.");
    }
  };

  const pendingCount = signingRequests.filter(
    (r) => r.status === "pending" && !(r.expires_at && new Date(r.expires_at) < new Date())
  ).length;

  if (authLoading || orgLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-44" />
          </div>
          <div className="card-elevated p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 py-2">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-56" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tracking</h1>
          <p className="text-muted-foreground">
            Track and manage all document requests sent to contacts
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setBulkReminderDialogOpen(true)}
            disabled={loading || pendingCount === 0}
          >
            <Bell className="h-4 w-4" />
            Send Reminders ({pendingCount})
          </Button>
          <Button
            variant="outline"
            onClick={handleExportCSV}
            disabled={loading || signingRequests.filter((r) => r.status === "completed").length === 0}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by contact or document request..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      <div className="card-elevated">
        {loading ? (
          <div className="py-12 text-center">
            <div className="animate-pulse text-muted-foreground">
              Loading signing requests...
            </div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="py-12 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <FileSignature className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No document requests yet
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              {searchQuery || statusFilter !== "all"
                ? "No requests match your filters"
                : "Send a document request to a contact to get started"}
            </p>
          </div>
        ) : (
          (() => {
            const paginatedRequests = filteredRequests.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
            return (
          <>
            {/* Mobile card view */}
            <div className="block md:hidden divide-y divide-border">
              {paginatedRequests.map((request) => (
                <div key={request.id} className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground truncate">
                        {request.recipient?.full_name || "Unknown"}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {request.recipient?.email || "—"}
                      </p>
                    </div>
                    {getStatusBadge(request.status, request.expires_at)}
                  </div>
                  <p className="text-sm text-foreground mb-2 truncate">
                    {request.requirement?.title || "Unknown"}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {request.sent_at
                        ? `Sent ${format(new Date(request.sent_at), "MMM d")}`
                        : "Not sent"}
                    </span>
                    <div className="flex gap-1">
                      {request.status === "completed" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDownloadPdf(request)}
                          className="h-7 px-2"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      )}
                      {isRequestPendingOrExpired(request) && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleResendClick(request)}
                          className="h-7 px-2"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteRequest(request)}
                        className="h-7 px-2 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table view */}
            <div className="hidden md:block">
              <ScrollArea className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contact</TableHead>
                      <TableHead>Document Request</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sent</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead>Signed As</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">
                              {request.recipient?.full_name || "Unknown"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {request.recipient?.email || "—"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {request.requirement?.title || "Unknown"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(request.status, request.expires_at)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {request.sent_at
                            ? format(new Date(request.sent_at), "MMM d, yyyy")
                            : "—"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {request.completed_at
                            ? format(new Date(request.completed_at), "MMM d, yyyy h:mm a")
                            : "—"}
                        </TableCell>
                        <TableCell>
                          {request.signed_name ? (
                            <span className="font-medium text-foreground">
                              {request.signed_name}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {isRequestPendingOrExpired(request) && (
                                <DropdownMenuItem
                                  onClick={() => handleResendClick(request)}
                                  disabled={resending === request.id}
                                >
                                  <Send className="h-4 w-4 mr-2" />
                                  {resending === request.id ? "Sending..." : "Resend"}
                                </DropdownMenuItem>
                              )}
                              {request.status === "completed" && (
                                <DropdownMenuItem onClick={() => handleDownloadPdf(request)}>
                                  <FileText className="h-4 w-4 mr-2" />
                                  Download PDF
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => handleDeleteRequest(request)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </>
            );
          })()
        )}
      </div>

      {/* Pagination & Stats Footer */}
      {!loading && filteredRequests.length > 0 && (
        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex gap-6 text-sm text-muted-foreground">
            <span>Total: {filteredRequests.length}</span>
            <span>Completed: {filteredRequests.filter((r) => r.status === "completed").length}</span>
            <span>Pending: {filteredRequests.filter((r) => r.status === "pending" && !(r.expires_at && new Date(r.expires_at) < new Date())).length}</span>
          </div>
          {(() => {
            const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
            return totalPages > 1 ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            ) : null;
          })()}
        </div>
      )}

      {/* Bulk Reminder Dialog */}
      {organization && (
        <BulkReminderDialog
          open={bulkReminderDialogOpen}
          onOpenChange={setBulkReminderDialogOpen}
          organizationId={organization.id}
          organizationName={organization.name}
          senderName={organization.sender_name || profile?.full_name}
          senderEmail={organization.sender_email || profile?.email}
          logoUrl={organization.logo_url}
          isPro={organization.plan === "pro"}
          onSuccess={fetchSigningRequests}
        />
      )}
    </DashboardLayout>
  );
}
