import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useOrganization } from "@/hooks/useOrganization";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  Shield,
  Users,
  FileText,
  Send,
  BarChart3,
  ChevronRight,
  ChevronLeft,
  Rocket,
  Paintbrush,
  Bell,
  UserPlus,
  ScrollText,
  Crown,
  CheckCircle2,
} from "lucide-react";

import stepWelcome from "@/assets/onboarding/step-welcome.png";
import stepClients from "@/assets/onboarding/step-clients.png";
import stepPbc from "@/assets/onboarding/step-pbc.png";
import stepSend from "@/assets/onboarding/step-send.png";
import stepTrack from "@/assets/onboarding/step-track.png";

interface WizardStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  instructions: string[];
  image: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Which tiers should see this step. Omit = all tiers */
  tiers?: ("trial" | "solo" | "boutique" | "enterprise")[];
}

const allSteps: WizardStep[] = [
  // ── Core steps (all tiers) ──────────────────────────────
  {
    id: "welcome",
    title: "Welcome to Ledger Stash!",
    subtitle: "Your secure client document vault",
    description:
      "Ledger Stash helps accounting firms collect, organize, and track client documents — like W-2s, 1099s, and bank statements — all in one secure place. Let's walk you through how it works.",
    instructions: [
      "This quick tour takes about 2 minutes",
      "You'll learn the key steps to collecting documents",
      "You can revisit this tour anytime from Settings",
    ],
    image: stepWelcome,
    icon: Shield,
  },
  {
    id: "clients",
    title: "Step 1: Add Your Clients",
    subtitle: "Build your client list",
    description:
      "Start by adding the clients who need to submit tax documents. Each client gets their own secure profile where you can track their submissions and communication.",
    instructions: [
      'Go to the Clients page and click "Add Client"',
      "Enter their name and email address",
      "Or bulk import clients from a CSV file",
      "Clients are organized by your firm — your whole team can see them",
    ],
    image: stepClients,
    icon: Users,
  },
  {
    id: "pbc",
    title: "Step 2: Create PBC Lists",
    subtitle: "Define what documents you need",
    description:
      "PBC (Provided By Client) lists define exactly which documents you need from each client. Use our pre-built templates for common tax scenarios or create your own from scratch.",
    instructions: [
      'Navigate to Document Requests and click "New Document Request"',
      "Choose from templates like Individual Tax Return, Business Tax, or Partnership",
      "Customize the list — add or remove document types as needed",
      "Attach reference PDFs or fillable forms for clients to complete",
    ],
    image: stepPbc,
    icon: FileText,
  },
  {
    id: "send",
    title: "Step 3: Send Document Requests",
    subtitle: "Reach your clients securely",
    description:
      "Once your PBC list is ready, send it to one or more clients with a single click. They'll receive a branded email with a secure link — no account needed on their end.",
    instructions: [
      'Click "Send to Clients" on any published document request',
      "Select which clients should receive the request",
      "Clients get an email with a one-click secure upload link",
      "Each link is unique, encrypted, and expires automatically",
    ],
    image: stepSend,
    icon: Send,
  },
  {
    id: "track",
    title: "Step 4: Track & Follow Up",
    subtitle: "Stay on top of every submission",
    description:
      "Monitor which clients have submitted their documents and which still need a nudge. Send reminders, export status reports, and keep your entire team in sync.",
    instructions: [
      "View real-time submission status on your Dashboard",
      "Send manual or automatic reminders to pending clients",
      "Download submitted documents or export status reports as CSV",
      "Set up auto-reminders to chase overdue submissions for you",
    ],
    image: stepTrack,
    icon: BarChart3,
  },

  // ── Boutique-specific step ──────────────────────────────
  {
    id: "white-label",
    title: "Your Brand, Front & Center",
    subtitle: "Boutique Firm feature",
    description:
      "Your clients see your firm's logo, colors, and name — never ours. Build trust with a fully branded client portal that looks like your own custom software.",
    instructions: [
      "Go to Settings → Organization to upload your logo",
      "Choose a custom accent color to match your brand",
      "The client portal removes all Ledger Stash branding",
      "Auto-reminders use your firm's name and sender email",
    ],
    image: stepWelcome,
    icon: Paintbrush,
    tiers: ["boutique", "enterprise"],
  },
  {
    id: "auto-reminders",
    title: "Busy Season Auto-Pilot",
    subtitle: "Boutique Firm feature",
    description:
      "Stop manually chasing documents. Set up automatic reminders that go out on a schedule until clients upload what you need. Set it and forget it.",
    instructions: [
      "Go to Settings → Auto-Reminders to enable",
      "Set the reminder interval (every 3, 5, or 7 days)",
      "Reminders stop automatically when the client completes the request",
      "Track all sent reminders in the Reminder Log",
    ],
    image: stepTrack,
    icon: Bell,
    tiers: ["boutique", "enterprise"],
  },
  {
    id: "team",
    title: "Invite Your Team",
    subtitle: "Boutique Firm feature",
    description:
      "Add your associates, staff accountants, or admin team. Everyone on your team gets full access to your client vault — no extra per-user fees.",
    instructions: [
      "Go to Settings → Team Management",
      "Invite team members by email",
      "Team members can manage clients, documents, and requests",
      "All plans include unlimited team members",
    ],
    image: stepClients,
    icon: UserPlus,
    tiers: ["boutique", "enterprise"],
  },

  // ── Enterprise-specific step ────────────────────────────
  {
    id: "enterprise-features",
    title: "Enterprise-Grade Control",
    subtitle: "Enterprise Vault feature",
    description:
      "Your Enterprise Vault includes advanced audit logging, unlimited clients, and dedicated support. Scale confidently as your firm grows.",
    instructions: [
      "Advanced audit logs capture every action across your firm",
      "Unlimited clients — no caps as you grow",
      "Dedicated support with priority response times",
      "Multi-firm management and API access coming soon",
    ],
    image: stepWelcome,
    icon: ScrollText,
    tiers: ["enterprise"],
  },
];

function getStepsForTier(plan: string | null | undefined): WizardStep[] {
  const tier = (plan === "solo" || plan === "boutique" || plan === "enterprise")
    ? plan
    : "trial";

  return allSteps.filter((step) => {
    if (!step.tiers) return true; // core steps shown to everyone
    return step.tiers.includes(tier);
  });
}

export default function Welcome() {
  usePageTitle("Welcome");
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth({ requireAuth: true, redirectTo: "/login" });
  const { organization } = useOrganization(user);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = getStepsForTier(organization?.plan);
  const step = steps[currentStep];
  const Icon = step?.icon ?? Shield;
  const progress = ((currentStep + 1) / steps.length) * 100;
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  const completeTour = () => {
    if (organization?.id) {
      localStorage.setItem(`ledgerstash_tour_completed_${organization.id}`, "true");
    }
    navigate("/dashboard");
  };

  const next = () => {
    if (isLast) {
      completeTour();
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const prev = () => {
    if (!isFirst) setCurrentStep((s) => s - 1);
  };

  const skip = () => {
    completeTour();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!step) return null;

  // Determine plan badge
  const planLabel =
    organization?.plan === "enterprise" ? "Enterprise Vault" :
    organization?.plan === "boutique" ? "Boutique Firm" :
    organization?.plan === "solo" ? "Solo CPA" :
    "14-Day Free Trial";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="border-b border-border bg-card">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">Ledger Stash</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              <Crown className="h-3 w-3" />
              {planLabel}
            </span>
            <Button variant="ghost" size="sm" onClick={skip} className="text-muted-foreground">
              Skip tour
            </Button>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="container max-w-4xl pt-6 px-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">
            {currentStep + 1} of {steps.length}
          </span>
          <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left: Text content */}
            <div className="order-2 md:order-1 space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">{step.subtitle}</p>
                  {step.tiers && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                      {step.tiers.includes("enterprise") && !step.tiers.includes("boutique")
                        ? "Enterprise exclusive"
                        : "Included in your plan"}
                    </span>
                  )}
                </div>
              </div>

              <h1 className="text-3xl font-bold text-foreground leading-tight">
                {step.title}
              </h1>

              <p className="text-muted-foreground leading-relaxed">{step.description}</p>

              {/* Instructions list */}
              <ul className="space-y-3">
                {step.instructions.map((instruction, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-foreground leading-relaxed">{instruction}</span>
                  </li>
                ))}
              </ul>

              {/* Navigation */}
              <div className="flex items-center gap-3 pt-4">
                {!isFirst && (
                  <Button variant="outline" onClick={prev}>
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                )}
                <Button variant="hero" onClick={next} className="ml-auto">
                  {isLast ? (
                    <>
                      <Rocket className="h-4 w-4 mr-1" />
                      Go to Dashboard
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Right: Illustration */}
            <div className="order-1 md:order-2">
              <div className="rounded-xl border border-border bg-muted/30 overflow-hidden shadow-lg">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>

          {/* Step dots */}
          <div className="flex items-center justify-center gap-2 mt-10">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`h-2 rounded-full transition-all duration-200 ${
                  i === currentStep
                    ? "w-8 bg-primary"
                    : i < currentStep
                    ? "w-2 bg-primary/40"
                    : "w-2 bg-border"
                }`}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
