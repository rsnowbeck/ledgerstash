import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { checkRateLimit, getClientIP, rateLimitResponse } from "../_shared/rate-limit.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Generate a secure random token
function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

// Hash the token using SHA-256
async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// LedgerStash branded email template
function generateEmailHtml(resetUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset your LedgerStash password</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f6f9fc;">
      <!-- Preview text (hidden) -->
      <div style="display: none; max-height: 0; overflow: hidden;">Reset your LedgerStash password</div>
      
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
                        <span style="font-size: 24px; font-weight: 700; color: #0f172a;">LedgerStash</span>
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
                  <h1 style="margin: 0 0 24px; font-size: 24px; font-weight: 600; color: #0f172a; text-align: center;">Reset Your Password</h1>
                  
                  <p style="margin: 0 0 24px; font-size: 16px; line-height: 24px; color: #334155;">We received a request to reset your password. Click the button below to create a new password:</p>
                  
                  <!-- CTA Button -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 32px 0;">
                    <tr>
                      <td align="center">
                        <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background-color: #0f172a; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px;">
                          Reset Password
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 16px 0 0; font-size: 14px; color: #64748b; line-height: 20px;">Or copy and paste this link into your browser:</p>
                  <p style="margin: 8px 0 16px; font-size: 12px; color: #0d9488; word-break: break-all; line-height: 16px;">${resetUrl}</p>
                  
                  <p style="margin: 16px 0 0; font-size: 14px; color: #64748b; line-height: 20px;">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged. This link will expire in 1 hour for security reasons.</p>
                </td>
              </tr>
            </table>

            <!-- Footer -->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px; margin-top: 24px;">
              <tr>
                <td align="center">
                  <p style="margin: 0; font-size: 12px; color: #94a3b8;">© ${new Date().getFullYear()} LedgerStash. All rights reserved.</p>
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

interface RequestBody {
  email: string;
  redirectUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limit: 5 requests per minute per IP (strictest - prevents email bombing)
  const clientIP = getClientIP(req);
  if (!checkRateLimit(`send-reset:${clientIP}`, 5, 60_000)) {
    return rateLimitResponse(corsHeaders);
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const { email, redirectUrl }: RequestBody = await req.json();

    // Validate redirectUrl against allowed origins to prevent token exfiltration
    const ALLOWED_ORIGINS = [
      "https://ledgerstash.com",
      "https://www.ledgerstash.com",
      "https://getattestly.lovable.app",
    ];
    if (!redirectUrl || !ALLOWED_ORIGINS.some((origin) => redirectUrl.startsWith(origin))) {
      return new Response(
        JSON.stringify({ error: "Invalid redirect URL" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user exists in auth.users
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      console.error("Error fetching users:", userError);
      // Don't reveal if user exists - always return success
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const user = userData.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());

    if (!user) {
      // Don't reveal if user exists - always return success
      console.log("User not found, returning success anyway for security");
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Generate token and hash
    const token = generateToken();
    const tokenHash = await hashToken(token);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Delete any existing unused tokens for this user
    await supabase
      .from("password_reset_tokens")
      .delete()
      .eq("email", email.toLowerCase())
      .is("used_at", null);

    // Store the new token
    const { error: insertError } = await supabase
      .from("password_reset_tokens")
      .insert({
        user_id: user.id,
        email: email.toLowerCase(),
        token_hash: tokenHash,
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) {
      console.error("Error storing token:", insertError);
      throw new Error("Failed to create reset token");
    }

    // Build the reset URL with the token
    const resetUrl = `${redirectUrl}?token=${token}`;

    // Send the branded email
    const emailResponse = await resend.emails.send({
      from: "LedgerStash <noreply@ledgerstash.com>",
      to: [email],
      subject: "Reset your LedgerStash password",
      html: generateEmailHtml(resetUrl),
    });

    if (emailResponse.error) {
      console.error("Resend error:", emailResponse.error);
      throw emailResponse.error;
    }

    console.log("Password reset email sent successfully to:", email);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-password-reset:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send reset email" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
