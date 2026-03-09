import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Map Stripe product IDs to plan keys
const PRODUCT_TO_PLAN: Record<string, string> = {
  // Monthly products
  "prod_U5Wn9ZDZbzbZKc": "solo",
  "prod_U5WnwTxMzxXkDt": "boutique",
  "prod_U5aFwai0TGN2S0": "enterprise",
  // Annual products
  "prod_U5Wne3AbyHlVAb": "solo",
  "prod_U5WnDWPwkTlVH3": "boutique",
  "prod_U5aRGby7IgSY8R": "enterprise",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");

    // Use getClaims for reliable JWT validation with signing-keys
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      throw new Error(`Authentication error: ${claimsError?.message || "Invalid token"}`);
    }

    const userId = claimsData.claims.sub as string;
    const userEmail = claimsData.claims.email as string;

    if (!userEmail) throw new Error("User email not available in token");
    logStep("User authenticated", { userId, email: userEmail });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });

    if (customers.data.length === 0) {
      logStep("No Stripe customer found");
      return new Response(JSON.stringify({ subscribed: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    const hasActiveSub = subscriptions.data.length > 0;
    let productId = null;
    let subscriptionEnd = null;
    let priceId = null;
    let planKey = null;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      productId = subscription.items.data[0].price.product as string;
      priceId = subscription.items.data[0].price.id;
      planKey = PRODUCT_TO_PLAN[productId] || "solo";
      logStep("Active subscription found", { subscriptionId: subscription.id, productId, priceId, planKey });

      // Update organization plan with actual tier name
      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("organization_id")
        .eq("id", userId)
        .single();

      if (profile?.organization_id) {
        const planLimits: Record<string, { recipient_limit: number | null; requirement_limit: number | null }> = {
          solo: { recipient_limit: 25, requirement_limit: null },
          boutique: { recipient_limit: 100, requirement_limit: null },
          enterprise: { recipient_limit: null, requirement_limit: null },
        };
        const limits = planLimits[planKey] || planLimits.solo;

        await supabaseClient
          .from("organizations")
          .update({
            plan: planKey,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscription.id,
            recipient_limit: limits.recipient_limit,
            requirement_limit: limits.requirement_limit,
          })
          .eq("id", profile.organization_id);
        logStep("Organization plan updated", { planKey, limits });
      }
    } else {
      logStep("No active subscription found");
    }

    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      product_id: productId,
      price_id: priceId,
      plan_key: planKey,
      subscription_end: subscriptionEnd,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});