import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Solo CPA",
    price: "$29",
    period: "/month",
    description: "For solo practitioners managing a small book of clients.",
    features: [
      "Up to 25 active clients",
      "Secure document vault",
      "PBC task lists",
      "Standard branding",
      "Email notifications",
      "Per-client folders",
      "Standard support",
    ],
    cta: "Start Free Trial",
    featured: false,
  },
  {
    name: "Boutique Firm",
    price: "$79",
    period: "/month",
    description: "For growing firms that need white-labeling and automation.",
    features: [
      "Up to 100 active clients",
      "Everything in Solo CPA",
      "Full white-labeling",
      "Busy Season auto-reminders",
      "Team member accounts",
      "In-app comments",
      "Priority support",
    ],
    cta: "Start Free Trial",
    featured: true,
  },
  {
    name: "Enterprise Vault",
    price: "$199",
    period: "/month",
    description: "For established practices managing high client volumes at scale.",
    features: [
      "Unlimited clients",
      "Everything in Boutique",
      "Advanced audit logs",
      "Multi-firm management",
      "API access for CRM",
      "Dedicated support",
      "Custom integrations",
    ],
    cta: "Start Free Trial",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="pt-24 pb-24 bg-card">
      <div className="container">
        <div className="text-center">
          <h2 className="text-[2.25rem] sm:text-[2.5rem] font-bold text-foreground leading-[1.2] mb-4">
            Pricing that scales with your practice
          </h2>
          <p className="mx-auto max-w-[50rem] text-lg text-muted-foreground font-normal leading-relaxed mb-12">
            Start free for 14 days. No credit card required. Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`${plan.featured ? "card-pricing-featured" : "card-pricing"} flex flex-col`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{plan.description}</p>
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

              <Button
                variant={plan.featured ? "heroAccent" : "heroOutline"}
                className="w-full"
                asChild
              >
                <Link to="/signup">{plan.cta}</Link>
              </Button>
            </div>
          ))}
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
