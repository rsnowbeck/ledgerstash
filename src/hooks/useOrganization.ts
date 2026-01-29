import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface Organization {
  id: string;
  name: string;
  plan: string;
  trial_ends_at: string | null;
  recipient_limit: number;
  requirement_limit: number;
}

interface Profile {
  id: string;
  organization_id: string | null;
  full_name: string | null;
  email: string | null;
}

export function useOrganization() {
  const { user } = useAuth({ requireAuth: false });
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrgData() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch organization
        if (profileData?.organization_id) {
          const { data: orgData, error: orgError } = await supabase
            .from('organizations')
            .select('*')
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
    }

    fetchOrgData();
  }, [user]);

  return { organization, profile, loading };
}
