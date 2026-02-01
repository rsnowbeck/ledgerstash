import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Search, Users, CheckCircle2, Copy, Check, UserPlus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface Recipient {
  id: string;
  full_name: string;
  email: string;
  department: string | null;
  recipient_type: string | null;
}

interface SigningLink {
  recipientName: string;
  email: string;
  url: string;
}

interface SendForSignatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requirementId: string;
  requirementTitle: string;
  organizationId: string;
  organizationName?: string;
  senderName?: string | null;
  senderEmail?: string | null;
  logoUrl?: string | null;
  onSuccess?: () => void;
}

export function SendForSignatureDialog({
  open,
  onOpenChange,
  requirementId,
  requirementTitle,
  organizationId,
  organizationName,
  senderName,
  senderEmail,
  logoUrl,
  onSuccess,
}: SendForSignatureDialogProps) {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [signingLinks, setSigningLinks] = useState<SigningLink[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  // Inline add recipient state
  const [showAddForm, setShowAddForm] = useState(false);
  const [addingRecipient, setAddingRecipient] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newType, setNewType] = useState("employee");
  const [newDepartment, setNewDepartment] = useState("");

  useEffect(() => {
    if (open && organizationId) {
      fetchRecipients();
      setSelectedIds(new Set());
      setSuccess(false);
      setSigningLinks([]);
      setCopiedIndex(null);
      setShowAddForm(false);
      resetAddForm();
    }
  }, [open, organizationId]);

  const resetAddForm = () => {
    setNewName("");
    setNewEmail("");
    setNewType("employee");
    setNewDepartment("");
  };

  const fetchRecipients = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("recipients")
        .select("id, full_name, email, department, recipient_type")
        .eq("organization_id", organizationId)
        .eq("is_deleted", false)
        .order("full_name");

      if (error) throw error;
      setRecipients(data || []);
    } catch (error) {
      console.error("Error fetching recipients:", error);
      toast.error("Failed to load recipients");
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecipient = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingRecipient(true);

    try {
      const { data, error } = await supabase
        .from("recipients")
        .insert({
          organization_id: organizationId,
          full_name: newName,
          email: newEmail,
          recipient_type: newType,
          department: newDepartment || null,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success(`Added ${newName}`);
      
      // Add to local state and auto-select
      setRecipients((prev) => [...prev, data].sort((a, b) => a.full_name.localeCompare(b.full_name)));
      setSelectedIds((prev) => new Set([...prev, data.id]));
      
      setShowAddForm(false);
      resetAddForm();
    } catch (error: any) {
      console.error("Error adding recipient:", error);
      toast.error(error.message || "Failed to add recipient");
    } finally {
      setAddingRecipient(false);
    }
  };

  const generateSecureToken = (): string => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
  };

  const hashToken = async (token: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(token);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const handleSend = async () => {
    if (selectedIds.size === 0) {
      toast.error("Please select at least one recipient");
      return;
    }

    setSending(true);

    try {
      const selectedRecipients = recipients.filter((r) => selectedIds.has(r.id));
      const signingRequests = await Promise.all(
        selectedRecipients.map(async (recipient) => {
          const token = generateSecureToken();
          const tokenHash = await hashToken(token);

          return {
            organization_id: organizationId,
            requirement_id: requirementId,
            recipient_id: recipient.id,
            token_hash: tokenHash,
            status: "pending",
            sent_at: new Date().toISOString(),
            _plain_token: token,
            _recipient_name: recipient.full_name,
            _recipient_email: recipient.email,
          };
        })
      );

      // Insert signing requests (without the plain token and recipient info)
      const { data: insertedRequests, error } = await supabase
        .from("signing_requests")
        .insert(
          signingRequests.map(({ _plain_token, _recipient_name, _recipient_email, ...rest }) => rest)
        )
        .select("id, recipient_id");

      if (error) throw error;

      // Log initial send events for each signing request
      if (insertedRequests && insertedRequests.length > 0) {
        const reminderLogs = insertedRequests.map((req) => ({
          signing_request_id: req.id,
          organization_id: organizationId,
          trigger_type: "initial",
          email_sent: true,
        }));

        const { error: logError } = await supabase
          .from("reminder_logs")
          .insert(reminderLogs);

        if (logError) {
          console.error("Failed to log initial sends:", logError);
        }
      }

      // Use production custom domain
      const baseUrl = "https://getattestly.com";
      const links: SigningLink[] = signingRequests.map((req) => ({
        recipientName: req._recipient_name,
        email: req._recipient_email,
        url: `${baseUrl}/sign/${req._plain_token}`,
      }));

      // Send emails to each recipient
      const emailPromises = links.map(async (link) => {
        try {
          const response = await supabase.functions.invoke("send-signing-email", {
            body: {
              recipientName: link.recipientName,
              recipientEmail: link.email,
              requirementTitle,
              signingUrl: link.url,
              organizationName: organizationName || "Your organization",
              senderName: senderName || null,
              senderEmail: senderEmail || null,
              logoUrl: logoUrl || null,
            },
          });
          
          if (response.error) {
            console.error(`Failed to send email to ${link.email}:`, response.error);
            return { success: false, email: link.email, error: response.error };
          }
          
          console.log(`Email sent to ${link.email}`);
          return { success: true, email: link.email };
        } catch (err) {
          console.error(`Error sending email to ${link.email}:`, err);
          return { success: false, email: link.email, error: err };
        }
      });

      const emailResults = await Promise.all(emailPromises);
      const successCount = emailResults.filter((r) => r.success).length;
      const failCount = emailResults.filter((r) => !r.success).length;

      setSigningLinks(links);
      setSuccess(true);
      
      if (failCount > 0) {
        toast.warning(`Sent ${successCount} email(s), ${failCount} failed. Links are still available below.`);
      } else {
        toast.success(`Sent ${selectedIds.size} signing request(s) via email`);
      }
      
      onSuccess?.();
    } catch (error: any) {
      console.error("Error creating signing requests:", error);
      toast.error(error.message || "Failed to send signing requests");
    } finally {
      setSending(false);
    }
  };

  const copyToClipboard = async (url: string, index: number) => {
    await navigator.clipboard.writeText(url);
    setCopiedIndex(index);
    toast.success("Link copied!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleRecipient = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleAll = () => {
    if (selectedIds.size === filteredRecipients.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredRecipients.map((r) => r.id)));
    }
  };

  const filteredRecipients = recipients.filter(
    (r) =>
      r.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.department?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  const handleClose = () => {
    onOpenChange(false);
    // Reset after animation
    setTimeout(() => {
      setSuccess(false);
      setSelectedIds(new Set());
      setSearchQuery("");
      setShowAddForm(false);
      resetAddForm();
    }, 200);
  };

  // Success state
  if (success) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg">
          <div className="py-4">
            <div className="text-center mb-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Emails Sent Successfully!
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {signingLinks.length} recipient{signingLinks.length !== 1 ? "s" : ""} will receive an email with their signing link
              </p>
            </div>

            <div className="mt-6 text-center">
              <Button onClick={handleClose}>Done</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Add recipient form
  if (showAddForm) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddForm(false)}
                className="h-8 w-8 p-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <DialogTitle>Add New Recipient</DialogTitle>
                <DialogDescription>
                  Create a new recipient and add them to this request
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleAddRecipient} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="inline-name">Full Name *</Label>
              <Input
                id="inline-name"
                placeholder="Jane Smith"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inline-email">Email *</Label>
              <Input
                id="inline-email"
                type="email"
                placeholder="jane@company.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inline-type">Type</Label>
                <Select value={newType} onValueChange={setNewType}>
                  <SelectTrigger id="inline-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="contractor">Contractor</SelectItem>
                    <SelectItem value="vendor">Vendor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="inline-department">Department</Label>
                <Input
                  id="inline-department"
                  placeholder="Engineering"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setShowAddForm(false)}
                disabled={addingRecipient}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="hero"
                className="flex-1"
                disabled={addingRecipient}
              >
                {addingRecipient ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Add & Select
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  // Main recipient selection view
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send for Signature
          </DialogTitle>
          <DialogDescription>
            Select recipients to sign "{requirementTitle}"
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          </div>
        ) : recipients.length === 0 ? (
          <div className="py-8 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-medium text-foreground mb-1">No recipients yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add people to your organization before sending signing requests.
            </p>
            <div className="flex flex-col gap-2">
              <Button onClick={() => setShowAddForm(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add New Recipient
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/recipients" onClick={() => onOpenChange(false)}>
                  Go to Recipients page →
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Search + Add Button */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search recipients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowAddForm(true)}
              >
                <UserPlus className="h-4 w-4" />
                Create New
              </Button>
            </div>

            {/* Select All */}
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={
                    filteredRecipients.length > 0 &&
                    selectedIds.size === filteredRecipients.length
                  }
                  onCheckedChange={toggleAll}
                />
                <span className="text-sm font-medium">
                  {selectedIds.size > 0
                    ? `${selectedIds.size} selected`
                    : "Select all"}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {filteredRecipients.length} recipient{filteredRecipients.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Recipient List */}
            <ScrollArea className="h-[280px] -mx-6 px-6">
              <div className="space-y-1">
                {filteredRecipients.map((recipient) => (
                  <label
                    key={recipient.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <Checkbox
                      checked={selectedIds.has(recipient.id)}
                      onCheckedChange={() => toggleRecipient(recipient.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {recipient.full_name}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {recipient.email}
                        {recipient.department && ` · ${recipient.department}`}
                      </p>
                    </div>
                    {recipient.recipient_type && (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded capitalize">
                        {recipient.recipient_type}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </ScrollArea>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                disabled={selectedIds.size === 0 || sending}
                onClick={handleSend}
              >
                {sending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send to {selectedIds.size || "0"} Recipient{selectedIds.size !== 1 ? "s" : ""}
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
