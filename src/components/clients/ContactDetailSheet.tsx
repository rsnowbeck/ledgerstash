import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, Clock, CheckCircle2, XCircle, Send, FileText } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Contact {
  id: string;
  full_name: string;
  email: string;
  recipient_type: string | null;
  department: string | null;
  created_at: string;
}

interface SigningHistory {
  id: string;
  status: string | null;
  sent_at: string | null;
  completed_at: string | null;
  created_at: string;
  requirement_title: string;
}

interface ContactDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
  organizationId: string;
  onUpdated: () => void;
}

export function ContactDetailSheet({
  open,
  onOpenChange,
  contact,
  organizationId,
  onUpdated,
}: ContactDetailSheetProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactType, setContactType] = useState("employee");
  const [department, setDepartment] = useState("");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const [history, setHistory] = useState<SigningHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (contact) {
      setName(contact.full_name);
      setEmail(contact.email);
      setContactType(contact.recipient_type || "employee");
      setDepartment(contact.department || "");
      setDirty(false);
      fetchHistory(contact.id);
    }
  }, [contact]);

  const fetchHistory = async (recipientId: string) => {
    setHistoryLoading(true);
    try {
      const { data, error } = await supabase
        .from("signing_requests")
        .select("id, status, sent_at, completed_at, created_at, requirement_id")
        .eq("recipient_id", recipientId)
        .eq("organization_id", organizationId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch requirement titles
      const reqIds = [...new Set((data || []).map((r) => r.requirement_id))];
      let reqMap: Record<string, string> = {};
      if (reqIds.length > 0) {
        const { data: reqs } = await supabase
          .from("requirements")
          .select("id, title")
          .in("id", reqIds);
        reqMap = Object.fromEntries((reqs || []).map((r) => [r.id, r.title]));
      }

      setHistory(
        (data || []).map((r) => ({
          id: r.id,
          status: r.status,
          sent_at: r.sent_at,
          completed_at: r.completed_at,
          created_at: r.created_at,
          requirement_title: reqMap[r.requirement_id] || "Unknown",
        }))
      );
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleSave = async () => {
    if (!contact) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("recipients")
        .update({
          full_name: name,
          email: email,
          recipient_type: contactType,
          department: department || null,
        })
        .eq("id", contact.id);

      if (error) throw error;
      toast.success("Contact updated");
      setDirty(false);
      onUpdated();
    } catch (error: any) {
      toast.error(error.message || "Failed to update contact");
    } finally {
      setSaving(false);
    }
  };

  const statusIcon = (status: string | null) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-primary" />;
      case "pending":
        return <Clock className="h-4 w-4 text-accent" />;
      case "expired":
        return <XCircle className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const statusLabel = (status: string | null) => {
    switch (status) {
      case "completed":
        return "Signed";
      case "pending":
        return "Pending";
      case "expired":
        return "Expired";
      default:
        return status || "Unknown";
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Contact Details</SheetTitle>
          <SheetDescription>
            View and edit this contact's information and sending history.
          </SheetDescription>
        </SheetHeader>

        {contact && (
          <div className="space-y-6 mt-6">
            {/* Edit Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="detail-name">Full Name</Label>
                <Input
                  id="detail-name"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setDirty(true); }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="detail-email">Email</Label>
                <Input
                  id="detail-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setDirty(true); }}
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={contactType} onValueChange={(v) => { setContactType(v); setDirty(true); }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="controller">Controller</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="partner">Partner</SelectItem>
                    <SelectItem value="contractor">Contractor</SelectItem>
                    <SelectItem value="bookkeeper">Bookkeeper</SelectItem>
                    <SelectItem value="spouse">Spouse</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="detail-dept">Department / Group</Label>
                <Input
                  id="detail-dept"
                  value={department}
                  onChange={(e) => { setDepartment(e.target.value); setDirty(true); }}
                />
              </div>

              {dirty && (
                <Button variant="hero" className="w-full" onClick={handleSave} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Changes
                </Button>
              )}
            </div>

            {/* Sent History */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Send className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-medium text-foreground">Sent History</h4>
              </div>

              {historyLoading ? (
                <div className="text-center py-6">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-border rounded-lg">
                  <FileText className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
                  <p className="text-sm text-muted-foreground">No documents sent yet.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-3 p-3 rounded-lg border border-border bg-card"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">
                          {item.requirement_title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.sent_at
                            ? `Sent ${format(new Date(item.sent_at), "MMM d, yyyy")}`
                            : `Created ${format(new Date(item.created_at), "MMM d, yyyy")}`}
                        </p>
                        {item.completed_at && (
                          <p className="text-xs text-green-600">
                            Signed {format(new Date(item.completed_at), "MMM d, yyyy")}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {statusIcon(item.status)}
                        <Badge
                          variant={item.status === "completed" ? "default" : "secondary"}
                          className="text-xs capitalize"
                        >
                          {statusLabel(item.status)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              Added {format(new Date(contact.created_at), "MMMM d, yyyy")}
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
