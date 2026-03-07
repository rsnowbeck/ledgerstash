
-- Client access tokens for frictionless portal access
CREATE TABLE public.client_access_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  token_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '90 days'),
  last_used_at timestamptz,
  is_revoked boolean NOT NULL DEFAULT false
);

ALTER TABLE public.client_access_tokens ENABLE ROW LEVEL SECURITY;

-- Firm members can view/manage tokens for their clients
CREATE POLICY "Firm members can view client tokens"
ON public.client_access_tokens FOR SELECT TO authenticated
USING (is_firm_member(auth.uid(), get_firm_id_for_client(client_id)));

CREATE POLICY "Firm members can insert client tokens"
ON public.client_access_tokens FOR INSERT TO authenticated
WITH CHECK (is_firm_member(auth.uid(), get_firm_id_for_client(client_id)));

CREATE POLICY "Firm members can update client tokens"
ON public.client_access_tokens FOR UPDATE TO authenticated
USING (is_firm_member(auth.uid(), get_firm_id_for_client(client_id)));

CREATE POLICY "Firm members can delete client tokens"
ON public.client_access_tokens FOR DELETE TO authenticated
USING (is_firm_member(auth.uid(), get_firm_id_for_client(client_id)));

-- Index for fast token lookups
CREATE INDEX idx_client_access_tokens_hash ON public.client_access_tokens(token_hash);
CREATE INDEX idx_client_access_tokens_client ON public.client_access_tokens(client_id);
