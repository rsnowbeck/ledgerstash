import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Validate JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: userData, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { clientId, firmName, senderName } = await req.json();
    if (!clientId) {
      return new Response(JSON.stringify({ error: "clientId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use service role to read client data and insert token
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get client info
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("id, email, first_name, last_name, firm_id")
      .eq("id", clientId)
      .single();

    if (clientError || !client) {
      return new Response(JSON.stringify({ error: "Client not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify the caller is a firm member
    const { data: membership } = await supabase
      .from("firm_members")
      .select("id")
      .eq("firm_id", client.firm_id)
      .eq("profile_id", userData.user.id)
      .single();

    if (!membership) {
      return new Response(JSON.stringify({ error: "Not authorized for this client" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Revoke any existing active tokens for this client
    await supabase
      .from("client_access_tokens")
      .update({ is_revoked: true })
      .eq("client_id", clientId)
      .eq("is_revoked", false);

    // Generate new token
    const token = crypto.randomUUID();
    const tokenHash = await hashToken(token);

    // Store token
    const { error: tokenError } = await supabase
      .from("client_access_tokens")
      .insert({
        client_id: clientId,
        token_hash: tokenHash,
        expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      });

    if (tokenError) {
      console.error("Token insert error:", tokenError);
      throw new Error("Failed to create access token");
    }

    // Build portal URL
    const baseUrl = Deno.env.get("SITE_URL") || "https://getattestly.lovable.app";
    const portalUrl = `${baseUrl}/portal/${token}`;

    const displayFirm = firmName || "Your Accountant";
    const displaySender = senderName || "Your accountant";

    // Send invite email
    const { error: emailError } = await resend.emails.send({
      from: "LedgerStash <noreply@ledgerstash.com>",
      to: [client.email],
      subject: `${displayFirm} has set up a secure document portal for you`,
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
          <tr>
            <td style="padding: 32px 32px 24px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #18181b;">LedgerStash</h1>
              <hr style="margin-top: 20px; border: none; border-top: 1px solid #e4e4e7;" />
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 32px;">
              <p style="margin: 0 0 16px; font-size: 16px; color: #3f3f46;">
                Hi ${client.first_name},
              </p>
              <p style="margin: 0 0 16px; font-size: 16px; color: #3f3f46; line-height: 1.6;">
                ${displaySender} at <strong>${displayFirm}</strong> has set up a secure document portal for you. Use it to upload tax documents, view tasks, and stay organized — no account or password needed.
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #fafafa; border-radius: 8px; border: 1px solid #e4e4e7; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px;">
                    <p style="margin: 0 0 8px; font-size: 14px; color: #71717a;">What you can do:</p>
                    <p style="margin: 0; font-size: 14px; color: #3f3f46; line-height: 1.8;">
                      ✅ Upload documents securely<br/>
                      ✅ View assigned tasks &amp; due dates<br/>
                      ✅ Track what's been completed
                    </p>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="${portalUrl}" style="display: inline-block; padding: 14px 32px; background-color: #18181b; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 500; border-radius: 8px;">
                      Open Your Portal
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0; font-size: 13px; color: #a1a1aa; line-height: 1.5;">
                🔒 Your documents are protected with AES-256 encryption. This link is unique to you — do not share it.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px; border-top: 1px solid #e4e4e7; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #a1a1aa;">
                If you didn't expect this email, you can safely ignore it.
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

    if (emailError) {
      console.error("Email error:", emailError);
      throw new Error("Failed to send invite email");
    }

    console.log(`Invite sent to ${client.email} for client ${clientId}`);

    return new Response(
      JSON.stringify({ success: true, portalUrl }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in send-client-invite:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
