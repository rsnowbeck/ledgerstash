-- Messages table for CPA <-> Client communication
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  sender_type text NOT NULL CHECK (sender_type IN ('cpa', 'client')),
  sender_id uuid,
  content text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Firm members can view/insert/update messages for their clients
CREATE POLICY "Firm members can view client messages"
  ON public.messages FOR SELECT TO authenticated
  USING (is_firm_member(auth.uid(), get_firm_id_for_client(client_id)));

CREATE POLICY "Firm members can send messages"
  ON public.messages FOR INSERT TO authenticated
  WITH CHECK (is_firm_member(auth.uid(), get_firm_id_for_client(client_id)) AND sender_type = 'cpa');

CREATE POLICY "Firm members can update messages"
  ON public.messages FOR UPDATE TO authenticated
  USING (is_firm_member(auth.uid(), get_firm_id_for_client(client_id)));

-- Clients can view their own messages
CREATE POLICY "Clients can view their messages"
  ON public.messages FOR SELECT TO authenticated
  USING (is_client_user(auth.uid(), client_id));

-- Clients can send messages
CREATE POLICY "Clients can send messages"
  ON public.messages FOR INSERT TO authenticated
  WITH CHECK (is_client_user(auth.uid(), client_id) AND sender_type = 'client');

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;