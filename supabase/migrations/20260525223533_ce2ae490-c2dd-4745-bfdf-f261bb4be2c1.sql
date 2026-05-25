DROP POLICY IF EXISTS "Public can insert audit logs via signing context" ON public.audit_logs;

-- password_reset_tokens has RLS enabled but no policies; add an explicit deny-all
-- to make intent clear (service role bypasses RLS and continues to work).
CREATE POLICY "No client access to password reset tokens"
ON public.password_reset_tokens
FOR ALL
TO authenticated, anon
USING (false)
WITH CHECK (false);