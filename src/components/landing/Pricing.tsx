import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const plans: {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  proOnlyFeatures?: string[];
  cta: string;
  featured: boolean;
}[] = [
  {
    name: "Starter",
    price: "$9",
    period: "/month",
    description: "For individuals and small teams getting started with document collection and signature tracking.",
    features: [
      "Up to 10 recipients",
      "5 active requirements",
      "Read-and-acknowledge workflows",
      "Pre-built document templates",
      "No-login signing",
      "Secure single-use links",
      "Real-time dashboard",
      "Standard email delivery",
      "PDF proof downloads"
    ],
    cta: "Start Free Trial",
    featured: false
  },
  {
    name: "Team",
    price: "$19",
    period: "/month",
    description: "For growing businesses that need structured document tracking, reporting, and team collaboration.",
    features: [
      "Up to 100 recipients",
      "Unlimited requirements",
      "Read-and-acknowledge workflows",
      "Fillable PDF forms",
      "Auto-detect form fields",
      "Structured response storage",
      "Completion reports & exports",
      "No-login signing",
      "Secure single-use links",
      "Real-time dashboard",
      "Automated reminders",
      "Team collaboration",
      "Priority email delivery",
      "Bulk reminders"
    ],
    cta: "Start Free Trial",
    featured: true
  },
  {
    name: "Pro",
    price: "$39",
    period: "/month",
    description: "For established organizations managing high-volume document workflows at scale.",
    features: [
      "Unlimited recipients",
      "Unlimited requirements",
      "Read-and-acknowledge workflows",
      "Fillable PDF forms",
      "Auto-detect form fields",
      "Structured response storage",
      "Advanced CSV & PDF exports",
      "No-login signing",
      "Secure single-use links",
      "Real-time dashboard",
      "Automated reminders",
      "Team collaboration",
      "Priority support"
    ],
    proOnlyFeatures: [
      "Custom branding",
      "Advanced activity logs",
      "API access",
      "File attachments for document requests"
    ],
    cta: "Start Free Trial",
    featured: false
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="pt-24 pb-24 bg-card">
      <div className="container">
        <div className="text-center">
          <h2 className="text-[2.25rem] sm:text-[2.5rem] font-bold text-foreground leading-[1.2] mb-4">
            Simple, transparent pricing
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

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-accent flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
                {plan.proOnlyFeatures && (
                  <>
                    <li className="pt-4 mt-2 border-t border-border/50">
                      <span className="text-sm font-semibold text-accent">Pro-only features:</span>
                    </li>
                    {plan.proOnlyFeatures.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm pl-2">
                        <Check className="h-4 w-4 text-accent flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </>
                )}
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
          <p className="text-sm text-muted-foreground mb-1">
            Still have questions?
          </p>
          <p className="text-sm text-muted-foreground">
            See our <a href="#faq" className="text-accent hover:underline">FAQ</a> or start your free trial — no commitment required.
          </p>
        </div>
      </div>
    </section>
  );
}
