DROP POLICY IF EXISTS "Users can view invitations for their org" ON public.team_invitations;

CREATE POLICY "Admins can view invitations for their org"
ON public.team_invitations
FOR SELECT
TO authenticated
USING (
  (organization_id = get_user_organization_id(auth.uid()))
  AND has_role(auth.uid(), 'admin'::app_role)
);