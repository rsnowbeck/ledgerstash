import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Mail, MailOpen, Archive, Eye, Inbox } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  read_at: string | null;
  archived_at: string | null;
}

type FilterTab = "inbox" | "archived";

export default function ContactSubmissions() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactSubmission | null>(null);
  const [tab, setTab] = useState<FilterTab>("inbox");

  useEffect(() => {
    fetchSubmissions();
  }, [tab]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (tab === "inbox") {
        query = query.is("archived_at", null);
      } else {
        query = query.not("archived_at", "is", null);
      }

      const { data, error } = await query;
      if (error) throw error;
      setSubmissions((data || []) as ContactSubmission[]);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (sub: ContactSubmission) => {
    if (sub.read_at) return;
    const { error } = await supabase
      .from("contact_submissions")
      .update({ read_at: new Date().toISOString() })
      .eq("id", sub.id);
    if (!error) {
      setSubmissions((prev) =>
        prev.map((s) => (s.id === sub.id ? { ...s, read_at: new Date().toISOString() } : s))
      );
    }
  };

  const toggleArchive = async (sub: ContactSubmission) => {
    const archived = sub.archived_at ? null : new Date().toISOString();
    const { error } = await supabase
      .from("contact_submissions")
      .update({ archived_at: archived })
      .eq("id", sub.id);
    if (error) {
      toast.error("Failed to update");
      return;
    }
    toast.success(archived ? "Archived" : "Moved to inbox");
    setSubmissions((prev) => prev.filter((s) => s.id !== sub.id));
    if (selected?.id === sub.id) setSelected(null);
  };

  const openSubmission = (sub: ContactSubmission) => {
    setSelected(sub);
    markAsRead(sub);
  };

  const unreadCount = submissions.filter((s) => !s.read_at).length;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Contact Submissions</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Messages from the public contact form
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={tab === "inbox" ? "default" : "outline"}
          size="sm"
          onClick={() => setTab("inbox")}
        >
          <Inbox className="h-4 w-4 mr-1.5" />
          Inbox
          {tab === "inbox" && unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
        <Button
          variant={tab === "archived" ? "default" : "outline"}
          size="sm"
          onClick={() => setTab("archived")}
        >
          <Archive className="h-4 w-4 mr-1.5" />
          Archived
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Inbox className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p>No {tab === "inbox" ? "new" : "archived"} submissions</p>
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8" />
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((sub) => (
                <TableRow
                  key={sub.id}
                  className={`cursor-pointer ${!sub.read_at ? "bg-accent/5 font-medium" : ""}`}
                  onClick={() => openSubmission(sub)}
                >
                  <TableCell>
                    {sub.read_at ? (
                      <MailOpen className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Mail className="h-4 w-4 text-primary" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{sub.name}</TableCell>
                  <TableCell className="text-muted-foreground">{sub.email}</TableCell>
                  <TableCell className="text-muted-foreground max-w-[300px] truncate">
                    {sub.message}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {format(new Date(sub.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" onClick={() => openSubmission(sub)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => toggleArchive(sub)}>
                        <Archive className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Message from {selected?.name}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {selected.email}
                  </a>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Received</p>
                  <p className="text-sm">
                    {format(new Date(selected.created_at), "MMM d, yyyy h:mm a")}
                  </p>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-xs text-muted-foreground mb-2">Message</p>
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {selected.message}
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <a href={`mailto:${selected.email}`}>
                    <Mail className="h-4 w-4 mr-1.5" />
                    Reply
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => toggleArchive(selected)}
                >
                  <Archive className="h-4 w-4 mr-1.5" />
                  {selected.archived_at ? "Unarchive" : "Archive"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
