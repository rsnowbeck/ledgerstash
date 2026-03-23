const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { pdfUrl, pdfName, clientName } = await req.json();
    if (!pdfUrl) {
      return new Response(JSON.stringify({ error: "pdfUrl is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Scanning prior-year return for:", clientName || "unknown client");

    const systemPrompt = `You are a CPA tax return analyzer. Given a prior-year tax return PDF (typically a 1040), identify all income sources, deductions, credits, and supporting schedules present.

For each item found, generate a PBC (Provided By Client) checklist item that the CPA would need from the client for the NEXT tax year.

Return a JSON array of objects with:
- "title": concise PBC task title (e.g. "W-2 from Acme Corp", "1099-INT from Chase Bank")
- "category": one of "income", "deductions", "credits", "business", "investments", "rental", "other"
- "priority": "high" for primary income sources, "medium" for deductions/credits, "low" for minor items
- "description": brief note about what was found and what's needed (1 sentence)
- "schedule": which IRS schedule/form this relates to (e.g. "Schedule C", "Schedule E", "Form W-2")

Look for:
1. W-2 wages (employer names if visible)
2. 1099-INT/DIV interest and dividends (institution names)
3. 1099-NEC/MISC self-employment income
4. Schedule C business income/expenses
5. Schedule D capital gains (brokerage statements)
6. Schedule E rental income
7. K-1 partnership/S-corp income
8. Schedule A itemized deductions (mortgage interest 1098, property tax, charitable)
9. Education credits (1098-T)
10. Child/dependent care (Form 2441)
11. HSA contributions (Form 8889)
12. IRA/retirement contributions
13. Estimated tax payments made
14. State/local tax returns filed

Return ONLY a valid JSON array. No markdown, no explanation. If you cannot determine items, return a reasonable default checklist for a standard 1040 filer.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Analyze this prior-year tax return PDF and generate a PBC checklist for the next tax year. Client: ${clientName || "Unknown"}. Document: ${pdfName || "tax return"}. URL: ${pdfUrl}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({
        items: getDefaultChecklist(),
        aiGenerated: false,
        message: "Could not analyze the PDF. A default checklist has been generated instead.",
      }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content || "[]";
    console.log("AI response preview:", content.substring(0, 200));

    let items = [];
    try {
      let cleaned = content.trim();
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      }
      items = JSON.parse(cleaned);
      if (!Array.isArray(items)) items = [];

      items = items.map((item: any, i: number) => ({
        title: item.title || `Item ${i + 1}`,
        category: ["income", "deductions", "credits", "business", "investments", "rental", "other"].includes(item.category) ? item.category : "other",
        priority: ["high", "medium", "low"].includes(item.priority) ? item.priority : "medium",
        description: item.description || "",
        schedule: item.schedule || "",
      }));
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      items = getDefaultChecklist();
    }

    if (items.length === 0) {
      items = getDefaultChecklist();
    }

    console.log(`Generated ${items.length} PBC items`);

    return new Response(JSON.stringify({
      items,
      aiGenerated: true,
      message: `Generated ${items.length} PBC items from the prior-year return.`,
    }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function getDefaultChecklist() {
  return [
    { title: "W-2 Wage Statements (all employers)", category: "income", priority: "high", description: "Collect W-2s from all employers for the tax year", schedule: "Form W-2" },
    { title: "1099-INT / 1099-DIV (interest & dividends)", category: "income", priority: "high", description: "Bank and brokerage interest/dividend statements", schedule: "Schedule B" },
    { title: "1099-NEC / 1099-MISC (freelance income)", category: "income", priority: "medium", description: "Any contract or freelance income received", schedule: "Schedule C" },
    { title: "Mortgage Interest Statement (Form 1098)", category: "deductions", priority: "medium", description: "Mortgage interest paid during the year", schedule: "Schedule A" },
    { title: "Property Tax Statements", category: "deductions", priority: "medium", description: "Real estate property tax payments", schedule: "Schedule A" },
    { title: "Charitable Donation Receipts", category: "deductions", priority: "low", description: "Receipts for charitable contributions over $250", schedule: "Schedule A" },
    { title: "Health Insurance (Form 1095-A/B/C)", category: "other", priority: "medium", description: "Health insurance coverage documentation", schedule: "Form 8962" },
    { title: "Estimated Tax Payments Made", category: "other", priority: "high", description: "Quarterly estimated tax payment confirmations", schedule: "Form 1040-ES" },
    { title: "Prior Year Tax Return (for reference)", category: "other", priority: "low", description: "Copy of last year's filed return", schedule: "Form 1040" },
    { title: "Government-Issued ID (copy)", category: "other", priority: "high", description: "Valid photo ID for identity verification", schedule: "" },
  ];
}
