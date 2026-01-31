import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Use service role key to bypass RLS for automated tasks
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    console.log("Starting auto-reminder job...");

    // Fetch organizations with auto-reminders enabled
    const { data: organizations, error: orgError } = await supabase
      .from("organizations")
      .select("id, name, auto_reminder_days, sender_name, sender_email, logo_url")
      .eq("auto_reminder_enabled", true)
      .not("auto_reminder_days", "is", null);

    if (orgError) {
      console.error("Error fetching organizations:", orgError);
      throw orgError;
    }

    console.log(`Found ${organizations?.length || 0} organizations with auto-reminders enabled`);

    let totalSent = 0;
    let totalFailed = 0;

    for (const org of organizations || []) {
      // Find pending signing requests that need reminders
      // Get requests where the last reminder (or sent_at) was more than auto_reminder_days ago
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - (org.auto_reminder_days || 7));

      const { data: pendingRequests, error: reqError } = await supabase
        .from("signing_requests")
        .select(`
          id,
          sent_at,
          token_hash,
          recipient_id,
          requirement_id
        `)
        .eq("organization_id", org.id)
        .eq("status", "pending")
        .gt("expires_at", new Date().toISOString())
        .lt("sent_at", cutoffDate.toISOString());

      if (reqError) {
        console.error(`Error fetching requests for org ${org.id}:`, reqError);
        continue;
      }

      console.log(`Found ${pendingRequests?.length || 0} pending requests for org ${org.name}`);

      for (const request of pendingRequests || []) {
        // Get recipient and requirement data separately to avoid type issues
        const { data: recipient } = await supabase
          .from("recipients")
          .select("id, full_name, email")
          .eq("id", request.recipient_id)
          .single();

        const { data: requirement } = await supabase
          .from("requirements")
          .select("title, due_date")
          .eq("id", request.requirement_id)
          .single();

        if (!recipient || !requirement) {
          console.log(`Skipping request ${request.id} - missing recipient or requirement data`);
          continue;
        }

        // Check if we already sent a reminder recently
        const { data: recentReminders } = await supabase
          .from("reminder_logs")
          .select("id")
          .eq("signing_request_id", request.id)
          .gte("sent_at", cutoffDate.toISOString())
          .limit(1);

        if (recentReminders && recentReminders.length > 0) {
          console.log(`Skipping request ${request.id} - reminder sent recently`);
          continue;
        }

        // Generate new token and signing URL
        const token = crypto.randomUUID();
        const tokenHash = await hashToken(token);
        const baseUrl = Deno.env.get("SITE_URL") || "https://getattestly.lovable.app";
        const signingUrl = `${baseUrl}/sign/${token}`;

        // Update the signing request with new token
        const { error: updateError } = await supabase
          .from("signing_requests")
          .update({
            token_hash: tokenHash,
            sent_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          })
          .eq("id", request.id);

        if (updateError) {
          console.error(`Error updating request ${request.id}:`, updateError);
          continue;
        }

        // Calculate days until due for urgency messaging
        let daysUntilDue: number | undefined;
        if (requirement.due_date) {
          const dueDate = new Date(requirement.due_date);
          const now = new Date();
          daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        }

        // Send the reminder email
        try {
          const displaySenderName = org.sender_name || org.name;
          const subject = `Reminder: Please sign "${requirement.title || "Document"}"`;

          // Build due date warning HTML
          let dueWarningHtml = "";
          if (daysUntilDue !== undefined) {
            const urgencyColor = daysUntilDue <= 1 ? "#ef4444" : daysUntilDue <= 3 ? "#f59e0b" : "#3b82f6";
            const dueText = daysUntilDue <= 0 ? "Due today" : daysUntilDue === 1 ? "Due tomorrow" : `Due in ${daysUntilDue} days`;
            dueWarningHtml = `
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 16px;">
                <tr>
                  <td style="padding: 12px 16px; background-color: ${urgencyColor}15; border-radius: 8px; border-left: 4px solid ${urgencyColor};">
                    <p style="margin: 0; font-size: 14px; color: ${urgencyColor}; font-weight: 500;">⏰ ${dueText}</p>
                  </td>
                </tr>
              </table>
            `;
          }

          // Build logo HTML
          let logoHtml = "";
          if (org.logo_url) {
            logoHtml = `<img src="${org.logo_url}" alt="${org.name} logo" style="height: 32px; max-width: 120px; object-fit: contain; margin-bottom: 8px;" />`;
          }

          const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #e4e4e7;">
              ${logoHtml}
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #18181b;">Attestly</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 16px; font-size: 16px; color: #3f3f46;">
                Hi ${recipient.full_name || "there"},
              </p>
              <p style="margin: 0 0 24px; font-size: 16px; color: #3f3f46; line-height: 1.6;">
                This is a friendly reminder that your signature is still needed on the following document:
              </p>
              
              <!-- Document Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #fafafa; border-radius: 8px; border: 1px solid #e4e4e7; margin-bottom: 16px;">
                <tr>
                  <td style="padding: 16px;">
                    <p style="margin: 0; font-size: 14px; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px;">Document</p>
                    <p style="margin: 4px 0 0; font-size: 16px; font-weight: 600; color: #18181b;">${requirement.title || "Document"}</p>
                  </td>
                </tr>
              </table>

              ${dueWarningHtml}
              
              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="${signingUrl}" style="display: inline-block; padding: 14px 32px; background-color: #18181b; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 500; border-radius: 8px;">
                      Review & Sign Now
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 24px 0 0; font-size: 14px; color: #71717a; line-height: 1.6;">
                If you have any questions, please contact your organization administrator${org.sender_email ? ` at <a href="mailto:${org.sender_email}" style="color: #2563eb;">${org.sender_email}</a>` : ""} or reach out to Support at <a href="mailto:hello@attestly.com" style="color: #2563eb;">hello@attestly.com</a>.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; border-top: 1px solid #e4e4e7; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #a1a1aa;">
                This email was sent by Attestly on behalf of ${displaySenderName}.
              </p>
              <p style="margin: 8px 0 0; font-size: 12px; color: #a1a1aa;">
                If you didn't expect this email, you can safely ignore it.
              </p>
              <p style="margin: 12px 0 0; font-size: 11px; color: #d4d4d8;">
                Support: <a href="mailto:hello@attestly.com" style="color: #a1a1aa;">hello@attestly.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
          `;

          const { error: emailError } = await resend.emails.send({
            from: "Attestly <noreply@getattestly.com>",
            reply_to: org.sender_email || undefined,
            to: [recipient.email || ""],
            subject,
            html: emailHtml,
          });

          if (emailError) throw emailError;

          // Log successful reminder
          await supabase.from("reminder_logs").insert({
            signing_request_id: request.id,
            organization_id: org.id,
            sent_by: null,
            trigger_type: "auto",
            email_sent: true,
          });

          totalSent++;
          console.log(`Sent auto-reminder to ${recipient.email} for ${requirement.title}`);
        } catch (emailError: any) {
          console.error(`Error sending email for request ${request.id}:`, emailError);

          // Log failed reminder
          await supabase.from("reminder_logs").insert({
            signing_request_id: request.id,
            organization_id: org.id,
            sent_by: null,
            trigger_type: "auto",
            email_sent: false,
            error_message: emailError?.message || "Email send failed",
          });

          totalFailed++;
        }
      }
    }

    console.log(`Auto-reminder job completed. Sent: ${totalSent}, Failed: ${totalFailed}`);

    return new Response(
      JSON.stringify({
        success: true,
        sent: totalSent,
        failed: totalFailed,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in send-auto-reminders function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

serve(handler);
