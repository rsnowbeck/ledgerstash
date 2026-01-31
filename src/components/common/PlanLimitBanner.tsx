import { Link } from "react-router-dom";
import { AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlanLimitBannerProps {
  type: "recipient" | "requirement";
  limit: number;
  planName: string;
  isTrialExpired?: boolean;
  trialDaysRemaining?: number | null;
}

export function PlanLimitBanner({
  type,
  limit,
  planName,
  isTrialExpired,
  trialDaysRemaining,
}: PlanLimitBannerProps) {
  if (isTrialExpired) {
    return (
      <div className="flex items-center justify-between gap-4 p-4 mb-6 rounded-lg bg-destructive/10 border border-destructive/20">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">
              Your trial has expired
            </p>
            <p className="text-sm text-muted-foreground">
              Upgrade to continue adding {type}s and accessing your data.
            </p>
          </div>
        </div>
        <Button variant="hero" size="sm" asChild>
          <Link to="/pricing">Upgrade Now</Link>
        </Button>
      </div>
    );
  }

  if (trialDaysRemaining !== null && trialDaysRemaining <= 3 && trialDaysRemaining > 0) {
    return (
      <div className="flex items-center justify-between gap-4 p-4 mb-6 rounded-lg bg-warning/10 border border-warning/20">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-warning flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">
              {trialDaysRemaining} day{trialDaysRemaining !== 1 ? "s" : ""} left in your trial
            </p>
            <p className="text-sm text-muted-foreground">
              Upgrade to keep access to all your {type}s after the trial ends.
            </p>
          </div>
        </div>
        <Button variant="hero" size="sm" asChild>
          <Link to="/pricing">Upgrade Now</Link>
        </Button>
      </div>
    );
  }

  const limitDisplay = limit === -1 ? "unlimited" : limit;
  
  return (
    <div className="flex items-center justify-between gap-4 p-4 mb-6 rounded-lg bg-warning/10 border border-warning/20">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-foreground">
            {type === "recipient" ? "Recipient" : "Requirement"} limit reached
          </p>
          <p className="text-sm text-muted-foreground">
            Your {planName} plan includes {limitDisplay} {type}s. Upgrade to add more.
          </p>
        </div>
      </div>
      <Button variant="hero" size="sm" asChild>
        <Link to="/pricing">Upgrade Plan</Link>
      </Button>
    </div>
  );
}
