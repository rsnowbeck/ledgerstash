-- Create reminder_logs table for audit trail
CREATE TABLE public.reminder_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  signing_request_id UUID NOT NULL REFERENCES public.signing_requests(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  sent_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  trigger_type TEXT NOT NULL DEFAULT 'manual',
  email_sent BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT
);

-- Create indexes for efficient querying
CREATE INDEX idx_reminder_logs_signing_request ON public.reminder_logs(signing_request_id);
CREATE INDEX idx_reminder_logs_organization ON public.reminder_logs(organization_id);
CREATE INDEX idx_reminder_logs_sent_at ON public.reminder_logs(sent_at DESC);

-- Enable RLS
ALTER TABLE public.reminder_logs ENABLE ROW LEVEL SECURITY;

-- Users can view reminder logs in their org
CREATE POLICY "Users can view reminder logs in their org"
ON public.reminder_logs
FOR SELECT
USING (organization_id = get_user_organization_id(auth.uid()));

-- Users can insert reminder logs in their org
CREATE POLICY "Users can insert reminder logs in their org"
ON public.reminder_logs
FOR INSERT
WITH CHECK (organization_id = get_user_organization_id(auth.uid()));

-- Add comment for clarity
COMMENT ON TABLE public.reminder_logs IS 'Audit log for all reminders sent for signing requests';
COMMENT ON COLUMN public.reminder_logs.trigger_type IS 'manual = user triggered, auto = scheduled auto-reminder';