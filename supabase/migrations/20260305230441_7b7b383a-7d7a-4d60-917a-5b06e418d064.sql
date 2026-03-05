CREATE TABLE public.lead_captures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  resource_name text NOT NULL,
  source_section text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.lead_captures ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form)
CREATE POLICY "Anyone can submit lead capture"
  ON public.lead_captures
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated owner/admin can read
CREATE POLICY "Admins can read lead captures"
  ON public.lead_captures
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'admin'));