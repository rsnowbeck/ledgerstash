import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PRODUCT_TO_PLAN, STRIPE_PLANS, type PlanKey } from "@/lib/stripePlans";
import { User } from "@supabase/supabase-js";

interface SubscriptionState {
  subscribed: boolean;
  productId: string | null;
  priceId: string | null;
  planKey: PlanKey | null;
  subscriptionEnd: string | null;
  loading: boolean;
}

export function useSubscription(user: User | null) {
  const [state, setState] = useState<SubscriptionState>({
    subscribed: false,
    productId: null,
    priceId: null,
    planKey: null,
    subscriptionEnd: null,
    loading: true,
  });

  const checkSubscription = useCallback(async () => {
    if (!user) {
      setState(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (error) throw error;

      const planKey = data?.product_id ? (PRODUCT_TO_PLAN[data.product_id] || null) : null;

      setState({
        subscribed: data?.subscribed || false,
        productId: data?.product_id || null,
        priceId: data?.price_id || null,
        planKey,
        subscriptionEnd: data?.subscription_end || null,
        loading: false,
      });
    } catch (error) {
      console.error("Error checking subscription:", error);
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  useEffect(() => {
    checkSubscription();

    // Auto-refresh every 60 seconds
    const interval = setInterval(checkSubscription, 60000);
    return () => clearInterval(interval);
  }, [checkSubscription]);

  const startCheckout = useCallback(async (priceId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      throw error;
    }
  }, []);

  const openPortal = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Error opening portal:", error);
      throw error;
    }
  }, []);

  return {
    ...state,
    checkSubscription,
    startCheckout,
    openPortal,
  };
}
