-- Create storage bucket for requirement attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('requirement-attachments', 'requirement-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files to their org's folder
CREATE POLICY "Users can upload requirement attachments"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'requirement-attachments' AND
  (storage.foldername(name))[1] = get_user_organization_id(auth.uid())::text
);

-- Allow authenticated users to update their org's files
CREATE POLICY "Users can update requirement attachments"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'requirement-attachments' AND
  (storage.foldername(name))[1] = get_user_organization_id(auth.uid())::text
);

-- Allow authenticated users to delete their org's files
CREATE POLICY "Users can delete requirement attachments"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'requirement-attachments' AND
  (storage.foldername(name))[1] = get_user_organization_id(auth.uid())::text
);

-- Allow public read access to requirement attachments (for signing page)
CREATE POLICY "Public can view requirement attachments"
ON storage.objects
FOR SELECT
USING (bucket_id = 'requirement-attachments');