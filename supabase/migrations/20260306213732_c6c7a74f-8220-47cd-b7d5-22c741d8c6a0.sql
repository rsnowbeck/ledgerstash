
-- Fix 1: Restrict audit_logs public INSERT to signing request context only
DROP POLICY IF EXISTS "Public can insert audit logs" ON public.audit_logs;

CREATE POLICY "Public can insert audit logs via signing context"
  ON public.audit_logs FOR INSERT
  WITH CHECK (
    user_id IS NULL
    AND organization_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.signing_requests sr
      WHERE sr.organization_id = audit_logs.organization_id
      AND sr.status = 'pending'
      AND sr.expires_at > now()
    )
  );

-- Fix 2: Restrict notifications INSERT to same-org users only
DROP POLICY IF EXISTS "Authenticated users can insert notifications" ON public.notifications;

CREATE POLICY "Users can insert notifications for same-org users"
  ON public.notifications FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = notifications.user_id
      AND p.organization_id = get_user_organization_id(auth.uid())
    )
  );
