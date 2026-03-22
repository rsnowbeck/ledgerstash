
-- AI conversation logging tables
CREATE TABLE public.ai_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_type text NOT NULL DEFAULT 'cpa', -- 'client' or 'cpa'
  user_id uuid, -- profile ID for CPA, null for client portal users
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  message_count integer NOT NULL DEFAULT 0,
  summary text -- AI-generated summary of the conversation
);

CREATE TABLE public.ai_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  role text NOT NULL, -- 'user', 'assistant', 'system', 'action'
  content text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb, -- for action results, tool calls, etc.
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;

-- RLS for ai_conversations
CREATE POLICY "CPAs can view conversations in their org"
  ON public.ai_conversations FOR SELECT TO authenticated
  USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "CPAs can insert conversations in their org"
  ON public.ai_conversations FOR INSERT TO authenticated
  WITH CHECK (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "CPAs can update conversations in their org"
  ON public.ai_conversations FOR UPDATE TO authenticated
  USING (organization_id = get_user_organization_id(auth.uid()));

-- RLS for ai_messages
CREATE POLICY "Users can view messages of conversations they can see"
  ON public.ai_messages FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.ai_conversations c
    WHERE c.id = ai_messages.conversation_id
    AND c.organization_id = get_user_organization_id(auth.uid())
  ));

CREATE POLICY "Users can insert messages to conversations they own"
  ON public.ai_messages FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.ai_conversations c
    WHERE c.id = ai_messages.conversation_id
    AND c.organization_id = get_user_organization_id(auth.uid())
  ));

-- Index for performance
CREATE INDEX idx_ai_conversations_org ON public.ai_conversations(organization_id);
CREATE INDEX idx_ai_conversations_client ON public.ai_conversations(client_id);
CREATE INDEX idx_ai_messages_conversation ON public.ai_messages(conversation_id);
