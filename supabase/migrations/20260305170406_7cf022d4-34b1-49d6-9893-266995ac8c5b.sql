
ALTER TABLE public.organizations
ADD COLUMN session_timeout_minutes integer NOT NULL DEFAULT 30;
