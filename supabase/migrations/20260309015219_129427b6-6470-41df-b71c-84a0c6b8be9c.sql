CREATE POLICY "Users can delete signing requests in their org"
ON public.signing_requests
FOR DELETE
TO authenticated
USING (organization_id = get_user_organization_id(auth.uid()));