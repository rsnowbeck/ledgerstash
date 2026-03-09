import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Crown,
  CheckCircle2,
  X,
  Rocket,
  Paintbrush,
  Bell,
  UserPlus,
  ScrollText,
  Shield,
  FolderOpen,
  FileText,
} from "lucide-react";

interface PlanFeature {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const planConfig: Record<string, {
  title: string;
  subtitle: string;
  description: string;
  features: PlanFeature[];
  accentLabel: string;
}> = {
  solo: {
    title: "Welcome to Solo Firm!",
    subtitle: "Your personal client vault is ready",
    description:
      "You now have a secure, branded vault for up to 25 active clients. Here's what's included in your plan:",
    accentLabel: "Solo Firm",
    features: [
      { icon: FolderOpen, label: "Secure document vault with per-client folders" },
      { icon: FileText, label: "PBC task lists with accounting-specific templates" },
      { icon: Shield, label: "ESIGN/UETA compliant audit trail & PDF certificates" },
      { icon: Crown, label: "Firm logo + name branding on client portal" },
    ],
  },
  boutique: {
    title: "Welcome to Boutique Firm!",
    subtitle: "Your team's professional vault is ready",
    description:
      "You've unlocked powerful team and automation features for up to 100 active clients. Here's everything in your plan:",
    accentLabel: "Boutique Firm",
    features: [
      { icon: FolderOpen, label: "Everything in Solo Firm, plus..." },
      { icon: Paintbrush, label: "Full white-labeling — no Ledger Stash branding" },
      { icon: Bell, label: "Busy Season auto-reminders on autopilot" },
      { icon: UserPlus, label: "Unlimited team member accounts" },
    ],
  },
  enterprise: {
    title: "Welcome to Enterprise Vault!",
    subtitle: "Your scalable firm solution is ready",
    description:
      "You have the most powerful vault available — unlimited clients, advanced compliance, and dedicated support. Here's what's unlocked:",
    accentLabel: "Enterprise Vault",
    features: [
      { icon: FolderOpen, label: "Everything in Boutique Firm, plus..." },
      { icon: ScrollText, label: "Advanced audit logs for full compliance" },
      { icon: Crown, label: "Unlimited clients — scale without limits" },
      { icon: Rocket, label: "Dedicated support with priority response" },
    ],
  },
};

interface PlanWelcomeOverlayProps {
  organizationId: string | undefined;
  planKey: string | null | undefined;
}

export function PlanWelcomeOverlay({ organizationId, planKey }: PlanWelcomeOverlayProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!organizationId || !planKey) return;
    if (!planConfig[planKey]) return;

    const storageKey = `ledgerstash_plan_welcome_${organizationId}_${planKey}`;
    const alreadySeen = localStorage.getItem(storageKey);
    if (alreadySeen) return;

    // Small delay so dashboard renders first
    const timer = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(timer);
  }, [organizationId, planKey]);

  const dismiss = () => {
    if (organizationId && planKey) {
      localStorage.setItem(`ledgerstash_plan_welcome_${organizationId}_${planKey}`, "true");
    }
    setVisible(false);
  };

  if (!visible || !planKey || !planConfig[planKey]) return null;

  const config = planConfig[planKey];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
        onClick={dismiss}
      />

      {/* Card */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-300">
        <Card className="shadow-xl border-accent/20 w-full max-w-lg">
          <CardContent className="pt-6 pb-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Crown className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-bold text-accent mb-1">
                    {config.accentLabel}
                  </span>
                  <h3 className="text-lg font-bold text-foreground">{config.title}</h3>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={dismiss}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              {config.description}
            </p>

            {/* Feature list */}
            <ul className="space-y-3 mb-6">
              {config.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-4 w-4 text-accent" />
                  </div>
                  <span className="text-sm text-foreground">{feature.label}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Button variant="hero" className="w-full" onClick={dismiss}>
              <Rocket className="h-4 w-4 mr-2" />
              Let's Get Started
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
