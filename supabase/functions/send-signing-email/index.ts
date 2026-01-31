import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface SigningEmailRequest {
  recipientName: string;
  recipientEmail: string;
  requirementTitle: string;
  signingUrl: string;
  organizationName?: string;
  senderName?: string;
  senderEmail?: string;
  logoUrl?: string;
  isReminder?: boolean;
  daysUntilDue?: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { 
      recipientName, 
      recipientEmail, 
      requirementTitle, 
      signingUrl,
      organizationName = "Your organization",
      senderName,
      senderEmail,
      logoUrl,
      isReminder = false,
      daysUntilDue
    }: SigningEmailRequest = await req.json();

    // Validate required fields
    if (!recipientName || !recipientEmail || !requirementTitle || !signingUrl) {
      console.error("Missing required fields:", { recipientName, recipientEmail, requirementTitle, signingUrl });
      throw new Error("Missing required fields: recipientName, recipientEmail, requirementTitle, signingUrl");
    }

    const displaySenderName = senderName || organizationName;
    const subject = isReminder 
      ? `Reminder: Please sign "${requirementTitle}"`
      : `Action Required: Please sign "${requirementTitle}"`;
    
    const introText = isReminder
      ? `This is a friendly reminder that your signature is still needed on the following document:`
      : `${displaySenderName} has requested your signature on the following document:`;

    const buttonText = isReminder ? "Review & Sign Now" : "Review & Sign Document";

    // Build due date warning HTML if this is a reminder with days until due
    let dueWarningHtml = "";
    if (isReminder && daysUntilDue !== undefined) {
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

    // Build logo HTML if provided
    let logoHtml = "";
    if (logoUrl) {
      logoHtml = `
        <img src="${logoUrl}" alt="${organizationName} logo" style="height: 32px; max-width: 120px; object-fit: contain; margin-bottom: 8px;" />
      `;
    }

    console.log(`Sending ${isReminder ? "reminder" : "signing request"} email to ${recipientEmail} for "${requirementTitle}"`);

    const emailResponse = await resend.emails.send({
      from: `Attestly <noreply@getattestly.com>`,
      reply_to: senderEmail || undefined,
      to: [recipientEmail],
      subject,
      html: `
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
                        Hi ${recipientName},
                      </p>
                      <p style="margin: 0 0 24px; font-size: 16px; color: #3f3f46; line-height: 1.6;">
                        ${introText}
                      </p>
                      
                      <!-- Document Card -->
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #fafafa; border-radius: 8px; border: 1px solid #e4e4e7; margin-bottom: 16px;">
                        <tr>
                          <td style="padding: 16px;">
                            <p style="margin: 0; font-size: 14px; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px;">Document</p>
                            <p style="margin: 4px 0 0; font-size: 16px; font-weight: 600; color: #18181b;">${requirementTitle}</p>
                          </td>
                        </tr>
                      </table>

                      ${dueWarningHtml}
                      
                      <!-- CTA Button -->
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td align="center">
                            <a href="${signingUrl}" style="display: inline-block; padding: 14px 32px; background-color: #18181b; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 500; border-radius: 8px;">
                              ${buttonText}
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 24px 0 0; font-size: 14px; color: #71717a; line-height: 1.6;">
                        If you have any questions, please contact your organization administrator${senderEmail ? ` at <a href="mailto:${senderEmail}" style="color: #2563eb;">${senderEmail}</a>` : ""} or reach out to <a href="mailto:support@attestly.com" style="color: #2563eb;">support@attestly.com</a>.
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
                        Need help? <a href="mailto:support@attestly.com" style="color: #a1a1aa;">support@attestly.com</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-signing-email function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
