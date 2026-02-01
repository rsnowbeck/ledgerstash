import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ResendOptions {
  signingRequestId: string;
  recipientName: string;
  recipientEmail: string;
  requirementTitle: string;
  organizationId: string;
  organizationName: string;
  senderName?: string | null;
  senderEmail?: string | null;
  logoUrl?: string | null;
  userId?: string;
  onSuccess?: () => void;
}

export function useResendSigningLink() {
  const [resending, setResending] = useState<string | null>(null);

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

  const resend = async (options: ResendOptions) => {
    const {
      signingRequestId,
      recipientName,
      recipientEmail,
      requirementTitle,
      organizationId,
      organizationName,
      senderName,
      senderEmail,
      logoUrl,
      userId,
      onSuccess,
    } = options;

    setResending(signingRequestId);

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

      // Use production custom domain
      const baseUrl = "https://getattestly.com";
      const signingUrl = `${baseUrl}/sign/${token}`;

      // Send email with the new link
      const { error: emailError } = await supabase.functions.invoke("send-signing-email", {
        body: {
          recipientName,
          recipientEmail,
          requirementTitle,
          signingUrl,
          organizationName,
          senderName,
          senderEmail,
          logoUrl,
          isReminder: true,
        },
      });

      if (emailError) {
        console.error("Error sending email:", emailError);
        toast.error("Link generated but failed to send email");
      } else {
        // Log the reminder
        await supabase.from("reminder_logs").insert({
          signing_request_id: signingRequestId,
          organization_id: organizationId,
          sent_by: userId || null,
          trigger_type: "manual",
          email_sent: true,
        });

        toast.success(`Reminder sent to ${recipientEmail}`);
      }

      onSuccess?.();
    } catch (error: any) {
      console.error("Error resending link:", error);
      toast.error(error.message || "Failed to resend link");
    } finally {
      setResending(null);
    }
  };

  return { resend, resending };
}
