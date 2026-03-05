-- Fix 2: Make public storage buckets private
UPDATE storage.buckets SET public = false WHERE id IN ('requirement-attachments', 'form-snapshots');

-- Drop public SELECT policies on storage.objects for these buckets
DROP POLICY IF EXISTS "Public can view requirement attachments" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view form snapshots" ON storage.objects;