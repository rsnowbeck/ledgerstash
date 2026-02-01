import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { action, token, signedName }: { action: string; token: string; signedName?: string } = await req.json();

    if (!token) {
      console.error('Missing token');
      return new Response(
        JSON.stringify({ error: 'Token is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Hash the token to compare with stored hash
    const encoder = new TextEncoder();
    const data = encoder.encode(token);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const tokenHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    console.log('Looking up signing request with token hash:', tokenHash.substring(0, 8) + '...');

    if (action === 'verify') {
      // Fetch signing request with related data
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

      // Check if already completed
      if (signingRequest.status === 'completed') {
        console.log('Signing request already completed');
        return new Response(
          JSON.stringify({ error: 'This document has already been signed' }),
          { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if expired
      if (new Date(signingRequest.expires_at) < new Date()) {
        console.log('Signing request expired');
        return new Response(
          JSON.stringify({ error: 'This signing link has expired' }),
          { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Successfully verified signing request:', signingRequest.id);

      // Extract from joined data (single record due to !inner)
      const recipient = signingRequest.recipients as unknown as { full_name: string; email: string };
      const requirement = signingRequest.requirements as unknown as { title: string; description: string | null; attachment_url: string | null; attachment_name: string | null };
      const organization = signingRequest.organizations as unknown as { name: string; logo_url: string | null };

      // Attachment URLs are stored as a "public URL" today, but the bucket may not actually be public.
      // To ensure recipients can always open the document without being logged in, generate a signed URL
      // using the service role key (time-limited).
      let attachmentUrl: string | null = requirement.attachment_url;
      if (attachmentUrl) {
        try {
          // Expecting a Supabase storage URL shape like:
          // .../storage/v1/object/public/<bucket>/<path>
          // .../storage/v1/object/<bucket>/<path>
          const match = attachmentUrl.match(/\/storage\/v1\/object\/(?:public\/)?([^/]+)\/(.+)$/);
          if (match) {
            const bucket = match[1];
            const path = decodeURIComponent(match[2]);
            const { data: signed, error: signedErr } = await supabase
              .storage
              .from(bucket)
              .createSignedUrl(path, 60 * 60); // 1 hour

            if (!signedErr && signed?.signedUrl) {
              attachmentUrl = signed.signedUrl;
            } else {
              console.warn('Unable to create signed URL for attachment:', signedErr);
            }
          }
        } catch (e) {
          console.warn('Failed to generate signed attachment URL:', e);
        }
      }

      return new Response(
        JSON.stringify({
          recipientName: recipient.full_name,
          recipientEmail: recipient.email,
          requirementTitle: requirement.title,
          requirementDescription: requirement.description,
          attachmentUrl,
          attachmentName: requirement.attachment_name,
          organizationName: organization.name,
          organizationLogo: organization.logo_url,
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

      // Get client info for audit trail
      const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                       req.headers.get('cf-connecting-ip') || 
                       'unknown';
      const userAgent = req.headers.get('user-agent') || 'unknown';

      console.log('Completing signing request with IP:', ipAddress);

      // Update the signing request
      const { data: updated, error: updateError } = await supabase
        .from('signing_requests')
        .update({
          status: 'completed',
          signed_name: signedName.trim(),
          completed_at: new Date().toISOString(),
          ip_address: ipAddress,
          user_agent: userAgent,
        })
        .eq('token_hash', tokenHash)
        .eq('status', 'pending')
        .select('id')
        .single();

      if (updateError || !updated) {
        console.error('Failed to complete signing:', updateError);
        return new Response(
          JSON.stringify({ error: 'Unable to complete signing. The link may be invalid or already used.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Successfully completed signing request:', updated.id);

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
