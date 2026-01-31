import { useMemo } from "react";

interface Organization {
  id: string;
  name: string;
  plan: string;
  trial_ends_at: string | null;
  recipient_limit: number;
  requirement_limit: number;
}

interface PlanLimits {
  recipientLimit: number;
  requirementLimit: number;
  canAddRecipient: boolean;
  canAddRequirement: boolean;
  recipientsRemaining: number;
  requirementsRemaining: number;
  isAtRecipientLimit: boolean;
  isAtRequirementLimit: boolean;
  planName: string;
  isTrialExpired: boolean;
  trialDaysRemaining: number | null;
}

// Plan configurations
const PLAN_LIMITS = {
  trial: { recipients: 10, requirements: 5 },
  starter: { recipients: 10, requirements: 5 },
  team: { recipients: 100, requirements: -1 }, // -1 means unlimited
  pro: { recipients: -1, requirements: -1 },
} as const;

export function usePlanLimits(
  organization: Organization | null,
  currentRecipientCount: number,
  currentRequirementCount: number
): PlanLimits {
  return useMemo(() => {
    if (!organization) {
      return {
        recipientLimit: 0,
        requirementLimit: 0,
        canAddRecipient: false,
        canAddRequirement: false,
        recipientsRemaining: 0,
        requirementsRemaining: 0,
        isAtRecipientLimit: true,
        isAtRequirementLimit: true,
        planName: "Unknown",
        isTrialExpired: false,
        trialDaysRemaining: null,
      };
    }

    const plan = (organization.plan || "trial") as keyof typeof PLAN_LIMITS;
    const planConfig = PLAN_LIMITS[plan] || PLAN_LIMITS.trial;

    // Use organization-level limits (which may be customized) or fall back to plan defaults
    const recipientLimit = organization.recipient_limit ?? planConfig.recipients;
    const requirementLimit = organization.requirement_limit ?? planConfig.requirements;

    // Check trial expiration
    const isTrialExpired = 
      organization.plan === "trial" && 
      organization.trial_ends_at && 
      new Date(organization.trial_ends_at) < new Date();

    // Calculate trial days remaining
    let trialDaysRemaining: number | null = null;
    if (organization.plan === "trial" && organization.trial_ends_at) {
      const now = new Date();
      const trialEnd = new Date(organization.trial_ends_at);
      const diffMs = trialEnd.getTime() - now.getTime();
      trialDaysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    }

    // Calculate remaining capacity (-1 means unlimited)
    const recipientsRemaining = recipientLimit === -1 
      ? Infinity 
      : Math.max(0, recipientLimit - currentRecipientCount);
    
    const requirementsRemaining = requirementLimit === -1 
      ? Infinity 
      : Math.max(0, requirementLimit - currentRequirementCount);

    const isAtRecipientLimit = recipientLimit !== -1 && currentRecipientCount >= recipientLimit;
    const isAtRequirementLimit = requirementLimit !== -1 && currentRequirementCount >= requirementLimit;

    // If trial expired, can't add anything
    const canAddRecipient = !isTrialExpired && !isAtRecipientLimit;
    const canAddRequirement = !isTrialExpired && !isAtRequirementLimit;

    const planDisplayNames: Record<string, string> = {
      trial: "Trial",
      starter: "Starter",
      team: "Team",
      pro: "Pro",
    };

    return {
      recipientLimit,
      requirementLimit,
      canAddRecipient,
      canAddRequirement,
      recipientsRemaining: recipientsRemaining === Infinity ? -1 : recipientsRemaining,
      requirementsRemaining: requirementsRemaining === Infinity ? -1 : requirementsRemaining,
      isAtRecipientLimit,
      isAtRequirementLimit,
      planName: planDisplayNames[plan] || plan,
      isTrialExpired,
      trialDaysRemaining,
    };
  }, [organization, currentRecipientCount, currentRequirementCount]);
}
