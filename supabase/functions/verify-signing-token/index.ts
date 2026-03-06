import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, getClientIP, rateLimitResponse } from "../_shared/rate-limit.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Rate limit: 20 requests per minute per IP
  const clientIP = getClientIP(req);
  if (!checkRateLimit(`verify-signing:${clientIP}`, 20, 60_000)) {
    return rateLimitResponse(corsHeaders);
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { action, token, signedName, formResponses }: {
      action: string;
      token: string;
      signedName?: string;
      formResponses?: Record<string, any>;
    } = await req.json();

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Token is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Hash the token
    const encoder = new TextEncoder();
    const data = encoder.encode(token);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const tokenHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    console.log('Looking up signing request with token hash:', tokenHash.substring(0, 8) + '...');

    if (action === 'verify') {
      const { data: signingRequest, error: fetchError } = await supabase
        .from('signing_requests')
        .select(`
          id,
          status,
          expires_at,
          recipient_id,
          requirement_id,
          organization_id,
          recipients!inner(full_name, email),
          requirements!inner(title, description, attachment_url, attachment_name),
          organizations!inner(name, logo_url)
        `)
        .eq('token_hash', tokenHash)
        .single();

      if (fetchError || !signingRequest) {
        console.error('Signing request not found:', fetchError);
        return new Response(
          JSON.stringify({ error: 'Invalid or expired link' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (signingRequest.status === 'completed') {
        return new Response(
          JSON.stringify({ error: 'This document has already been signed' }),
          { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (new Date(signingRequest.expires_at) < new Date()) {
        return new Response(
          JSON.stringify({ error: 'This signing link has expired' }),
          { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const recipient = signingRequest.recipients as unknown as { full_name: string; email: string };
      const requirement = signingRequest.requirements as unknown as { title: string; description: string | null; attachment_url: string | null; attachment_name: string | null };
      const organization = signingRequest.organizations as unknown as { name: string; logo_url: string | null };

      // Generate signed URL for attachment
      let attachmentUrl: string | null = requirement.attachment_url;
      if (attachmentUrl) {
        try {
          const match = attachmentUrl.match(/\/storage\/v1\/object\/(?:public\/)?([^/]+)\/(.+)$/);
          if (match) {
            const bucket = match[1];
            const path = decodeURIComponent(match[2]);
            const { data: signed, error: signedErr } = await supabase
              .storage
              .from(bucket)
              .createSignedUrl(path, 60 * 60);
            if (!signedErr && signed?.signedUrl) {
              attachmentUrl = signed.signedUrl;
            }
          }
        } catch (e) {
          console.warn('Failed to generate signed attachment URL:', e);
        }
      }

      // Check for published form template
      let formTemplate = null;
      const { data: template } = await supabase
        .from('form_templates')
        .select('id, fields_json, pdf_url, pdf_name, status')
        .eq('requirement_id', signingRequest.requirement_id)
        .eq('status', 'published')
        .order('version', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (template) {
        // Generate signed URL for form PDF too
        let formPdfUrl = template.pdf_url;
        if (formPdfUrl) {
          try {
            const match = formPdfUrl.match(/\/storage\/v1\/object\/(?:public\/)?([^/]+)\/(.+)$/);
            if (match) {
              const bucket = match[1];
              const path = decodeURIComponent(match[2]);
              const { data: signed } = await supabase
                .storage
                .from(bucket)
                .createSignedUrl(path, 60 * 60);
              if (signed?.signedUrl) {
                formPdfUrl = signed.signedUrl;
              }
            }
          } catch (e) {
            console.warn('Failed to generate signed form PDF URL:', e);
          }
        }

        formTemplate = {
          id: template.id,
          fields: typeof template.fields_json === 'string' 
            ? JSON.parse(template.fields_json) 
            : template.fields_json,
          pdfUrl: formPdfUrl,
          pdfName: template.pdf_name,
        };
      }

      console.log('Verified signing request:', signingRequest.id, 'hasForm:', !!formTemplate);

      return new Response(
        JSON.stringify({
          signingRequestId: signingRequest.id,
          recipientName: recipient.full_name,
          recipientEmail: recipient.email,
          requirementTitle: requirement.title,
          requirementDescription: requirement.description,
          attachmentUrl,
          attachmentName: requirement.attachment_name,
          organizationName: organization.name,
          organizationLogo: organization.logo_url,
          organizationId: signingRequest.organization_id,
          formTemplate,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (action === 'complete') {
      if (!signedName || signedName.trim().length === 0) {
        return new Response(
          JSON.stringify({ error: 'Signed name is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                       req.headers.get('cf-connecting-ip') || 
                       'unknown';
      const userAgent = req.headers.get('user-agent') || 'unknown';

      // Find the signing request first to get IDs
      const { data: sr } = await supabase
        .from('signing_requests')
        .select('id, organization_id, requirement_id, recipients!inner(email, full_name)')
        .eq('token_hash', tokenHash)
        .eq('status', 'pending')
        .single();

      if (!sr) {
        return new Response(
          JSON.stringify({ error: 'Unable to complete signing. The link may be invalid or already used.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Update the signing request
      const { error: updateError } = await supabase
        .from('signing_requests')
        .update({
          status: 'completed',
          signed_name: signedName.trim(),
          completed_at: new Date().toISOString(),
          ip_address: ipAddress,
          user_agent: userAgent,
        })
        .eq('id', sr.id);

      if (updateError) {
        console.error('Failed to complete signing:', updateError);
        return new Response(
          JSON.stringify({ error: 'Unable to complete signing.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // If form responses provided, save submission
      if (formResponses) {
        // Find published template
        const { data: template } = await supabase
          .from('form_templates')
          .select('id')
          .eq('requirement_id', sr.requirement_id)
          .eq('status', 'published')
          .order('version', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (template) {
          const recipient = sr.recipients as unknown as { email: string; full_name: string };
          const { error: subError } = await supabase
            .from('form_submissions')
            .insert({
              template_id: template.id,
              signing_request_id: sr.id,
              organization_id: sr.organization_id,
              signer_email: recipient.email,
              signer_name: signedName.trim(),
              responses_json: formResponses,
              ip_address: ipAddress,
              user_agent: userAgent,
              snapshot_status: 'pending',
            });

          if (subError) {
            console.error('Failed to save form submission:', subError);
            // Don't fail the whole request - signature is saved
          } else {
            console.log('Form submission saved for signing request:', sr.id);
          }
        }
      }

      console.log('Successfully completed signing request:', sr.id);

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
