// Stripe product and price IDs for each plan tier
export const STRIPE_PLANS = {
  solo: {
    name: "Solo CPA",
    product_id: "prod_U5WSWzGIOmjXCV",
    monthly: {
      price_id: "price_1T7LPrQyBV5UJkhp0lTUpFJx",
      amount: 29,
    },
    annual: {
      price_id: "price_1T7LQHQyBV5UJkhpKkJs1xdE",
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
    product_id: "prod_U5WUiqinB3p2W4",
    monthly: {
      price_id: "price_1T7LRKQyBV5UJkhp2t9X1LBm",
      amount: 79,
    },
    annual: {
      price_id: "price_1T7LRdQyBV5UJkhpx3Q5pwy9",
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
    product_id: "prod_U5WVgckZMNxyxF",
    monthly: {
      price_id: "price_1T7LSTQyBV5UJkhpFFa3bOYq",
      amount: 199,
    },
    annual: {
      price_id: "price_1T7LUbQyBV5UJkhpHFqGifrz",
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
  "prod_U5WTNzgNjfRLpn": "solo",
  "prod_U5WUjVNN5rymOh": "boutique",
  "prod_U5WXE4cG69jynM": "enterprise",
};

export type PlanKey = keyof typeof STRIPE_PLANS;
