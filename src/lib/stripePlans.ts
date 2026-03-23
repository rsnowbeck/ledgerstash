// Stripe product and price IDs for each plan tier (LIVE)
export const STRIPE_PLANS = {
  solo: {
    name: "Solo Practitioner",
    description: "For independent practitioners managing a focused client base.",
    product_id: "prod_U5Wn9ZDZbzbZKc",
    monthly: {
      price_id: "price_1T7LjxR9aaf2f8Yg6boZi82U",
      amount: 49,
    },
    annual: {
      price_id: "price_1T7LjzR9aaf2f8YgVk3Mwz51",
      amount: 490,
      monthlyEquivalent: 40.83,
    },
    features: [
      "Up to 25 active clients",
      "Secure document vault",
      "PBC task lists",
      "Context-aware AI client assistant",
      "CPA practice intelligence bot",
      "Two-way secure client messaging",
      "Real-time upload notifications",
      "Per-client configurable reminder schedule",
      "10 pre-built PBC templates",
      "ESIGN/UETA compliant audit trail",
      "Downloadable PDF certificates",
      "Firm logo + name branding",
      "Per-client folders",
      "Standard support",
    ],
    clientLimit: 25,
  },
  boutique: {
    name: "Boutique Firm",
    description: "Built for small teams looking to professionalize and automate.",
    product_id: "prod_U5WnwTxMzxXkDt",
    monthly: {
      price_id: "price_1T7Lk0R9aaf2f8Yg565bOya4",
      amount: 149,
    },
    annual: {
      price_id: "price_1T7LjzR9aaf2f8Yg3OXRNcjV",
      amount: 1490,
      monthlyEquivalent: 124.17,
    },
    features: [
      "Up to 100 active clients",
      "Everything in Solo Practitioner",
      "Full white-labeling (no Ledger Stash branding)",
      "Busy Season auto-reminders",
      "Team member accounts",
      "In-app comments",
      "Priority support",
    ],
    clientLimit: 100,
    featured: true,
  },
  enterprise: {
    name: "Enterprise Vault",
    description: "The scalable solution for growing firms.",
    product_id: "prod_U5aFwai0TGN2S0",
    monthly: {
      price_id: "price_1T7P5PR9aaf2f8YgdtlZfYxe",
      amount: 199,
    },
    annual: {
      price_id: "price_1T7PGTR9aaf2f8Yg1aNWAoJ9",
      amount: 1990,
      monthlyEquivalent: 165.83,
    },
    features: [
      "Unlimited clients",
      "Everything in Boutique",
      "Advanced audit logs",
      "Dedicated support",
    ],
    comingSoonFeatures: [
      "Multi-firm management",
      "API access for CRM",
      "Custom integrations",
    ],
    clientLimit: -1,
  },
} as const;

// Map product IDs to plan keys
export const PRODUCT_TO_PLAN: Record<string, keyof typeof STRIPE_PLANS> = {
  [STRIPE_PLANS.solo.product_id]: "solo",
  [STRIPE_PLANS.boutique.product_id]: "boutique",
  [STRIPE_PLANS.enterprise.product_id]: "enterprise",
  // Annual products map to same plan
  "prod_U5Wne3AbyHlVAb": "solo",
  "prod_U5WnDWPwkTlVH3": "boutique",
  "prod_U5aRGby7IgSY8R": "enterprise",
};

export type PlanKey = keyof typeof STRIPE_PLANS;
