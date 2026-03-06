import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Require authentication - validate JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the JWT by creating a client scoped to the user
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { pdfUrl, pdfName } = await req.json();

    if (!pdfUrl) {
      return new Response(
        JSON.stringify({ error: "pdfUrl is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Detecting fields for PDF:", pdfName || pdfUrl);

    // Use AI to analyze the PDF and detect form fields
    const prompt = `You are a PDF form field detector. Analyze this PDF document and identify all fillable form fields.

For each detected field, return a JSON object with:
- "key": a snake_case unique identifier (e.g., "employee_name", "date_of_birth")  
- "label": the human-readable label near the field (e.g., "Employee Name", "Date of Birth")
- "type": one of "text", "checkbox", "signature", "date", "email", "number"
- "required": boolean, true if the field appears mandatory (has asterisk, "required" label, etc.)
- "page": page number (1-indexed)
- "x": approximate x position as percentage of page width (0-100)
- "y": approximate y position as percentage of page height (0-100)
- "width": approximate width as percentage of page width (5-90)
- "height": approximate height as percentage of page height (2-15)

Look for:
1. Empty lines or underscores next to labels (text inputs)
2. Empty squares or boxes (checkboxes)
3. "Signature" or "Sign here" areas (signature fields)
4. Date fields near "Date" labels
5. Email fields near "Email" labels
6. Any labeled blank space meant to be filled in

Return ONLY a valid JSON array of field objects. No markdown, no explanation.
If no fields are detected, return an empty array [].`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: prompt },
          { 
            role: "user", 
            content: [
              { type: "text", text: `Analyze this PDF document and detect all form fields. The document is titled "${pdfName || 'Unknown'}". URL: ${pdfUrl}` },
            ]
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // If AI can't process the PDF, return default fields
      console.log("AI could not process PDF, returning default fields");
      return new Response(
        JSON.stringify({ 
          fields: getDefaultFields(),
          autoDetected: false,
          message: "Could not auto-detect fields. Default fields have been added for you to customize."
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content || "[]";
    
    console.log("AI response content:", content.substring(0, 200));

    // Parse the AI response
    let fields = [];
    try {
      // Strip markdown code fences if present
      let cleaned = content.trim();
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      }
      fields = JSON.parse(cleaned);
      
      if (!Array.isArray(fields)) {
        fields = [];
      }

      // Validate and sanitize each field
      fields = fields.map((f: any, i: number) => ({
        id: crypto.randomUUID(),
        key: f.key || `field_${i + 1}`,
        label: f.label || `Field ${i + 1}`,
        type: ["text", "checkbox", "signature", "date", "email", "number"].includes(f.type) ? f.type : "text",
        required: Boolean(f.required),
        page: Math.max(1, parseInt(f.page) || 1),
        x: Math.min(100, Math.max(0, parseFloat(f.x) || 10)),
        y: Math.min(100, Math.max(0, parseFloat(f.y) || (10 + i * 8))),
        width: Math.min(90, Math.max(5, parseFloat(f.width) || 30)),
        height: Math.min(15, Math.max(2, parseFloat(f.height) || 4)),
      }));
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      fields = getDefaultFields();
    }

    // If no fields detected, provide defaults
    if (fields.length === 0) {
      fields = getDefaultFields();
    }

    console.log(`Detected ${fields.length} fields`);

    return new Response(
      JSON.stringify({ 
        fields,
        autoDetected: true,
        message: `Detected ${fields.length} field(s). Please review and adjust before publishing.`
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error detecting fields:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function getDefaultFields() {
  return [
    {
      id: crypto.randomUUID(),
      key: "full_name",
      label: "Full Name",
      type: "text",
      required: true,
      page: 1,
      x: 10,
      y: 70,
      width: 35,
      height: 4,
    },
    {
      id: crypto.randomUUID(),
      key: "date",
      label: "Date",
      type: "date",
      required: true,
      page: 1,
      x: 55,
      y: 70,
      width: 20,
      height: 4,
    },
    {
      id: crypto.randomUUID(),
      key: "signature",
      label: "Signature",
      type: "signature",
      required: true,
      page: 1,
      x: 10,
      y: 80,
      width: 40,
      height: 8,
    },
  ];
}
