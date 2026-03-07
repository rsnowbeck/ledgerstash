import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, rateLimitResponse } from "../_shared/rate-limit.ts";

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

  // Rate limit
  const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(clientIP, 20, 60000)) {
    return rateLimitResponse(corsHeaders);
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body = await req.json();
    const { action, token } = body;

    if (!token) {
      return new Response(JSON.stringify({ error: "Token required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const tokenHash = await hashToken(token);

    // Look up the token
    const { data: accessToken, error: tokenError } = await supabase
      .from("client_access_tokens")
      .select("id, client_id, expires_at, is_revoked")
      .eq("token_hash", tokenHash)
      .single();

    if (tokenError || !accessToken) {
      return new Response(JSON.stringify({ error: "Invalid or expired link" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (accessToken.is_revoked || new Date(accessToken.expires_at) < new Date()) {
      return new Response(JSON.stringify({ error: "This link has expired. Please contact your accountant for a new one." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Update last_used_at
    await supabase
      .from("client_access_tokens")
      .update({ last_used_at: new Date().toISOString() })
      .eq("id", accessToken.id);

    const clientId = accessToken.client_id;

    // ACTION: verify — return client data
    if (action === "verify") {
      const [clientRes, tasksRes, docsRes, foldersRes, firmRes] = await Promise.all([
        supabase.from("clients").select("id, first_name, last_name, email, firm_id").eq("id", clientId).single(),
        supabase.from("tasks").select("id, title, description, due_date, status, priority, created_at").eq("client_id", clientId).order("created_at", { ascending: false }),
        supabase.from("documents").select("id, file_name, file_type, file_size_bytes, created_at").eq("client_id", clientId).order("created_at", { ascending: false }),
        supabase.from("folders").select("id, name").eq("client_id", clientId).order("name"),
        supabase.from("clients").select("firm_id").eq("id", clientId).single(),
      ]);

      let firmName = "";
      if (firmRes.data?.firm_id) {
        const { data: firm } = await supabase.from("firms").select("name").eq("id", firmRes.data.firm_id).single();
        firmName = firm?.name || "";
      }

      return new Response(JSON.stringify({
        success: true,
        client: clientRes.data,
        tasks: tasksRes.data || [],
        documents: docsRes.data || [],
        folders: foldersRes.data || [],
        firmName,
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ACTION: update-task — mark a task status
    if (action === "update-task") {
      const { taskId, status } = body;
      if (!taskId || !status || !["pending", "in_progress", "completed"].includes(status)) {
        return new Response(JSON.stringify({ error: "Invalid task update" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Verify task belongs to this client
      const { data: task } = await supabase.from("tasks").select("id").eq("id", taskId).eq("client_id", clientId).single();
      if (!task) {
        return new Response(JSON.stringify({ error: "Task not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error: updateError } = await supabase.from("tasks").update({ status }).eq("id", taskId);
      if (updateError) throw updateError;

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ACTION: get-upload-url — generate signed upload URL
    if (action === "get-upload-url") {
      const { fileName, fileType } = body;
      if (!fileName) {
        return new Response(JSON.stringify({ error: "fileName required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const storagePath = `${clientId}/${Date.now()}-${fileName}`;

      // Create a signed upload URL
      const { data: signedUrl, error: signError } = await supabase.storage
        .from("client-documents")
        .createSignedUploadUrl(storagePath);

      if (signError) {
        console.error("Signed URL error:", signError);
        throw new Error("Failed to create upload URL");
      }

      return new Response(JSON.stringify({
        success: true,
        uploadUrl: signedUrl.signedUrl,
        storagePath,
        token: signedUrl.token,
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ACTION: confirm-upload — record document in DB after upload
    if (action === "confirm-upload") {
      const { fileName, fileType, fileSize, storagePath } = body;
      if (!fileName || !storagePath) {
        return new Response(JSON.stringify({ error: "Missing upload details" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Get client's profile_id or use a placeholder for the uploaded_by field
      const { data: client } = await supabase.from("clients").select("profile_id").eq("id", clientId).single();

      // We need an uploaded_by value - use a system approach
      // Insert using service role which bypasses RLS
      const { error: docError } = await supabase.from("documents").insert({
        client_id: clientId,
        uploaded_by: client?.profile_id || "00000000-0000-0000-0000-000000000000",
        file_name: fileName,
        file_type: fileType || null,
        file_size_bytes: fileSize || null,
        storage_path: storagePath,
      });

      if (docError) {
        console.error("Document insert error:", docError);
        throw new Error("Failed to record document");
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in client-portal:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
