import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface Organization {
  id: string;
  name: string;
  plan: string | null;
  trial_ends_at: string | null;
  recipient_limit: number | null;
  requirement_limit: number | null;
  logo_url: string | null;
  sender_name: string | null;
  sender_email: string | null;
  default_due_days: number | null;
  auto_reminder_enabled: boolean | null;
  auto_reminder_days: number | null;
}

interface Profile {
  id: string;
  organization_id: string | null;
  full_name: string | null;
  email: string | null;
}

export function useOrganization(user: User | null) {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrgData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, organization_id, full_name, email')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch organization with all fields
      if (profileData?.organization_id) {
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .select('id, name, plan, trial_ends_at, recipient_limit, requirement_limit, logo_url, sender_name, sender_email, default_due_days, auto_reminder_enabled, auto_reminder_days')
          .eq('id', profileData.organization_id)
          .single();

        if (orgError) throw orgError;
        setOrganization(orgData);
      }
    } catch (error) {
      console.error('Error fetching organization data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrgData();
  }, [fetchOrgData]);

  const refetch = useCallback(() => {
    setLoading(true);
    fetchOrgData();
  }, [fetchOrgData]);

  return { organization, profile, loading, refetch };
}
