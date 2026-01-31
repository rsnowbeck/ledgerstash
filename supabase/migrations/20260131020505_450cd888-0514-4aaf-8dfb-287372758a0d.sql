-- Add timezone and notification preferences to profiles
ALTER TABLE public.profiles
ADD COLUMN timezone TEXT DEFAULT 'America/New_York',
ADD COLUMN email_notifications BOOLEAN DEFAULT true,
ADD COLUMN reminder_notifications BOOLEAN DEFAULT true;

-- Add index for faster lookups
CREATE INDEX idx_profiles_organization_id ON public.profiles(organization_id);