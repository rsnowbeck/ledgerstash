import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { messages } = await req.json();

    const systemPrompt = `You are the LedgerStash AI Assistant — a helpful, concise support agent for an accounting firm client vault platform called LedgerStash (displayed as "Ledger Stash" in marketing).

Your job is to help logged-in accountants and firm staff with questions about using the platform. You should:

1. **Answer product questions**: How to add clients, create PBC lists, send document requests, use templates, upload documents, manage tasks, etc.
2. **Explain compliance**: Briefly explain IRS Publication 4557, FTC Safeguards Rule, GLBA requirements and how LedgerStash helps meet them.
3. **Guide features**: White-label branding, auto-reminders, team management, billing/plans, audit exports, CSV imports.
4. **Troubleshoot**: Help with common issues like file uploads, client invites, portal access.

Key platform facts:
- Plans: Solo Firm ($29/mo, 25 clients), Boutique Firm ($79/mo, 100 clients), Enterprise Vault ($199/mo, unlimited)
- 14-day free trial on all plans
- Clients access via secure email links — no accounts or passwords needed
- Documents are encrypted with AES-256 at rest, TLS 1.2+ in transit
- MFA/2FA via TOTP authenticator apps
- Session timeouts configurable (IRS recommends 15-30 min)
- Auto-reminders for missing documents and overdue tasks
- PBC template library with pre-built checklists (1040, 1120-S, 1065, etc.)
- White-label: Solo gets logo+name, Boutique+ gets full white-labeling (no "Powered by" footer)
- Audit export generates timestamped document manifests

Keep answers concise (2-4 sentences when possible). Use markdown formatting. Be friendly and professional. If you don't know something specific about the platform, say so honestly rather than guessing.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-assistant error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
