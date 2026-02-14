
-- Allow owner to view all organizations for metrics
CREATE POLICY "Owner can view all organizations"
ON public.organizations FOR SELECT
USING (public.has_role(auth.uid(), 'owner'));

-- Allow owner to view all profiles for metrics
CREATE POLICY "Owner can view all profiles"
ON public.profiles FOR SELECT
USING (public.has_role(auth.uid(), 'owner'));

-- Allow owner to view all signing requests for metrics
CREATE POLICY "Owner can view all signing requests"
ON public.signing_requests FOR SELECT
USING (public.has_role(auth.uid(), 'owner'));
