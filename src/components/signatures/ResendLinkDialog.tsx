import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Copy, Check, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface ResendLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  signingRequestId: string;
  recipientName: string;
  recipientEmail: string;
  requirementTitle: string;
  onSuccess?: () => void;
}

export function ResendLinkDialog({
  open,
  onOpenChange,
  signingRequestId,
  recipientName,
  recipientEmail,
  requirementTitle,
  onSuccess,
}: ResendLinkDialogProps) {
  const [generating, setGenerating] = useState(false);
  const [signingUrl, setSigningUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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

  const handleResend = async () => {
    setGenerating(true);

    try {
      const token = generateSecureToken();
      const tokenHash = await hashToken(token);

      // Update the signing request with new token and reset expiry
      const { error } = await supabase
        .from("signing_requests")
        .update({
          token_hash: tokenHash,
          sent_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        })
        .eq("id", signingRequestId);

      if (error) throw error;

      const baseUrl = window.location.origin;
      setSigningUrl(`${baseUrl}/sign/${token}`);
      toast.success("New signing link generated");
      onSuccess?.();
    } catch (error: any) {
      console.error("Error resending link:", error);
      toast.error(error.message || "Failed to generate new link");
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (!signingUrl) return;
    await navigator.clipboard.writeText(signingUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setSigningUrl(null);
      setCopied(false);
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Resend Signing Link
          </DialogTitle>
          <DialogDescription>
            Generate a new signing link for {recipientName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <div className="text-sm space-y-1">
              <p>
                <span className="text-muted-foreground">Recipient:</span>{" "}
                <span className="font-medium text-foreground">{recipientName}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Email:</span>{" "}
                <span className="text-foreground">{recipientEmail}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Requirement:</span>{" "}
                <span className="text-foreground">{requirementTitle}</span>
              </p>
            </div>
          </div>

          {!signingUrl ? (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-4">
                This will invalidate the previous link and generate a new one.
              </p>
              <Button onClick={handleResend} disabled={generating}>
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Generate New Link
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 rounded-lg border border-border bg-background">
                <p className="text-xs text-muted-foreground mb-2">New signing link:</p>
                <code className="text-xs text-foreground block truncate">
                  {signingUrl}
                </code>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleClose}
                >
                  Close
                </Button>
                <Button
                  className="flex-1"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Link
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
