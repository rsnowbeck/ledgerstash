-- Add organization settings columns
ALTER TABLE public.organizations
ADD COLUMN logo_url TEXT,
ADD COLUMN sender_name TEXT,
ADD COLUMN sender_email TEXT,
ADD COLUMN default_due_days INTEGER DEFAULT 30,
ADD COLUMN auto_reminder_enabled BOOLEAN DEFAULT false,
ADD COLUMN auto_reminder_days INTEGER DEFAULT 7;

-- Create storage bucket for organization logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('organization-logos', 'organization-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to their org folder
CREATE POLICY "Users can upload org logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'organization-logos' 
  AND (storage.foldername(name))[1] = get_user_organization_id(auth.uid())::text
);

-- Allow authenticated users to update their org logos
CREATE POLICY "Users can update org logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'organization-logos' 
  AND (storage.foldername(name))[1] = get_user_organization_id(auth.uid())::text
);

-- Allow authenticated users to delete their org logos
CREATE POLICY "Users can delete org logos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'organization-logos' 
  AND (storage.foldername(name))[1] = get_user_organization_id(auth.uid())::text
);

-- Allow public read access to org logos
CREATE POLICY "Public can view org logos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'organization-logos');