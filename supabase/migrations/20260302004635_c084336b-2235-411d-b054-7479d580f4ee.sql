
-- =============================================
-- PHASE 1: Create tables first (no RLS yet)
-- =============================================

-- TABLE: firms
CREATE TABLE public.firms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subdomain TEXT UNIQUE,
  logo_url TEXT,
  owner_id UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.firms ENABLE ROW LEVEL SECURITY;

-- TABLE: firm_members
CREATE TABLE public.firm_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'accountant',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (firm_id, profile_id)
);
ALTER TABLE public.firm_members ENABLE ROW LEVEL SECURITY;

-- TABLE: clients
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  notes TEXT,
  profile_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- TABLE: folders
CREATE TABLE public.folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  parent_folder_id UUID REFERENCES public.folders(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (client_id, name, parent_folder_id)
);
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;

-- TABLE: documents
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES public.folders(id) ON DELETE SET NULL,
  uploaded_by UUID NOT NULL REFERENCES public.profiles(id),
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size_bytes BIGINT,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- TABLE: tasks
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  assigned_by UUID NOT NULL REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT NOT NULL DEFAULT 'medium',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- TABLE: comments
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- TABLE: notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  related_entity_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- =============================================
-- HELPER FUNCTIONS (tables exist now)
-- =============================================

CREATE OR REPLACE FUNCTION public.get_user_firm_id(_user_id uuid)
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT firm_id FROM public.firm_members WHERE profile_id = _user_id LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.is_firm_member(_user_id uuid, _firm_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.firm_members WHERE profile_id = _user_id AND firm_id = _firm_id)
$$;

CREATE OR REPLACE FUNCTION public.is_client_user(_user_id uuid, _client_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.clients WHERE id = _client_id AND profile_id = _user_id)
$$;

CREATE OR REPLACE FUNCTION public.get_firm_id_for_client(_client_id uuid)
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT firm_id FROM public.clients WHERE id = _client_id LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.can_access_comment(_user_id uuid, _task_id uuid, _document_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.tasks t WHERE t.id = _task_id
    AND (public.is_firm_member(_user_id, public.get_firm_id_for_client(t.client_id))
         OR public.is_client_user(_user_id, t.client_id))
  ) OR EXISTS (
    SELECT 1 FROM public.documents d WHERE d.id = _document_id
    AND (public.is_firm_member(_user_id, public.get_firm_id_for_client(d.client_id))
         OR public.is_client_user(_user_id, d.client_id))
  )
$$;

-- =============================================
-- RLS POLICIES
-- =============================================

-- firms
CREATE POLICY "Firm members can view their firm" ON public.firms FOR SELECT USING (public.is_firm_member(auth.uid(), id));
CREATE POLICY "Firm owner can update their firm" ON public.firms FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "Authenticated users can create firms" ON public.firms FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Owner can view all firms" ON public.firms FOR SELECT USING (public.has_role(auth.uid(), 'owner'));

-- firm_members
CREATE POLICY "Firm members can view members of their firm" ON public.firm_members FOR SELECT USING (public.is_firm_member(auth.uid(), firm_id));
CREATE POLICY "Firm owners can manage members" ON public.firm_members FOR INSERT WITH CHECK (public.is_firm_member(auth.uid(), firm_id));
CREATE POLICY "Firm owners can delete members" ON public.firm_members FOR DELETE USING (public.is_firm_member(auth.uid(), firm_id));
CREATE POLICY "Users can add themselves as firm member" ON public.firm_members FOR INSERT WITH CHECK (profile_id = auth.uid());

-- clients
CREATE POLICY "Firm members can view their clients" ON public.clients FOR SELECT USING (public.is_firm_member(auth.uid(), firm_id));
CREATE POLICY "Firm members can insert clients" ON public.clients FOR INSERT WITH CHECK (public.is_firm_member(auth.uid(), firm_id));
CREATE POLICY "Firm members can update clients" ON public.clients FOR UPDATE USING (public.is_firm_member(auth.uid(), firm_id));
CREATE POLICY "Firm members can delete clients" ON public.clients FOR DELETE USING (public.is_firm_member(auth.uid(), firm_id));
CREATE POLICY "Clients can view their own record" ON public.clients FOR SELECT USING (profile_id = auth.uid());

-- folders
CREATE POLICY "Firm members can view client folders" ON public.folders FOR SELECT USING (public.is_firm_member(auth.uid(), public.get_firm_id_for_client(client_id)));
CREATE POLICY "Firm members can manage folders" ON public.folders FOR INSERT WITH CHECK (public.is_firm_member(auth.uid(), public.get_firm_id_for_client(client_id)));
CREATE POLICY "Firm members can update folders" ON public.folders FOR UPDATE USING (public.is_firm_member(auth.uid(), public.get_firm_id_for_client(client_id)));
CREATE POLICY "Firm members can delete folders" ON public.folders FOR DELETE USING (public.is_firm_member(auth.uid(), public.get_firm_id_for_client(client_id)));
CREATE POLICY "Clients can view their own folders" ON public.folders FOR SELECT USING (public.is_client_user(auth.uid(), client_id));
CREATE POLICY "Clients can manage their own folders" ON public.folders FOR INSERT WITH CHECK (public.is_client_user(auth.uid(), client_id));

-- documents
CREATE POLICY "Firm members can view client documents" ON public.documents FOR SELECT USING (public.is_firm_member(auth.uid(), public.get_firm_id_for_client(client_id)));
CREATE POLICY "Firm members can insert documents" ON public.documents FOR INSERT WITH CHECK (public.is_firm_member(auth.uid(), public.get_firm_id_for_client(client_id)));
CREATE POLICY "Firm members can delete documents" ON public.documents FOR DELETE USING (public.is_firm_member(auth.uid(), public.get_firm_id_for_client(client_id)));
CREATE POLICY "Clients can view their own documents" ON public.documents FOR SELECT USING (public.is_client_user(auth.uid(), client_id));
CREATE POLICY "Clients can upload documents" ON public.documents FOR INSERT WITH CHECK (public.is_client_user(auth.uid(), client_id) AND uploaded_by = auth.uid());

-- tasks
CREATE POLICY "Firm members can view client tasks" ON public.tasks FOR SELECT USING (public.is_firm_member(auth.uid(), public.get_firm_id_for_client(client_id)));
CREATE POLICY "Firm members can create tasks" ON public.tasks FOR INSERT WITH CHECK (public.is_firm_member(auth.uid(), public.get_firm_id_for_client(client_id)));
CREATE POLICY "Firm members can update tasks" ON public.tasks FOR UPDATE USING (public.is_firm_member(auth.uid(), public.get_firm_id_for_client(client_id)));
CREATE POLICY "Firm members can delete tasks" ON public.tasks FOR DELETE USING (public.is_firm_member(auth.uid(), public.get_firm_id_for_client(client_id)));
CREATE POLICY "Clients can view their own tasks" ON public.tasks FOR SELECT USING (public.is_client_user(auth.uid(), client_id));
CREATE POLICY "Clients can update their own tasks" ON public.tasks FOR UPDATE USING (public.is_client_user(auth.uid(), client_id));

-- comments
CREATE POLICY "Users can view comments they have access to" ON public.comments FOR SELECT USING (public.can_access_comment(auth.uid(), task_id, document_id));
CREATE POLICY "Users can add comments they have access to" ON public.comments FOR INSERT WITH CHECK (user_id = auth.uid() AND public.can_access_comment(auth.uid(), task_id, document_id));

-- notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Authenticated users can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_firm_members_firm_id ON public.firm_members(firm_id);
CREATE INDEX idx_firm_members_profile_id ON public.firm_members(profile_id);
CREATE INDEX idx_clients_firm_id ON public.clients(firm_id);
CREATE INDEX idx_clients_email ON public.clients(email);
CREATE INDEX idx_clients_profile_id ON public.clients(profile_id);
CREATE INDEX idx_folders_client_id ON public.folders(client_id);
CREATE INDEX idx_documents_client_id ON public.documents(client_id);
CREATE INDEX idx_documents_folder_id ON public.documents(folder_id);
CREATE INDEX idx_tasks_client_id ON public.tasks(client_id);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_comments_task_id ON public.comments(task_id);
CREATE INDEX idx_comments_document_id ON public.comments(document_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);

-- =============================================
-- TRIGGERS
-- =============================================
CREATE TRIGGER update_firms_updated_at BEFORE UPDATE ON public.firms FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_folders_updated_at BEFORE UPDATE ON public.folders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- STORAGE
-- =============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('client-documents', 'client-documents', false);

CREATE POLICY "Authenticated users can upload client documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'client-documents' AND auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can view client documents" ON storage.objects FOR SELECT USING (bucket_id = 'client-documents' AND auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete client documents" ON storage.objects FOR DELETE USING (bucket_id = 'client-documents' AND auth.uid() IS NOT NULL);
