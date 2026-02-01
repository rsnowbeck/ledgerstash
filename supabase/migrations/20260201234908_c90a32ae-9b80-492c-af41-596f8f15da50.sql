-- Add custom recipient message field to organizations
ALTER TABLE public.organizations
ADD COLUMN custom_recipient_message TEXT DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.organizations.custom_recipient_message IS 'Optional plain-text message (max 240 chars) shown in signing emails between document card and CTA';