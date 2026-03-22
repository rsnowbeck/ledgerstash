ALTER TABLE public.organizations 
ADD COLUMN upload_notifications_enabled boolean NOT NULL DEFAULT true,
ADD COLUMN upload_notification_mode text NOT NULL DEFAULT 'instant';