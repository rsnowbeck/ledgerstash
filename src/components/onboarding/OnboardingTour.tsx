import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  FileText, 
  Send, 
  BarChart3, 
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  CheckCircle
} from "lucide-react";

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  route?: string;
  action?: string;
}

const tourSteps: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to LedgerStash! 👋",
    description: "Let's take a quick tour to help you get started. You'll learn how to create compliance requirements and collect acknowledgments from your team.",
    icon: Sparkles,
  },
  {
    id: "recipients",
    title: "Add Your Recipients",
    description: "Start by adding the people who need to acknowledge your policies—employees, contractors, or vendors. You can add them one by one or import from CSV.",
    icon: Users,
    route: "/recipients",
    action: "Go to Recipients",
  },
  {
    id: "requirements",
    title: "Create Requirements",
    description: "Define what needs to be acknowledged—NDAs, policies, training confirmations. Use our templates or create custom requirements from scratch.",
    icon: FileText,
    route: "/requirements",
    action: "Go to Requirements",
  },
  {
    id: "send",
    title: "Send for Signature",
    description: "Once published, send signing requests to your recipients. They'll receive an email with a secure link to acknowledge the document.",
    icon: Send,
  },
  {
    id: "track",
    title: "Track Compliance",
    description: "Monitor who has signed and who hasn't. Send reminders, export reports, and download PDF certificates for your records.",
    icon: BarChart3,
    route: "/signatures",
    action: "View Signatures",
  },
  {
    id: "complete",
    title: "You're All Set! 🎉",
    description: "You now know the basics. Start by adding recipients or creating your first requirement. We're here to help if you have any questions!",
    icon: CheckCircle,
  },
];

interface OnboardingTourProps {
  organizationId: string | undefined;
}

export function OnboardingTour({ organizationId }: OnboardingTourProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompletedTour, setHasCompletedTour] = useState(true);

  useEffect(() => {
    if (!organizationId) return;
    
    const tourKey = `ledgerstash_tour_completed_${organizationId}`;
    const forceShowKey = `ledgerstash_tour_force_show_${organizationId}`;
    const completed = localStorage.getItem(tourKey);
    const forceShow = localStorage.getItem(forceShowKey);
    
    // If force show is set, show the tour regardless of other conditions
    if (forceShow) {
      localStorage.removeItem(forceShowKey); // Clear the flag
      setHasCompletedTour(false);
      setTimeout(() => setIsVisible(true), 500);
      return;
    }
    
    if (completed) {
      setHasCompletedTour(true);
      return;
    }

    // Check if this is a truly new organization (no data yet)
    const checkIfNewOrg = async () => {
      const [recipientsRes, requirementsRes, signaturesRes] = await Promise.all([
        supabase.from('recipients').select('id', { count: 'exact', head: true }).eq('organization_id', organizationId),
        supabase.from('requirements').select('id', { count: 'exact', head: true }).eq('organization_id', organizationId),
        supabase.from('signing_requests').select('id', { count: 'exact', head: true }).eq('organization_id', organizationId),
      ]);

      const hasRecipients = (recipientsRes.count ?? 0) > 0;
      const hasRequirements = (requirementsRes.count ?? 0) > 0;
      const hasSignatures = (signaturesRes.count ?? 0) > 0;

      // If org already has any data, they're not new - mark tour as complete
      if (hasRecipients || hasRequirements || hasSignatures) {
        localStorage.setItem(tourKey, 'true');
        setHasCompletedTour(true);
        return;
      }

      // Truly new org - show the tour
      setHasCompletedTour(false);
      setTimeout(() => setIsVisible(true), 500);
    };

    checkIfNewOrg();
  }, [organizationId]);

  const completeTour = () => {
    if (organizationId) {
      localStorage.setItem(`attestly_tour_completed_${organizationId}`, 'true');
    }
    setHasCompletedTour(true);
    setIsVisible(false);
  };

  const skipTour = () => {
    completeTour();
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToRoute = (route: string) => {
    navigate(route);
    nextStep();
  };

  if (hasCompletedTour || !isVisible) return null;

  const step = tourSteps[currentStep];
  const Icon = step.icon;
  const progress = ((currentStep + 1) / tourSteps.length) * 100;
  const isLastStep = currentStep === tourSteps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
        onClick={skipTour}
      />
      
      {/* Tour Card - Centered */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-300">
        <Card className="shadow-xl border-primary/20 w-full max-w-md">
          <CardContent className="pt-6 pb-6">
            {/* Header with close button */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Step {currentStep + 1} of {tourSteps.length}
                  </p>
                  <h3 className="font-semibold text-foreground">{step.title}</h3>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={skipTour}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Progress */}
            <Progress value={progress} className="h-1 mb-4" />

            {/* Content */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              {step.description}
            </p>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {!isFirstStep && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevStep}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                )}
                {isFirstStep && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={skipTour}
                  >
                    Skip tour
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {step.route && step.action && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToRoute(step.route!)}
                  >
                    {step.action}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
                <Button
                  variant="hero"
                  size="sm"
                  onClick={nextStep}
                >
                  {isLastStep ? "Get Started" : "Next"}
                  {!isLastStep && <ChevronRight className="h-4 w-4 ml-1" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// Hook to reset tour (for testing/settings)
export function useOnboardingTour(organizationId: string | undefined) {
  const resetTour = () => {
    if (organizationId) {
      // Clear the completion flag
      localStorage.removeItem(`attestly_tour_completed_${organizationId}`);
      // Also set a flag to force show tour even if org has data
      localStorage.setItem(`attestly_tour_force_show_${organizationId}`, 'true');
      // Navigate to dashboard and reload
      window.location.href = '/dashboard';
    }
  };

  const hasCompletedTour = () => {
    if (!organizationId) return true;
    return localStorage.getItem(`attestly_tour_completed_${organizationId}`) === 'true';
  };

  const shouldForceShow = () => {
    if (!organizationId) return false;
    return localStorage.getItem(`attestly_tour_force_show_${organizationId}`) === 'true';
  };

  const clearForceShow = () => {
    if (organizationId) {
      localStorage.removeItem(`attestly_tour_force_show_${organizationId}`);
    }
  };

  return { resetTour, hasCompletedTour, shouldForceShow, clearForceShow };
}
