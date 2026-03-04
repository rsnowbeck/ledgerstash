import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard, ExternalLink } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { STRIPE_PLANS } from "@/lib/stripePlans";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { useState } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface BillingSettingsProps {
  user: User;
  trialEndsAt: string | null;
}

export function BillingSettings({ user, trialEndsAt }: BillingSettingsProps) {
  const { subscribed, planKey, subscriptionEnd, loading, openPortal, checkSubscription } = useSubscription(user);
  const [portalLoading, setPortalLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleManageBilling = async () => {
    setPortalLoading(true);
    try {
      await openPortal();
    } catch (error) {
      toast.error("Failed to open billing portal. Please try again.");
    } finally {
      setPortalLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await checkSubscription();
    setRefreshing(false);
    toast.success("Subscription status refreshed");
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const activePlan = planKey ? STRIPE_PLANS[planKey] : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription
          </CardTitle>
          <CardDescription>
            Manage your plan and billing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-foreground text-lg">
                  {subscribed && activePlan ? activePlan.name : "Free Trial"}
                </span>
                <Badge variant={subscribed ? "default" : "secondary"}>
                  {subscribed ? "Active" : "Trial"}
                </Badge>
              </div>
              {subscribed && subscriptionEnd && (
                <p className="text-sm text-muted-foreground">
                  Renews {format(new Date(subscriptionEnd), "MMM d, yyyy")}
                </p>
              )}
              {!subscribed && trialEndsAt && (
                <p className="text-sm text-muted-foreground">
                  Trial ends {format(new Date(trialEndsAt), "MMM d, yyyy")}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
            </Button>
          </div>

          <div className="flex gap-3">
            {subscribed ? (
              <Button
                variant="outline"
                onClick={handleManageBilling}
                disabled={portalLoading}
                className="gap-2"
              >
                {portalLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Opening...</>
                ) : (
                  <><ExternalLink className="h-4 w-4" /> Manage Billing</>
                )}
              </Button>
            ) : (
              <Button variant="hero" asChild>
                <Link to="/pricing">Upgrade Plan</Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
