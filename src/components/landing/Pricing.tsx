import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Check, Loader2 } from "lucide-react";
import { STRIPE_PLANS, type PlanKey } from "@/lib/stripePlans";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { DownloadCTA } from "@/components/landing/DownloadCTA";

const planOrder: { key: PlanKey; featured: boolean }[] = [
  { key: "solo", featured: false },
  { key: "boutique", featured: true },
  { key: "enterprise", featured: false },
];

export function Pricing() {
  const [billingInterval, setBillingInterval] = useState<"monthly" | "annual">("monthly");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const { user } = useAuth({ requireAuth: false });
  const { subscribed, planKey: activePlan, startCheckout } = useSubscription(user);
  const navigate = useNavigate();

  const handleUpgrade = async (planKey: PlanKey) => {
    if (!user) {
      navigate("/signup");
      return;
    }

    const plan = STRIPE_PLANS[planKey];
    const priceId = billingInterval === "monthly" ? plan.monthly.price_id : plan.annual.price_id;

    setLoadingPlan(planKey);
    try {
      await startCheckout(priceId);
    } catch (error) {
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section id="pricing" className="pt-24 pb-24 bg-card">
      <div className="container">
        <div className="text-center">
          <h2 className="text-[2.25rem] sm:text-[2.5rem] font-bold text-foreground leading-[1.2] mb-4">
            Pricing that scales with your practice
          </h2>
          <p className="mx-auto max-w-[50rem] text-lg text-muted-foreground font-normal leading-relaxed mb-8">
            Start free for 14 days. No credit card required. Cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 rounded-full border border-border bg-muted/50 p-1 mb-12">
            <button
              onClick={() => setBillingInterval("monthly")}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                billingInterval === "monthly"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval("annual")}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                billingInterval === "annual"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Annual
              <span className="ml-2 inline-flex items-center rounded-full bg-accent/20 px-2 py-0.5 text-xs font-semibold text-accent">
                Save 16%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
          {planOrder.map(({ key, featured }) => {
            const plan = STRIPE_PLANS[key];
            const isActive = subscribed && activePlan === key;
            const price = billingInterval === "monthly" 
              ? plan.monthly.amount 
              : plan.annual.monthlyEquivalent;
            const totalAnnual = plan.annual.amount;

            return (
              <div
                key={key}
                className={`${featured ? "card-pricing-featured" : "card-pricing"} flex flex-col ${isActive ? "ring-2 ring-accent" : ""}`}
              >
                {featured && !isActive && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                      Most Popular
                    </span>
                  </div>
                )}
                {isActive && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                      Your Plan
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">
                      ${billingInterval === "monthly" ? price : price.toFixed(0)}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  {billingInterval === "annual" && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Billed ${totalAnnual.toLocaleString()}/year
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <Check className="h-4 w-4 text-accent flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                  <li className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-accent flex-shrink-0" />
                    <span className="text-foreground">14-day free trial</span>
                  </li>
                </ul>

                {isActive ? (
                  <Button variant="heroOutline" className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : user && subscribed ? (
                  <Button
                    variant={featured ? "heroAccent" : "heroOutline"}
                    className="w-full"
                    onClick={() => handleUpgrade(key)}
                    disabled={!!loadingPlan}
                  >
                    {loadingPlan === key ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Redirecting...</>
                    ) : (
                      "Change Plan"
                    )}
                  </Button>
                ) : user ? (
                  <Button
                    variant={featured ? "heroAccent" : "heroOutline"}
                    className="w-full"
                    onClick={() => handleUpgrade(key)}
                    disabled={!!loadingPlan}
                  >
                    {loadingPlan === key ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Redirecting...</>
                    ) : (
                      "Upgrade Now"
                    )}
                  </Button>
                ) : (
                  <Button
                    variant={featured ? "heroAccent" : "heroOutline"}
                    className="w-full"
                    asChild
                  >
                    <Link to="/signup">Start Free Trial</Link>
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <p className="text-sm text-muted-foreground">
            Questions? See our <a href="#faq" className="text-accent hover:underline">FAQ</a> or start your free trial.
          </p>
        </div>
      </div>
    </section>
  );
}
