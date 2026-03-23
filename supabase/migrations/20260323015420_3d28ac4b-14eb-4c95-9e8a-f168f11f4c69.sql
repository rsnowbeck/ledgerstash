
-- Engagement history table for checklist memory
CREATE TABLE public.engagement_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  tax_year text NOT NULL,
  template_name text,
  task_titles jsonb NOT NULL DEFAULT '[]'::jsonb,
  document_names jsonb NOT NULL DEFAULT '[]'::jsonb,
  closed_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- RLS
ALTER TABLE public.engagement_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view engagement history in their org"
  ON public.engagement_history FOR SELECT
  TO authenticated
  USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Users can insert engagement history in their org"
  ON public.engagement_history FOR INSERT
  TO authenticated
  WITH CHECK (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Users can delete engagement history in their org"
  ON public.engagement_history FOR DELETE
  TO authenticated
  USING (organization_id = get_user_organization_id(auth.uid()));
