import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const internalSecret = Deno.env.get("INTERNAL_FUNCTION_SECRET");
    const authHeader = req.headers.get("x-internal-secret");
    if (!internalSecret || authHeader !== internalSecret) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { clientId, fileName, fileType } = await req.json();
    if (!clientId || !fileName) {
      return new Response(JSON.stringify({ error: "Missing clientId or fileName" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get client info + firm
    const { data: client } = await supabase
      .from("clients")
      .select("first_name, last_name, firm_id")
      .eq("id", clientId)
      .single();

    if (!client?.firm_id) {
      return new Response(JSON.stringify({ error: "Client not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get firm owner
    const { data: firm } = await supabase
      .from("firms")
      .select("owner_id, name")
      .eq("id", client.firm_id)
      .single();

    if (!firm?.owner_id) {
      return new Response(JSON.stringify({ success: false, reason: "No firm owner" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get owner's profile + org settings
    const { data: profile } = await supabase
      .from("profiles")
      .select("email, full_name, organization_id")
      .eq("id", firm.owner_id)
      .single();

    if (!profile?.organization_id || !profile?.email) {
      return new Response(JSON.stringify({ success: false, reason: "No profile/email" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if upload notifications are enabled
    const { data: org } = await supabase
      .from("organizations")
      .select("upload_notifications_enabled, upload_notification_mode, sender_name, sender_email")
      .eq("id", profile.organization_id)
      .single();

    if (!org?.upload_notifications_enabled) {
      return new Response(JSON.stringify({ success: true, skipped: true, reason: "Notifications disabled" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const clientName = `${client.first_name} ${client.last_name}`;
    const cpaName = profile.full_name || "there";
    const firmName = firm.name || "your firm";

    // Send via Brevo
    const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
    if (!BREVO_API_KEY) {
      console.error("BREVO_API_KEY not configured");
      return new Response(JSON.stringify({ error: "Email service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const senderName = org.sender_name || firmName || "LedgerStash";
    const senderEmail = "notifications@ledgerstash.com";

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #f8fafc; border-radius: 12px; padding: 32px; border: 1px solid #e2e8f0;">
          <h2 style="color: #1a1a2e; margin: 0 0 16px; font-size: 20px;">📄 New Document Uploaded</h2>
          <p style="color: #4a5568; margin: 0 0 20px; font-size: 15px;">
            Hi ${cpaName},
          </p>
          <p style="color: #4a5568; margin: 0 0 20px; font-size: 15px;">
            <strong>${clientName}</strong> just uploaded a document to their vault:
          </p>
          <div style="background: white; border-radius: 8px; padding: 16px; border: 1px solid #e2e8f0; margin: 0 0 24px;">
            <p style="margin: 0; font-size: 15px; color: #1a1a2e;">
              <strong>File:</strong> ${fileName}
            </p>
            ${fileType ? `<p style="margin: 4px 0 0; font-size: 13px; color: #718096;">Type: ${fileType}</p>` : ""}
          </div>
          <p style="color: #718096; font-size: 13px; margin: 0;">
            Log in to your dashboard to view and manage this document.
          </p>
        </div>
        <p style="text-align: center; color: #a0aec0; font-size: 11px; margin-top: 16px;">
          ${senderName} · Powered by LedgerStash
        </p>
      </div>
    `;

    const emailRes = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: profile.email, name: cpaName }],
        subject: `${clientName} uploaded "${fileName}" to their vault`,
        htmlContent: emailHtml,
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error("Brevo error:", emailRes.status, errText);
      return new Response(JSON.stringify({ error: "Failed to send notification email" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-upload-notification error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
