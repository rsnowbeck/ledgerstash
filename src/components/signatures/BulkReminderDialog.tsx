import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Bell } from "lucide-react";
import { toast } from "sonner";

interface PendingSignature {
  id: string;
  recipientName: string;
  recipientEmail: string;
  requirementTitle: string;
  sentAt: string | null;
}

interface BulkReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  organizationName: string;
  onSuccess?: () => void;
}

export function BulkReminderDialog({
  open,
  onOpenChange,
  organizationId,
  organizationName,
  onSuccess,
}: BulkReminderDialogProps) {
  const { user } = useAuth();
  const [pendingSignatures, setPendingSignatures] = useState<PendingSignature[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch pending signatures when dialog opens
  const fetchPendingSignatures = async () => {
    setLoading(true);
    setFetchError(null);
    
    try {
      const { data, error } = await supabase
        .from("signing_requests")
        .select(`
          id,
          sent_at,
          recipient:recipients(full_name, email),
          requirement:requirements(title)
        `)
        .eq("organization_id", organizationId)
        .eq("status", "pending")
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false });

      if (error) throw error;

      const signatures: PendingSignature[] = (data || []).map((item: any) => ({
        id: item.id,
        recipientName: item.recipient?.full_name || "Unknown",
        recipientEmail: item.recipient?.email || "",
        requirementTitle: item.requirement?.title || "Unknown",
        sentAt: item.sent_at,
      }));

      setPendingSignatures(signatures);
      // Select all by default
      setSelectedIds(new Set(signatures.map((s) => s.id)));
    } catch (error: any) {
      console.error("Error fetching pending signatures:", error);
      setFetchError("Failed to load pending signatures");
    } finally {
      setLoading(false);
    }
  };

  // Fetch when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      fetchPendingSignatures();
    } else {
      setPendingSignatures([]);
      setSelectedIds(new Set());
    }
    onOpenChange(newOpen);
  };

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === pendingSignatures.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pendingSignatures.map((s) => s.id)));
    }
  };

  const handleSendReminders = async () => {
    if (selectedIds.size === 0) {
      toast.error("Please select at least one recipient");
      return;
    }

    setSending(true);
    let successCount = 0;
    let errorCount = 0;

    const selectedSignatures = pendingSignatures.filter((s) => selectedIds.has(s.id));

    for (const signature of selectedSignatures) {
      try {
        // Generate new token for the reminder
        const token = crypto.randomUUID();
        const tokenHash = await hashToken(token);
        
        // Get the base URL
        const baseUrl = window.location.origin;
        const signingUrl = `${baseUrl}/sign/${token}`;

        // Update the signing request with new token
        const { error: updateError } = await supabase
          .from("signing_requests")
          .update({
            token_hash: tokenHash,
            sent_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
          })
          .eq("id", signature.id);

        if (updateError) throw updateError;

        // Send the email
        const { error: emailError } = await supabase.functions.invoke("send-signing-email", {
          body: {
            recipientName: signature.recipientName,
            recipientEmail: signature.recipientEmail,
            requirementTitle: signature.requirementTitle,
            signingUrl,
            organizationName,
          },
        });

        if (emailError) throw emailError;

        // Log the reminder
        await supabase.from("reminder_logs").insert({
          signing_request_id: signature.id,
          organization_id: organizationId,
          sent_by: user?.id || null,
          trigger_type: "manual",
          email_sent: true,
        });

        successCount++;
      } catch (error: any) {
        console.error(`Error sending reminder to ${signature.recipientEmail}:`, error);
        
        // Log failed reminder attempt
        await supabase.from("reminder_logs").insert({
          signing_request_id: signature.id,
          organization_id: organizationId,
          sent_by: user?.id || null,
          trigger_type: "manual",
          email_sent: false,
          error_message: error?.message || "Unknown error",
        });
        
        errorCount++;
      }
    }

    setSending(false);

    if (successCount > 0) {
      toast.success(`Sent ${successCount} reminder${successCount !== 1 ? "s" : ""} successfully`);
    }
    if (errorCount > 0) {
      toast.error(`Failed to send ${errorCount} reminder${errorCount !== 1 ? "s" : ""}`);
    }

    if (successCount > 0) {
      onSuccess?.();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Send Bulk Reminders
          </DialogTitle>
          <DialogDescription>
            Send reminder emails to recipients with pending signatures.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : fetchError ? (
          <div className="py-8 text-center text-muted-foreground">
            {fetchError}
          </div>
        ) : pendingSignatures.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No pending signatures to remind.
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 pb-2 border-b">
              <Checkbox
                checked={selectedIds.size === pendingSignatures.length}
                onCheckedChange={toggleSelectAll}
              />
              <span className="text-sm text-muted-foreground">
                {selectedIds.size} of {pendingSignatures.length} selected
              </span>
            </div>

            <ScrollArea className="max-h-[300px]">
              <div className="space-y-2">
                {pendingSignatures.map((signature) => (
                  <div
                    key={signature.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedIds.has(signature.id)
                        ? "bg-accent/10 border-accent/30"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => toggleSelection(signature.id)}
                  >
                    <Checkbox
                      checked={selectedIds.has(signature.id)}
                      onCheckedChange={() => toggleSelection(signature.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {signature.recipientName}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {signature.recipientEmail}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {signature.requirementTitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="hero"
            onClick={handleSendReminders}
            disabled={sending || selectedIds.size === 0 || loading}
          >
            {sending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send {selectedIds.size} Reminder{selectedIds.size !== 1 ? "s" : ""}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Simple hash function for tokens
async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
