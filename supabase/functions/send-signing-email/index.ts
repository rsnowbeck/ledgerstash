import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type EmailType = "initial" | "reminder" | "escalated" | "overdue";

interface SigningEmailRequest {
  recipientName: string;
  recipientEmail: string;
  requirementTitle: string;
  signingUrl: string;
  organizationName?: string;
  senderName?: string;
  senderEmail?: string;
  logoUrl?: string;
  emailType?: EmailType;
  dueDate?: string; // ISO date string
  daysUntilDue?: number;
  sendCount?: number;
  isPro?: boolean; // Whether the org is on Pro plan (for branding)
}

function formatDueDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function getEmailContent(
  emailType: EmailType,
  requirementTitle: string,
  senderName: string | undefined,
  organizationName: string,
  isPro: boolean,
  dueDate?: string,
  daysUntilDue?: number
): { subject: string; intro: string; buttonText: string; dueText: string; consequence: string; closing: string; footer: string } {
  const formattedDueDate = dueDate ? formatDueDate(dueDate) : null;
  
  // For non-Pro users, use Attestly branding only
  const displayOrg = isPro ? organizationName : "Attestly";
  
  // Build the intro line - include "on behalf of [Org]" only for Pro users with a sender name
  const intro = (isPro && senderName)
    ? `${senderName} has requested that you review and sign the following document on behalf of ${organizationName}:`
    : `${displayOrg} has requested that you review and sign the following document:`;
  
  // Standard closing for all email types
  const closing = `This request is part of a formal document acknowledgment process initiated by ${displayOrg}.`;
  
  // Standard footer for all email types
  const footer = `If you have questions, please contact the requester or your primary contact at ${displayOrg}.`;
  
  switch (emailType) {
    case "initial":
      return {
        subject: `Action required: Please sign ${requirementTitle}`,
        intro,
        buttonText: "Review & Sign Now",
        dueText: formattedDueDate 
          ? `Please complete your signature by ${formattedDueDate}.`
          : `Please complete your signature as soon as possible.`,
        consequence: ``,
        closing,
        footer,
      };
    
    case "reminder":
      return {
        subject: `Reminder: Please sign ${requirementTitle}`,
        intro,
        buttonText: "Review & Sign Now",
        dueText: formattedDueDate
          ? `Please complete your signature by ${formattedDueDate}.`
          : `Please complete your signature as soon as possible.`,
        consequence: ``,
        closing,
        footer,
      };
    
    case "escalated":
      const daysText = daysUntilDue !== undefined && daysUntilDue > 0
        ? `${daysUntilDue} day${daysUntilDue === 1 ? "" : "s"}`
        : "soon";
      return {
        subject: `Action required: ${requirementTitle} signature due in ${daysText}`,
        intro,
        buttonText: "Review & Sign Now",
        dueText: formattedDueDate
          ? `⏰ Due in ${daysText} (${formattedDueDate})`
          : `Please complete this as soon as possible.`,
        consequence: `Missing this deadline may be flagged in your organization's compliance records.`,
        closing,
        footer,
      };
    
    case "overdue":
      return {
        subject: `Overdue: ${requirementTitle} signature was due ${formattedDueDate || "recently"}`,
        intro,
        buttonText: "Review & Sign Now",
        dueText: formattedDueDate
          ? `The due date was ${formattedDueDate}.`
          : `This signature request is now overdue.`,
        consequence: `This has been marked as incomplete in your organization's compliance records.`,
        closing,
        footer,
      };
    
    default:
      return {
        subject: `Action required: Please sign ${requirementTitle}`,
        intro,
        buttonText: "Review & Sign Now",
        dueText: formattedDueDate
          ? `Please complete your signature by ${formattedDueDate}.`
          : `Please complete your signature as soon as possible.`,
        consequence: ``,
        closing,
        footer,
      };
  }
}

function determineEmailType(
  explicitType?: EmailType,
  daysUntilDue?: number,
  sendCount?: number
): EmailType {
  // If explicit type provided, use it
  if (explicitType) return explicitType;
  
  // Auto-determine based on context
  if (daysUntilDue !== undefined) {
    if (daysUntilDue < 0) return "overdue";
    if (daysUntilDue <= 5 || (sendCount && sendCount >= 3)) return "escalated";
  }
  
  if (sendCount && sendCount > 1) return "reminder";
  
  return "initial";
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
      emailType: explicitEmailType,
      dueDate,
      daysUntilDue,
      sendCount,
      isPro = false
    }: SigningEmailRequest = await req.json();

    // Validate required fields
    if (!recipientName || !recipientEmail || !requirementTitle || !signingUrl) {
      console.error("Missing required fields:", { recipientName, recipientEmail, requirementTitle, signingUrl });
      throw new Error("Missing required fields: recipientName, recipientEmail, requirementTitle, signingUrl");
    }

    // Determine email type based on context
    const emailType = determineEmailType(explicitEmailType, daysUntilDue, sendCount);
    const { subject, intro, buttonText, dueText, consequence, closing, footer } = getEmailContent(
      emailType,
      requirementTitle,
      senderName,
      organizationName,
      isPro,
      dueDate,
      daysUntilDue
    );

    // Build due date display HTML - simple text for initial, styled box for escalated/overdue
    let dueDateHtml = "";
    if (dueText) {
      const isOverdue = emailType === "overdue";
      const isEscalated = emailType === "escalated";
      
      if (isOverdue || isEscalated) {
        const bgColor = isOverdue ? "#fef2f2" : "#fffbeb";
        const borderColor = isOverdue ? "#ef4444" : "#f59e0b";
        const textColor = isOverdue ? "#dc2626" : "#d97706";
        
        dueDateHtml = `
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 16px; margin-bottom: 16px;">
            <tr>
              <td style="padding: 12px 16px; background-color: ${bgColor}; border-radius: 8px; border-left: 4px solid ${borderColor};">
                <p style="margin: 0; font-size: 14px; color: ${textColor}; font-weight: 500;">${dueText}</p>
              </td>
            </tr>
          </table>
        `;
      } else {
        // Simple text for initial/reminder
        dueDateHtml = `<p style="margin: 16px 0; font-size: 14px; color: #3f3f46;">${dueText}</p>`;
      }
    }

    // Build logo HTML - only for Pro users with a custom logo
    let logoHtml = "";
    if (isPro && logoUrl) {
      logoHtml = `
        <img src="${logoUrl}" alt="${organizationName} logo" style="height: 32px; max-width: 120px; object-fit: contain; margin-bottom: 8px;" />
      `;
    }

    console.log(`Sending ${emailType} email to ${recipientEmail} for "${requirementTitle}"`);

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
                    <td style="padding: 32px 32px 24px; text-align: center;">
                      ${logoHtml}
                      <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #18181b;">Attestly</h1>
                      <hr style="margin-top: 20px; border: none; border-top: 1px solid #e4e4e7;" />
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 32px;">
                      <p style="margin: 0 0 16px; font-size: 16px; color: #3f3f46;">
                        Hi ${recipientName},
                      </p>
                      <p style="margin: 0 0 24px; font-size: 16px; color: #3f3f46; line-height: 1.6;">
                        ${intro}
                      </p>
                      
                      <!-- Document Card -->
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #fafafa; border-radius: 8px; border: 1px solid #e4e4e7; margin-bottom: 8px;">
                        <tr>
                          <td style="padding: 16px;">
                            <p style="margin: 0; font-size: 14px; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px;">Document</p>
                            <p style="margin: 4px 0 0; font-size: 16px; font-weight: 600; color: #18181b;">${requirementTitle}</p>
                          </td>
                        </tr>
                      </table>

                      ${dueDateHtml}

                      ${consequence ? `<p style="margin: 0 0 16px; font-size: 13px; color: #71717a; font-style: italic; line-height: 1.5;">${consequence}</p>` : ""}
                      
                      ${closing ? `<p style="margin: 0 0 24px; font-size: 14px; color: #52525b; line-height: 1.5;">${closing}</p>` : ""}
                      
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
                        ${footer}
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 24px 32px; border-top: 1px solid #e4e4e7; text-align: center;">
                      <p style="margin: 0; font-size: 12px; color: #a1a1aa;">
                        If you didn't expect this email, you can safely ignore it.
                      </p>
                      <p style="margin: 12px 0 0; font-size: 11px; color: #d4d4d8;">
                        Powered by <a href="https://getattestly.com" style="color: #a1a1aa; text-decoration: none;">Attestly</a>
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
