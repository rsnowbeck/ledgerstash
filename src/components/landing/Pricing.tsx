import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$9",
    period: "/month",
    description: "For solo business owners and small teams just getting started.",
    features: [
      "Up to 10 recipients",
      "5 active requirements",
      "Pre-built compliance templates",
      "Standard email delivery",
      "PDF exports",
      "14-day free trial"
    ],
    cta: "Start Free Trial",
    featured: false
  },
  {
    name: "Team",
    price: "$19",
    period: "/month",
    description: "For growing businesses with 20-100 people to manage.",
    features: [
      "Up to 100 recipients",
      "Unlimited requirements",
      "Pre-built compliance templates",
      "Priority email delivery",
      "CSV & PDF exports",
      "Bulk reminders",
      "14-day free trial"
    ],
    cta: "Start Free Trial",
    featured: true
  },
  {
    name: "Pro",
    price: "$39",
    period: "/month",
    description: "For established organizations with compliance needs at scale.",
    features: [
      "Unlimited recipients",
      "Unlimited requirements",
      "Pre-built compliance templates",
      "Priority support",
      "Custom branding",
      "API access",
      "Advanced audit logs",
      "14-day free trial"
    ],
    cta: "Start Free Trial",
    featured: false
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 lg:py-32 bg-card">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            Simple, transparent pricing
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Start free for 14 days. No credit card required. Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={plan.featured ? "card-pricing-featured" : "card-pricing"}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-accent flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
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

        <p className="text-center text-sm text-muted-foreground mt-8">
          All plans include SSL encryption, daily backups, and 99.9% uptime SLA.
        </p>
      </div>
    </section>
  );
}
