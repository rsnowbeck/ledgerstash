import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, getClientIP, rateLimitResponse } from "../_shared/rate-limit.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ── helpers ──────────────────────────────────────────────────────────

async function hashToken(token: string): Promise<string> {
  const data = new TextEncoder().encode(token);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function buildClientSystemPrompt(client: any, tasks: any[], documents: any[], firmName: string) {
  const completedTasks = tasks.filter(t => t.status === "completed");
  const pendingTasks = tasks.filter(t => t.status !== "completed");
  const completionPct = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  const pendingList = pendingTasks.map(t => `- ${t.title} (${t.priority} priority${t.due_date ? `, due ${t.due_date}` : ""})`).join("\n");
  const completedList = completedTasks.map(t => `- ${t.title} ✅`).join("\n");
  const docList = documents.map(d => `- ${d.file_name} (uploaded ${new Date(d.created_at).toLocaleDateString()})`).join("\n");

  return `You are the LedgerStash AI Client Assistant — a helpful, friendly support bot inside a client document vault portal.

IMPORTANT RULES:
- You MUST NEVER give tax advice, legal advice, or financial recommendations. If asked, say: "I can't provide tax or legal advice. Please reach out to your accountant ${firmName ? `at ${firmName}` : ""} directly for that."
- You MUST stay on topic. Only discuss this client's documents, tasks, uploads, and general platform usage. Politely decline off-topic requests.
- If you cannot answer a question, say: "I don't have enough information to answer that. I'd recommend messaging your accountant through the secure messaging feature in this portal."
- NEVER make up or guess information about the client's tax situation.

CLIENT CONTEXT:
- Client: ${client.first_name} ${client.last_name} (${client.email})
- Firm: ${firmName || "Your accounting firm"}
- Overall completion: ${completionPct}% (${completedTasks.length} of ${tasks.length} items done)

PENDING ITEMS (still needed):
${pendingList || "None — all items are complete! 🎉"}

COMPLETED ITEMS:
${completedList || "None yet"}

UPLOADED DOCUMENTS:
${docList || "No documents uploaded yet"}

You can:
1. Tell the client exactly what they still need to provide, by name
2. Explain what each pending item means in plain language
3. Guide them on how to upload documents through the portal
4. Answer general questions about the portal features
5. Congratulate them on progress and encourage completion

Keep answers concise, friendly, and helpful. Use markdown formatting.`;
}

function buildCPASystemPrompt(profile: any, orgData: any) {
  const { clients, allTasks, allDocuments, orgSettings } = orgData;

  const clientSummaries = clients.map((c: any) => {
    const clientTasks = allTasks.filter((t: any) => t.client_id === c.id);
    const completed = clientTasks.filter((t: any) => t.status === "completed").length;
    const total = clientTasks.length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    const clientDocs = allDocuments.filter((d: any) => d.client_id === c.id);
    const pendingItems = clientTasks.filter((t: any) => t.status !== "completed").map((t: any) => t.title);
    return {
      name: `${c.first_name} ${c.last_name}`,
      email: c.email,
      id: c.id,
      status: c.status,
      completion: pct,
      totalTasks: total,
      completedTasks: completed,
      pendingItems,
      documentCount: clientDocs.length,
      lastUpload: clientDocs.length > 0 ? clientDocs[0].created_at : null,
    };
  });

  // Pre-compute useful aggregates
  const below50 = clientSummaries.filter((c: any) => c.completion < 50);
  const noUploads7Days = clientSummaries.filter((c: any) => {
    if (!c.lastUpload) return c.totalTasks > 0;
    const days = (Date.now() - new Date(c.lastUpload).getTime()) / (1000 * 60 * 60 * 24);
    return days > 7;
  });

  return `You are the LedgerStash AI CPA Assistant — a powerful operational intelligence bot for accounting firm staff.

IMPORTANT RULES:
- You MUST stay on topic: only discuss firm operations, client status, platform features, and compliance.
- You can reference specific client data provided below to answer operational questions.
- NEVER give tax advice to the CPA — you are a platform assistant, not a tax advisor.
- When suggesting actions, you can offer to execute them (send reminders, etc.) by outputting a special action block.

CPA CONTEXT:
- User: ${profile.full_name || profile.email}
- Organization: ${orgSettings.name}
- Plan: ${orgSettings.plan || "trial"}
- Auto-reminders: ${orgSettings.auto_reminder_enabled ? `Enabled (every ${orgSettings.auto_reminder_days} days)` : "Disabled"}
- Total clients: ${clients.length}

CLIENT PORTFOLIO OVERVIEW:
${clientSummaries.map((c: any) => 
  `• ${c.name} (${c.email}) — ${c.completion}% complete (${c.completedTasks}/${c.totalTasks} items), ${c.documentCount} docs${c.pendingItems.length > 0 ? `, pending: ${c.pendingItems.join(", ")}` : " ✅ all done"}`
).join("\n")}

QUICK STATS:
- Clients below 50% completion: ${below50.length}${below50.length > 0 ? ` (${below50.map((c: any) => c.name).join(", ")})` : ""}
- Clients with no uploads in 7+ days: ${noUploads7Days.length}${noUploads7Days.length > 0 ? ` (${noUploads7Days.map((c: any) => c.name).join(", ")})` : ""}
- Average completion: ${clientSummaries.length > 0 ? Math.round(clientSummaries.reduce((a: number, c: any) => a + c.completion, 0) / clientSummaries.length) : 0}%

AVAILABLE ACTIONS:
You can offer to perform these actions. When the user confirms, output them as action blocks:
- Send a reminder to a specific client: [ACTION:SEND_REMINDER:client_id:client_name]
- Send reminders to all clients below a threshold: [ACTION:BULK_REMIND:threshold_pct]

Example: If the CPA says "send a reminder to John Smith", respond with confirmation and include [ACTION:SEND_REMINDER:uuid-here:John Smith]

You can answer questions like:
- "Which clients haven't uploaded anything in 7 days?"
- "Who is still missing a W-2?"
- "Which clients are less than 50% complete?"
- "Give me a status summary of all clients"
- "How do I set up auto-reminders?"
- "Send a reminder to [client name]"

Keep answers concise and data-driven. Use markdown formatting with tables when presenting multiple clients.`;
}

// ── main handler ─────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Rate limiting
    const clientIP = getClientIP(req);
    if (!checkRateLimit(`ai-chat:${clientIP}`, 30, 60_000)) {
      return rateLimitResponse(corsHeaders);
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body = await req.json();
    const { messages, context } = body;
    // context: { type: "client" | "cpa", clientToken?: string, conversationId?: string }

    let systemPrompt: string;
    let conversationId = body.conversationId || null;
    let orgId: string | null = null;
    let clientId: string | null = null;

    if (context?.type === "client" && context.clientToken) {
      // ── CLIENT-SIDE: inject client-specific context ──
      const tokenHash = await hashToken(context.clientToken);
      const { data: accessToken } = await supabase
        .from("client_access_tokens")
        .select("client_id, expires_at, is_revoked")
        .eq("token_hash", tokenHash)
        .single();

      if (!accessToken || accessToken.is_revoked || new Date(accessToken.expires_at) < new Date()) {
        return new Response(JSON.stringify({ error: "Invalid or expired session" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      clientId = accessToken.client_id;

      const [clientRes, tasksRes, docsRes] = await Promise.all([
        supabase.from("clients").select("id, first_name, last_name, email, firm_id").eq("id", clientId).single(),
        supabase.from("tasks").select("id, title, description, due_date, status, priority").eq("client_id", clientId).order("created_at", { ascending: false }),
        supabase.from("documents").select("id, file_name, file_type, created_at").eq("client_id", clientId).order("created_at", { ascending: false }),
      ]);

      let firmName = "";
      if (clientRes.data?.firm_id) {
        const { data: firm } = await supabase.from("firms").select("name, owner_id").eq("id", clientRes.data.firm_id).single();
        firmName = firm?.name || "";
        if (firm?.owner_id) {
          const { data: prof } = await supabase.from("profiles").select("organization_id").eq("id", firm.owner_id).single();
          orgId = prof?.organization_id || null;
        }
      }

      systemPrompt = buildClientSystemPrompt(clientRes.data, tasksRes.data || [], docsRes.data || [], firmName);

    } else if (context?.type === "cpa") {
      // ── CPA-SIDE: inject full portfolio context ──
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        return new Response(JSON.stringify({ error: "Authorization required" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (authError || !user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: profile } = await supabase.from("profiles").select("full_name, email, organization_id").eq("id", user.id).single();
      if (!profile?.organization_id) {
        return new Response(JSON.stringify({ error: "No organization found" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      orgId = profile.organization_id;

      // Get firm
      const { data: firmMember } = await supabase.from("firm_members").select("firm_id").eq("profile_id", user.id).single();
      
      let clients: any[] = [];
      let allTasks: any[] = [];
      let allDocuments: any[] = [];

      if (firmMember) {
        const { data: c } = await supabase.from("clients").select("id, first_name, last_name, email, status").eq("firm_id", firmMember.firm_id).eq("status", "active");
        clients = c || [];

        if (clients.length > 0) {
          const clientIds = clients.map(cl => cl.id);
          const { data: t } = await supabase.from("tasks").select("id, title, status, priority, due_date, client_id").in("client_id", clientIds);
          allTasks = t || [];

          const { data: d } = await supabase.from("documents").select("id, file_name, created_at, client_id").in("client_id", clientIds).order("created_at", { ascending: false });
          allDocuments = d || [];
        }
      }

      const { data: orgSettings } = await supabase.from("organizations").select("name, plan, auto_reminder_enabled, auto_reminder_days").eq("id", orgId).single();

      systemPrompt = buildCPASystemPrompt(profile, {
        clients,
        allTasks,
        allDocuments,
        orgSettings: orgSettings || { name: "Your Firm", plan: "trial", auto_reminder_enabled: false, auto_reminder_days: 7 },
      });

    } else {
      // Fallback: require authentication
      const authHeader = req.headers.get("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return new Response(JSON.stringify({ error: "Authorization required" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (authError || !user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      systemPrompt = `You are the LedgerStash AI Assistant — a helpful, concise support agent for an accounting firm client vault platform.

IMPORTANT RULES:
- NEVER give tax advice, legal advice, or financial recommendations.
- Stay on topic: only discuss LedgerStash platform features and usage.
- If you don't know something, say so honestly.

Key platform facts:
- Plans: Solo Practitioner ($49/mo, 25 clients), Boutique Firm ($149/mo, 100 clients), Enterprise Vault ($199/mo, unlimited)
- 14-day free trial on all plans
- Clients access via secure email links — no accounts needed
- AES-256 encryption at rest, TLS 1.2+ in transit
- MFA, configurable session timeouts, auto-reminders
- PBC template library with 10 pre-built checklists
- AI client support bot and AI CPA operations bot
- Secure two-way messaging between CPA and client
- White-label branding options

Keep answers concise. Use markdown formatting.`;
    }

    // ── Create/persist conversation ──
    if (!conversationId && orgId) {
      const { data: conv } = await supabase.from("ai_conversations").insert({
        client_id: clientId,
        organization_id: orgId,
        user_type: context?.type || "cpa",
        user_id: context?.type === "cpa" ? (await supabase.auth.getUser(req.headers.get("Authorization")?.replace("Bearer ", "") || "")).data?.user?.id : null,
      }).select("id").single();
      conversationId = conv?.id || null;
    }

    // ── Log user message ──
    const lastUserMsg = messages[messages.length - 1];
    if (conversationId && lastUserMsg?.role === "user") {
      await supabase.from("ai_messages").insert({
        conversation_id: conversationId,
        role: "user",
        content: lastUserMsg.content,
      });
      // Update message count
      await supabase.from("ai_conversations").update({
        message_count: messages.filter((m: any) => m.role === "user").length,
      }).eq("id", conversationId);
    }

    // ── Call AI ──
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
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please try again later." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Stream response back, collect full text for logging ──
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();
    let fullAssistantText = "";

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();

    (async () => {
      let buf = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          buf += chunk;
          await writer.write(encoder.encode(chunk));

          // Extract content for logging
          let idx: number;
          while ((idx = buf.indexOf("\n")) !== -1) {
            let line = buf.slice(0, idx);
            buf = buf.slice(idx + 1);
            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (!line.startsWith("data: ")) continue;
            const json = line.slice(6).trim();
            if (json === "[DONE]") continue;
            try {
              const p = JSON.parse(json);
              const c = p.choices?.[0]?.delta?.content;
              if (c) fullAssistantText += c;
            } catch { /* partial */ }
          }
        }
      } finally {
        // Log assistant response
        if (conversationId && fullAssistantText) {
          await supabase.from("ai_messages").insert({
            conversation_id: conversationId,
            role: "assistant",
            content: fullAssistantText,
          }).catch(e => console.error("Failed to log assistant message:", e));
        }
        await writer.close();
      }
    })();

    return new Response(readable, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "X-Conversation-Id": conversationId || "",
      },
    });

  } catch (e) {
    console.error("ai-assistant error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
