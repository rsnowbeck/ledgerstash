-- Allow public to view requirements linked to valid signing requests (for signer page)
CREATE POLICY "Public can view requirement via signing request" 
ON public.requirements 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.signing_requests sr 
    WHERE sr.requirement_id = requirements.id 
    AND sr.status = 'pending'
    AND sr.expires_at > now()
  )
);

-- Allow public to view recipient name via signing request (for signer page)
CREATE POLICY "Public can view recipient via signing request" 
ON public.recipients 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.signing_requests sr 
    WHERE sr.recipient_id = recipients.id 
    AND sr.status = 'pending'
    AND sr.expires_at > now()
  )
);

-- Allow public to view organization name via signing request (for branding)
CREATE POLICY "Public can view organization via signing request" 
ON public.organizations 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.signing_requests sr 
    WHERE sr.organization_id = organizations.id 
    AND sr.status = 'pending'
    AND sr.expires_at > now()
  )
);