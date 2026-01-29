import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Search, Users, CheckCircle2, Copy, Check } from "lucide-react";
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
  onSuccess?: () => void;
}

export function SendForSignatureDialog({
  open,
  onOpenChange,
  requirementId,
  requirementTitle,
  organizationId,
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

  useEffect(() => {
    if (open && organizationId) {
      fetchRecipients();
      setSelectedIds(new Set());
      setSuccess(false);
      setSigningLinks([]);
      setCopiedIndex(null);
    }
  }, [open, organizationId]);

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
      const { error } = await supabase.from("signing_requests").insert(
        signingRequests.map(({ _plain_token, _recipient_name, _recipient_email, ...rest }) => rest)
      );

      if (error) throw error;

      // Generate signing links
      const baseUrl = window.location.origin;
      const links: SigningLink[] = signingRequests.map((req) => ({
        recipientName: req._recipient_name,
        email: req._recipient_email,
        url: `${baseUrl}/sign/${req._plain_token}`,
      }));

      setSigningLinks(links);
      setSuccess(true);
      toast.success(`Created ${selectedIds.size} signing request(s)`);
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
    }, 200);
  };

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
                Signing Requests Created!
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Share these links with your recipients
              </p>
            </div>

            <ScrollArea className="max-h-[300px] -mx-6 px-6">
              <div className="space-y-3">
                {signingLinks.map((link, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg border border-border bg-muted/30"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate text-sm">
                          {link.recipientName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {link.email}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(link.url, index)}
                        className="shrink-0"
                      >
                        {copiedIndex === index ? (
                          <Check className="h-4 w-4 text-primary" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <code className="text-xs text-muted-foreground block truncate bg-background px-2 py-1 rounded">
                      {link.url}
                    </code>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="mt-6 text-center">
              <Button onClick={handleClose}>Done</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

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
          <div className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No recipients found. Add recipients first.
            </p>
          </div>
        ) : (
          <>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search recipients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
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
