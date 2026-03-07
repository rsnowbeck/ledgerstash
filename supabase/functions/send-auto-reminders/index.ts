import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Validate caller: internal secret OR valid JWT
    const internalSecret = req.headers.get("x-internal-secret");
    const expectedSecret = Deno.env.get("INTERNAL_FUNCTION_SECRET");

    let authorized = false;
    if (expectedSecret && internalSecret === expectedSecret) {
      authorized = true;
    }

    if (!authorized) {
      const authHeader = req.headers.get("Authorization");
      if (authHeader?.startsWith("Bearer ")) {
        const supabaseAuth = createClient(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_ANON_KEY")!,
          { global: { headers: { Authorization: authHeader } } }
        );
        const { data, error } = await supabaseAuth.auth.getUser();
        if (!error && data?.user) authorized = true;
      }
    }

    if (!authorized) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    console.log("Starting auto-reminder job (tasks/docs)...");

    // Get all firms
    const { data: firms, error: firmsError } = await supabase
      .from("firms")
      .select("id, name, owner_id");

    if (firmsError) throw firmsError;
    console.log(`Processing ${firms?.length || 0} firms`);

    let totalSent = 0;
    let totalFailed = 0;

    for (const firm of firms || []) {
      // Get firm's org settings for reminder config
      const { data: members } = await supabase
        .from("firm_members")
        .select("profile_id")
        .eq("firm_id", firm.id)
        .limit(1);

      if (!members?.length) continue;

      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", members[0].profile_id)
        .single();

      if (!profile?.organization_id) continue;

      const { data: org } = await supabase
        .from("organizations")
        .select("auto_reminder_enabled, auto_reminder_days, plan, sender_name, sender_email, logo_url, name")
        .eq("id", profile.organization_id)
        .single();

      if (!org?.auto_reminder_enabled) continue;

      const reminderDays = org.auto_reminder_days || 7;

      // Get all active clients for this firm
      const { data: clients } = await supabase
        .from("clients")
        .select("id, email, first_name, last_name")
        .eq("firm_id", firm.id)
        .eq("status", "active");

      if (!clients?.length) continue;

      for (const client of clients) {
        // Get pending/overdue tasks for this client
        const { data: pendingTasks } = await supabase
          .from("tasks")
          .select("id, title, due_date, status, priority")
          .eq("client_id", client.id)
          .neq("status", "completed");

        if (!pendingTasks?.length) continue;

        // Check if we have an active access token for this client
        const { data: accessToken } = await supabase
          .from("client_access_tokens")
          .select("id")
          .eq("client_id", client.id)
          .eq("is_revoked", false)
          .gt("expires_at", new Date().toISOString())
          .limit(1);

        // Skip if client hasn't been invited yet (no portal link)
        if (!accessToken?.length) {
          console.log(`Skipping ${client.email} - no active portal link`);
          continue;
        }

        // Build task summary
        const overdueTasks = pendingTasks.filter(t => t.due_date && new Date(t.due_date) < new Date());
        const upcomingTasks = pendingTasks.filter(t => !t.due_date || new Date(t.due_date) >= new Date());

        const isUrgent = overdueTasks.length > 0;
        const subject = isUrgent
          ? `Action needed: ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? "s" : ""} from ${firm.name}`
          : `Reminder: ${pendingTasks.length} pending task${pendingTasks.length > 1 ? "s" : ""} from ${firm.name}`;

        // Build tasks HTML
        const taskRows = pendingTasks.map(t => {
          const isOverdue = t.due_date && new Date(t.due_date) < new Date();
          const dueText = t.due_date ? new Date(t.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "No due date";
          const color = isOverdue ? "#ef4444" : t.priority === "high" ? "#f59e0b" : "#71717a";
          return `
            <tr>
              <td style="padding: 10px 16px; border-bottom: 1px solid #e4e4e7;">
                <p style="margin: 0; font-size: 14px; font-weight: 500; color: #18181b;">${t.title}</p>
              </td>
              <td style="padding: 10px 16px; border-bottom: 1px solid #e4e4e7; text-align: right;">
                <span style="font-size: 12px; color: ${color}; font-weight: 500;">${isOverdue ? "⚠️ " : ""}${dueText}</span>
              </td>
            </tr>
          `;
        }).join("");

        // Get portal URL - we can't reconstruct the original token, but we can tell them to check their email
        const baseUrl = Deno.env.get("SITE_URL") || "https://getattestly.lovable.app";

        try {
          const { error: emailError } = await resend.emails.send({
            from: "LedgerStash <noreply@ledgerstash.com>",
            reply_to: org.sender_email || undefined,
            to: [client.email],
            subject,
            html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
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
              <p style="margin: 0 0 16px; font-size: 16px; color: #3f3f46;">Hi ${client.first_name},</p>
              <p style="margin: 0 0 24px; font-size: 16px; color: #3f3f46; line-height: 1.6;">
                ${isUrgent
                  ? `You have <strong>${overdueTasks.length} overdue</strong> task${overdueTasks.length > 1 ? "s" : ""} from <strong>${firm.name}</strong>. Please take action as soon as possible.`
                  : `This is a friendly reminder that you have <strong>${pendingTasks.length}</strong> pending task${pendingTasks.length > 1 ? "s" : ""} from <strong>${firm.name}</strong>.`
                }
              </p>

              ${isUrgent ? `
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 16px;">
                <tr>
                  <td style="padding: 12px 16px; background-color: #fef2f2; border-radius: 8px; border-left: 4px solid #ef4444;">
                    <p style="margin: 0; font-size: 14px; color: #dc2626; font-weight: 500;">⏰ ${overdueTasks.length} task${overdueTasks.length > 1 ? "s are" : " is"} past due</p>
                  </td>
                </tr>
              </table>` : ""}

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #fafafa; border-radius: 8px; border: 1px solid #e4e4e7; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e4e4e7;">
                    <p style="margin: 0; font-size: 12px; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Your Tasks</p>
                  </td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e4e4e7; text-align: right;">
                    <p style="margin: 0; font-size: 12px; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px;">Due</p>
                  </td>
                </tr>
                ${taskRows}
              </table>

              <p style="margin: 0 0 24px; font-size: 14px; color: #52525b; line-height: 1.5;">
                Open your secure portal to upload documents and complete tasks. Check your original invitation email for your portal link.
              </p>

              <p style="margin: 0; font-size: 14px; color: #71717a;">
                If you have questions, contact your accountant at ${firm.name}.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px; border-top: 1px solid #e4e4e7; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #a1a1aa;">If you didn't expect this email, you can safely ignore it.</p>
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

          if (emailError) throw emailError;
          totalSent++;
          console.log(`Sent reminder to ${client.email} (${pendingTasks.length} tasks)`);
        } catch (emailError: any) {
          console.error(`Failed to send to ${client.email}:`, emailError);
          totalFailed++;
        }
      }
    }

    console.log(`Auto-reminder job completed. Sent: ${totalSent}, Failed: ${totalFailed}`);

    return new Response(
      JSON.stringify({ success: true, sent: totalSent, failed: totalFailed }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in send-auto-reminders:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
