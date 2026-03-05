-- Fix 1: Remove the overly permissive public SELECT policy on signing_requests
DROP POLICY IF EXISTS "Public can view signing request by valid token" ON public.signing_requests;