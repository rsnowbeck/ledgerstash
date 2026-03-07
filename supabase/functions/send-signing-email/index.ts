import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
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
  customMessage?: string; // Optional plain-text message from the org
}

function formatDueDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

/**
 * Build the intro line with proper requester attribution.
 * Priority: requester + org → show both, requester only → show requester, 
 * org only → show org, never show Attestly as requester when either exists
 */
function buildIntroLine(
  senderName: string | undefined,
  organizationName: string | undefined
): string {
  const hasRequester = senderName && senderName.trim().length > 0;
  const hasOrg = organizationName && organizationName.trim().length > 0;

  if (hasRequester && hasOrg) {
    return `${senderName} from ${organizationName} has requested the following documents:`;
  } else if (hasRequester) {
    return `${senderName} has requested the following documents:`;
  } else if (hasOrg) {
    return `${organizationName} has requested the following documents:`;
  } else {
    return `Your accountant has requested the following documents:`;
  }
}

/**
 * Build vendor-safe closing statement.
 * Uses neutral language that works for both employees and external parties.
 */
function buildClosingStatement(organizationName: string | undefined): string {
  if (organizationName && organizationName.trim().length > 0) {
    return `This request is part of your document preparation process with ${organizationName}.`;
  }
  return `This request is part of your document preparation process.`;
}

function getEmailContent(
  emailType: EmailType,
  requirementTitle: string,
  senderName: string | undefined,
  organizationName: string | undefined,
  dueDate?: string,
  daysUntilDue?: number
): { subject: string; intro: string; buttonText: string; dueText: string; consequence: string; closing: string } {
  const formattedDueDate = dueDate ? formatDueDate(dueDate) : null;
  
  const intro = buildIntroLine(senderName, organizationName);
  const closing = buildClosingStatement(organizationName);
  
  // Build subject lines with proper due date handling
  const dueTextForSubject = formattedDueDate ? ` (due ${formattedDueDate})` : "";
  
  switch (emailType) {
    case "initial":
      return {
        subject: `Action required: Please upload your documents — ${requirementTitle}`,
        intro,
        buttonText: "Upload Documents",
        dueText: formattedDueDate 
          ? `Please submit your documents by ${formattedDueDate}.`
          : `Please submit your documents as soon as possible.`,
        consequence: ``,
        closing,
      };
    
    case "reminder":
      return {
        subject: `Reminder: Your documents are still needed — ${requirementTitle}`,
        intro,
        buttonText: "Upload Documents",
        dueText: formattedDueDate
          ? `Please submit your documents by ${formattedDueDate}.`
          : `Please submit your documents as soon as possible.`,
        consequence: ``,
        closing,
      };
    
    case "escalated":
      const daysText = daysUntilDue !== undefined && daysUntilDue > 0
        ? `${daysUntilDue} day${daysUntilDue === 1 ? "" : "s"}`
        : "soon";
      return {
        subject: `Urgent: ${requirementTitle} documents due in ${daysText}`,
        intro,
        buttonText: "Upload Documents",
        dueText: formattedDueDate
          ? `⏰ Due in ${daysText} (${formattedDueDate})`
          : `Please submit as soon as possible.`,
        consequence: `Missing this deadline may delay your tax filing.`,
        closing,
      };
    
    case "overdue":
      return {
        subject: formattedDueDate 
          ? `Final notice: ${requirementTitle} documents were due ${formattedDueDate}`
          : `Final notice: ${requirementTitle} documents are overdue`,
        intro,
        buttonText: "Upload Documents",
        dueText: formattedDueDate
          ? `The due date was ${formattedDueDate}.`
          : `These documents are now overdue.`,
        consequence: `These documents are overdue. Please submit them as soon as possible to avoid delays.`,
        closing,
      };
    
    default:
      return {
        subject: `Action required: Please upload your documents — ${requirementTitle}`,
        intro,
        buttonText: "Upload Documents",
        dueText: formattedDueDate
          ? `Please submit your documents by ${formattedDueDate}.`
          : `Please submit your documents as soon as possible.`,
        consequence: ``,
        closing,
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

/**
 * Build the custom message HTML block if a message is provided.
 * Rendered as a note/callout between the document card and the CTA.
 */
function buildCustomMessageHtml(customMessage?: string): string {
  if (!customMessage || customMessage.trim().length === 0) {
    return "";
  }
  
  // Sanitize the message - escape HTML entities
  const sanitized = customMessage
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
  
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 16px; margin-bottom: 16px;">
      <tr>
        <td style="padding: 12px 16px; background-color: #f0f9ff; border-radius: 8px; border-left: 4px solid #0ea5e9;">
          <p style="margin: 0 0 4px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #0369a1; font-weight: 600;">Note from sender</p>
          <p style="margin: 0; font-size: 14px; color: #0c4a6e; line-height: 1.5;">${sanitized}</p>
        </td>
      </tr>
    </table>
  `;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Validate caller is authenticated (JWT) or internal (shared secret)
    const authHeader = req.headers.get('Authorization');
    const internalSecret = req.headers.get('x-internal-secret');
    const expectedSecret = Deno.env.get('INTERNAL_FUNCTION_SECRET');

    const hasValidJwt = authHeader?.startsWith('Bearer ');
    const hasValidSecret = expectedSecret && internalSecret === expectedSecret;

    if (!hasValidJwt && !hasValidSecret) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { 
      recipientName, 
      recipientEmail, 
      requirementTitle, 
      signingUrl,
      organizationName,
      senderName,
      senderEmail,
      logoUrl,
      emailType: explicitEmailType,
      dueDate,
      daysUntilDue,
      sendCount,
      isPro = false,
      customMessage
    }: SigningEmailRequest = await req.json();

    // Validate required fields
    if (!recipientName || !recipientEmail || !requirementTitle || !signingUrl) {
      console.error("Missing required fields:", { recipientName, recipientEmail, requirementTitle, signingUrl });
      throw new Error("Missing required fields: recipientName, recipientEmail, requirementTitle, signingUrl");
    }

    // Determine email type based on context
    const emailType = determineEmailType(explicitEmailType, daysUntilDue, sendCount);
    const { subject, intro, buttonText, dueText, consequence, closing } = getEmailContent(
      emailType,
      requirementTitle,
      senderName,
      organizationName,
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

    // Build custom message HTML
    const customMessageHtml = buildCustomMessageHtml(customMessage);

    // Build logo HTML - Pro users get custom logo, everyone gets LedgerStash logo
    const ledgerStashLogoUrl = "https://urpqjnoowsdehvkrqxmy.supabase.co/storage/v1/object/public/email-assets/attestly-logo.png?v=1";
    let logoHtml = "";
    if (isPro && logoUrl) {
      // Pro users with custom logo: show their logo
      const logoAlt = organizationName ? `${organizationName} logo` : "Organization logo";
      logoHtml = `
        <img src="${logoUrl}" alt="${logoAlt}" style="height: 40px; max-width: 160px; object-fit: contain; margin-bottom: 12px;" />
      `;
    } else {
      // Default: show LedgerStash logo with shield
      logoHtml = `
        <img src="${ledgerStashLogoUrl}" alt="LedgerStash" style="height: 48px; width: 48px; object-fit: contain; margin-bottom: 12px; border-radius: 8px;" />
      `;
    }

    // Build footer with proper attribution
    const footerText = organizationName
      ? `If you have questions, please contact ${senderName || "the requester"} or your primary contact at ${organizationName}.`
      : `If you have questions, please contact ${senderName || "the requester"}.`;

    console.log(`Sending ${emailType} email to ${recipientEmail} for "${requirementTitle}"`);

    const emailResponse = await resend.emails.send({
      from: `LedgerStash <noreply@ledgerstash.com>`,
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
                      <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #18181b;">LedgerStash</h1>
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

                      ${customMessageHtml}

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
                        ${footerText}
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 24px 32px; border-top: 1px solid #e4e4e7; text-align: center;">
                      <p style="margin: 0; font-size: 12px; color: #a1a1aa;">
                        If you didn't expect this email, you can safely ignore it.
                      </p>
                      <p style="margin: 8px 0 0; font-size: 12px; color: #a1a1aa;">
                        Need help? Contact <a href="mailto:hello@ledgerstash.com" style="color: #71717a;">hello@ledgerstash.com</a>
                      </p>
                      <p style="margin: 12px 0 0; font-size: 11px; color: #d4d4d8;">
                        Powered by <a href="https://ledgerstash.com" style="color: #a1a1aa; text-decoration: none;">LedgerStash</a>
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
