import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const hookSecret = Deno.env.get("SEND_EMAIL_HOOK_SECRET") as string;

interface AuthEmailPayload {
  user: {
    email: string;
    user_metadata?: {
      full_name?: string;
    };
  };
  email_data: {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: string;
    site_url: string;
    token_new?: string;
    token_hash_new?: string;
  };
}

// Attestly branded email template
function generateEmailHtml(
  title: string,
  previewText: string,
  heading: string,
  bodyText: string,
  buttonText: string,
  buttonUrl: string,
  footerNote: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f6f9fc;">
      <!-- Preview text (hidden) -->
      <div style="display: none; max-height: 0; overflow: hidden;">${previewText}</div>
      
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f6f9fc;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <!-- Logo Section -->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px; margin-bottom: 24px;">
              <tr>
                <td align="center">
                  <table role="presentation" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="padding-right: 8px; vertical-align: middle;">
                        <div style="width: 40px; height: 40px; background-color: #0f172a; border-radius: 8px; text-align: center; line-height: 40px;">
                          <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2L3 7V12C3 16.55 6.84 20.74 12 22C17.16 20.74 21 16.55 21 12V7L12 2Z'/%3E%3C/svg%3E" alt="Shield" style="width: 20px; height: 20px; vertical-align: middle;" />
                        </div>
                      </td>
                      <td style="vertical-align: middle;">
                        <span style="font-size: 24px; font-weight: 700; color: #0f172a;">Attestly</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Main Card -->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <tr>
                <td style="padding: 40px;">
                  <h1 style="margin: 0 0 24px; font-size: 24px; font-weight: 600; color: #0f172a; text-align: center;">${heading}</h1>
                  
                  <p style="margin: 0 0 24px; font-size: 16px; line-height: 24px; color: #334155;">${bodyText}</p>
                  
                  <!-- CTA Button -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 32px 0;">
                    <tr>
                      <td align="center">
                        <a href="${buttonUrl}" style="display: inline-block; padding: 14px 32px; background-color: #0f172a; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px;">
                          ${buttonText}
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 16px 0 0; font-size: 14px; color: #64748b; line-height: 20px;">Or copy and paste this link into your browser:</p>
                  <p style="margin: 8px 0 16px; font-size: 12px; color: #0d9488; word-break: break-all; line-height: 16px;">${buttonUrl}</p>
                  
                  <p style="margin: 16px 0 0; font-size: 14px; color: #64748b; line-height: 20px;">${footerNote}</p>
                </td>
              </tr>
            </table>

            <!-- Footer -->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px; margin-top: 24px;">
              <tr>
                <td align="center">
                  <p style="margin: 0; font-size: 12px; color: #94a3b8;">© ${new Date().getFullYear()} Attestly. All rights reserved.</p>
                  <p style="margin: 4px 0 0; font-size: 12px; color: #94a3b8;">Compliance acknowledgments, simplified.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const payload = await req.text();
  const headers = Object.fromEntries(req.headers);

  let emailPayload: AuthEmailPayload;

  // Verify webhook signature
  try {
    const wh = new Webhook(hookSecret);
    emailPayload = wh.verify(payload, headers) as AuthEmailPayload;
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return new Response(
      JSON.stringify({ error: { http_code: 401, message: "Invalid signature" } }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const { user, email_data } = emailPayload;
  const { token, token_hash, redirect_to, email_action_type } = email_data;
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";

  console.log("Processing auth email:", {
    email: user.email,
    action: email_action_type,
    redirect_to,
  });

  try {
    // Build the confirmation URL that Supabase expects
    const confirmUrl = `${supabaseUrl}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${encodeURIComponent(redirect_to)}`;

    let subject: string;
    let html: string;

    switch (email_action_type) {
      case "recovery":
        subject = "Reset your Attestly password";
        html = generateEmailHtml(
          "Reset Password",
          "Reset your Attestly password",
          "Reset Your Password",
          "We received a request to reset your password. Click the button below to create a new password:",
          "Reset Password",
          confirmUrl,
          "If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged. This link will expire in 1 hour for security reasons."
        );
        break;

      case "magiclink":
        subject = "Your Attestly login link";
        html = generateEmailHtml(
          "Sign In",
          "Sign in to your Attestly account",
          "Sign In to Attestly",
          "Click the button below to sign in to your Attestly account:",
          "Sign In",
          confirmUrl,
          "If you didn't request this email, you can safely ignore it. This link will expire in 1 hour for security reasons."
        );
        break;

      case "signup":
      case "email_confirmation":
        subject = "Confirm your Attestly email";
        html = generateEmailHtml(
          "Confirm Email",
          "Confirm your Attestly email address",
          "Confirm Your Email",
          "Thanks for signing up for Attestly! Please confirm your email address by clicking the button below:",
          "Confirm Email",
          confirmUrl,
          "If you didn't create an Attestly account, you can safely ignore this email."
        );
        break;

      case "invite":
        subject = "You've been invited to Attestly";
        html = generateEmailHtml(
          "Invitation",
          "You've been invited to join Attestly",
          "You're Invited!",
          "You've been invited to join a team on Attestly. Click the button below to accept the invitation and set up your account:",
          "Accept Invitation",
          confirmUrl,
          "If you weren't expecting this invitation, you can safely ignore this email."
        );
        break;

      case "email_change":
        subject = "Confirm your new email address";
        html = generateEmailHtml(
          "Email Change",
          "Confirm your new email address",
          "Confirm Email Change",
          "You requested to change your email address. Click the button below to confirm your new email:",
          "Confirm Email",
          confirmUrl,
          "If you didn't request this change, please contact support immediately."
        );
        break;

      default:
        console.log("Unknown email action type:", email_action_type);
        subject = "Attestly notification";
        html = generateEmailHtml(
          "Notification",
          "Attestly notification",
          "Action Required",
          "Please click the button below to continue:",
          "Continue",
          confirmUrl,
          "If you didn't expect this email, you can safely ignore it."
        );
    }

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: "Attestly <noreply@getattestly.com>",
      to: [user.email],
      subject,
      html,
    });

    if (emailResponse.error) {
      console.error("Resend error:", emailResponse.error);
      throw emailResponse.error;
    }

    console.log("Email sent successfully to:", user.email);

    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error sending auth email:", error);
    return new Response(
      JSON.stringify({
        error: {
          http_code: 500,
          message: error.message || "Failed to send email",
        },
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
