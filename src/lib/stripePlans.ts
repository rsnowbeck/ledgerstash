// Stripe product and price IDs for each plan tier (LIVE)
export const STRIPE_PLANS = {
  solo: {
    name: "Solo CPA",
    product_id: "prod_U5aCOMMzw1ylC4",
    monthly: {
      price_id: "price_1T7P1pQyBV5UJkhpLA5PjeXc",
      amount: 29,
    },
    annual: {
      price_id: "price_1T7P27QyBV5UJkhpdpax2WIt",
      amount: 290,
      monthlyEquivalent: 24.17,
    },
    features: [
      "Up to 25 active clients",
      "Secure document vault",
      "PBC task lists",
      "Standard branding",
      "Email notifications",
      "Per-client folders",
      "Standard support",
    ],
    clientLimit: 25,
  },
  boutique: {
    name: "Boutique Firm",
    product_id: "prod_U5aCZPDuq2rfc2",
    monthly: {
      price_id: "price_1T7P2LQyBV5UJkhp6OAl0UeB",
      amount: 79,
    },
    annual: {
      price_id: "price_1T7P2XQyBV5UJkhp9QQkunu9",
      amount: 790,
      monthlyEquivalent: 65.83,
    },
    features: [
      "Up to 100 active clients",
      "Everything in Solo CPA",
      "Full white-labeling",
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
      "Multi-firm management",
      "API access for CRM",
      "Dedicated support",
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
  "prod_U5aCseojrHsPF6": "solo",
  "prod_U5aCMuX2vCp5JD": "boutique",
  "prod_U5aRGby7IgSY8R": "enterprise",
};

export type PlanKey = keyof typeof STRIPE_PLANS;
