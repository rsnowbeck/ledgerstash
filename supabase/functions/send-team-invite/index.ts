import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface TeamInviteRequest {
  email: string;
  token: string;
  role: string;
  organizationName: string;
  inviterName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Validate authorization
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claims?.claims) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { email, token: inviteToken, role, organizationName, inviterName }: TeamInviteRequest = await req.json();

    // Validate required fields
    if (!email || !inviteToken || !organizationName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build the invite URL - use published URL if available, otherwise preview
    const baseUrl = Deno.env.get("SITE_URL") || "https://getattestly.lovable.app";
    const inviteUrl = `${baseUrl}/accept-invite?token=${inviteToken}`;

    const roleLabel = role === "admin" ? "Administrator" : role === "viewer" ? "Viewer" : "Member";

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Team Invitation</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 480px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #18181b;">You're Invited!</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 0 32px 24px 32px;">
              <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #3f3f46;">
                ${inviterName ? `<strong>${inviterName}</strong> has invited you` : "You've been invited"} to join <strong>${organizationName}</strong> on Attestly as a <strong>${roleLabel}</strong>.
              </p>
              
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 22px; color: #71717a;">
                Attestly helps teams manage compliance acknowledgments and policy signatures. Accept this invitation to collaborate with your team.
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="${inviteUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; background-color: #18181b; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 8px;">
                      Accept Invitation
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Link fallback -->
          <tr>
            <td style="padding: 0 32px 24px 32px;">
              <p style="margin: 0; font-size: 12px; line-height: 18px; color: #a1a1aa;">
                Or copy and paste this link into your browser:
              </p>
              <p style="margin: 8px 0 0 0; font-size: 12px; line-height: 18px; color: #3b82f6; word-break: break-all;">
                ${inviteUrl}
              </p>
            </td>
          </tr>
          
          <!-- Expiry notice -->
          <tr>
            <td style="padding: 0 32px 32px 32px;">
              <p style="margin: 0; font-size: 12px; line-height: 18px; color: #a1a1aa;">
                This invitation will expire in 7 days. If you have questions, contact <a href="mailto:support@attestly.com" style="color: #3b82f6;">support@attestly.com</a>.
              </p>
              <p style="margin: 8px 0 0 0; font-size: 12px; line-height: 18px; color: #a1a1aa;">
                If you didn't expect this invitation, you can safely ignore this email.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; border-top: 1px solid #e4e4e7; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #a1a1aa;">
                Attestly — Compliance signature management
              </p>
              <p style="margin: 8px 0 0 0; font-size: 11px; color: #d4d4d8;">
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
    `;

    const { error: emailError } = await resend.emails.send({
      from: "Attestly <noreply@getattestly.com>",
      to: [email],
      subject: `You're invited to join ${organizationName} on Attestly`,
      html: emailHtml,
    });

    if (emailError) {
      console.error("Resend error:", emailError);
      throw new Error("Failed to send email");
    }

    console.log(`Team invitation email sent to ${email} for org ${organizationName}`);

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in send-team-invite function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
