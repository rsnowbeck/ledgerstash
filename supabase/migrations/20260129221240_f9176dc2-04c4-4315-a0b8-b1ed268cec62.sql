-- Create app role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'owner');

-- Create user roles table (security best practice - roles separate from profiles)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Organizations table
CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '14 days'),
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    plan TEXT DEFAULT 'trial',
    recipient_limit INTEGER DEFAULT 10,
    requirement_limit INTEGER DEFAULT 5
);

-- Profiles table (links users to organizations)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Recipients table (people who need to sign)
CREATE TABLE public.recipients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    recipient_type TEXT DEFAULT 'employee',
    department TEXT,
    is_deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Requirements table (compliance items)
CREATE TABLE public.requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    frequency TEXT DEFAULT 'one-time',
    due_date DATE,
    attachment_url TEXT,
    attachment_name TEXT,
    status TEXT DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Signing requests table (individual request per recipient per requirement)
CREATE TABLE public.signing_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requirement_id UUID REFERENCES public.requirements(id) ON DELETE CASCADE NOT NULL,
    recipient_id UUID REFERENCES public.recipients(id) ON DELETE CASCADE NOT NULL,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    token_hash TEXT NOT NULL UNIQUE,
    status TEXT DEFAULT 'pending',
    sent_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    signed_name TEXT,
    ip_address TEXT,
    user_agent TEXT,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '30 days'),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signing_requests ENABLE ROW LEVEL SECURITY;

-- Helper function to get user's organization
CREATE OR REPLACE FUNCTION public.get_user_organization_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id FROM public.profiles WHERE id = _user_id
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

-- RLS Policies for organizations
CREATE POLICY "Users can view their organization"
ON public.organizations FOR SELECT
USING (id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "Users can update their organization"
ON public.organizations FOR UPDATE
USING (id = public.get_user_organization_id(auth.uid()));

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (id = auth.uid());

-- RLS Policies for recipients
CREATE POLICY "Users can view recipients in their org"
ON public.recipients FOR SELECT
USING (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "Users can insert recipients in their org"
ON public.recipients FOR INSERT
WITH CHECK (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "Users can update recipients in their org"
ON public.recipients FOR UPDATE
USING (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "Users can delete recipients in their org"
ON public.recipients FOR DELETE
USING (organization_id = public.get_user_organization_id(auth.uid()));

-- RLS Policies for requirements
CREATE POLICY "Users can view requirements in their org"
ON public.requirements FOR SELECT
USING (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "Users can insert requirements in their org"
ON public.requirements FOR INSERT
WITH CHECK (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "Users can update requirements in their org"
ON public.requirements FOR UPDATE
USING (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "Users can delete requirements in their org"
ON public.requirements FOR DELETE
USING (organization_id = public.get_user_organization_id(auth.uid()));

-- RLS Policies for signing_requests
CREATE POLICY "Users can view signing requests in their org"
ON public.signing_requests FOR SELECT
USING (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "Users can insert signing requests in their org"
ON public.signing_requests FOR INSERT
WITH CHECK (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "Users can update signing requests in their org"
ON public.signing_requests FOR UPDATE
USING (organization_id = public.get_user_organization_id(auth.uid()));

-- Public access for signers (using token)
CREATE POLICY "Public can view signing request by valid token"
ON public.signing_requests FOR SELECT
USING (true);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply updated_at triggers
CREATE TRIGGER update_organizations_updated_at
BEFORE UPDATE ON public.organizations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recipients_updated_at
BEFORE UPDATE ON public.recipients
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_requirements_updated_at
BEFORE UPDATE ON public.requirements
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create org and profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    new_org_id UUID;
BEGIN
    -- Create organization
    INSERT INTO public.organizations (name)
    VALUES (COALESCE(NEW.raw_user_meta_data->>'company_name', 'My Organization'))
    RETURNING id INTO new_org_id;
    
    -- Create profile
    INSERT INTO public.profiles (id, organization_id, full_name, email)
    VALUES (NEW.id, new_org_id, NEW.raw_user_meta_data->>'full_name', NEW.email);
    
    -- Assign admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for performance
CREATE INDEX idx_recipients_org ON public.recipients(organization_id);
CREATE INDEX idx_requirements_org ON public.requirements(organization_id);
CREATE INDEX idx_signing_requests_org ON public.signing_requests(organization_id);
CREATE INDEX idx_signing_requests_token ON public.signing_requests(token_hash);
CREATE INDEX idx_signing_requests_status ON public.signing_requests(status);
CREATE INDEX idx_profiles_org ON public.profiles(organization_id);