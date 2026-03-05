import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileDown, ArrowRight, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DownloadCTAProps {
  /** Visual variant */
  variant: "comparison" | "pricing" | "footer";
  /** Section name for analytics */
  sourceSection: string;
}

const COPY = {
  comparison: {
    headline: "Download the Full Solo CPA Cost Savings Guide",
    description:
      "Get a portable PDF with side-by-side pricing, feature comparisons, and the math that shows how LedgerStash saves you $2,100+ per year.",
    cta: "Download the Cost Savings Guide (PDF)",
    resourceName: "Solo CPA Cost Savings Guide",
  },
  pricing: {
    headline: "See how we save you $2,100+ per year",
    description:
      "Compare LedgerStash to enterprise tools like TaxDome and SmartVault — and see why solo CPAs are switching.",
    cta: "Get the Free Comparison PDF",
    resourceName: "Pricing Comparison PDF",
  },
  footer: {
    headline: "Free Resource: The 2026 Solo CPA Tech Stack Guide",
    description:
      "Everything a solo CPA needs to evaluate secure client portals, PBC tools, and compliance software — in one guide.",
    cta: "Download Free Guide",
    resourceName: "2026 Solo CPA Tech Stack Guide",
  },
} as const;

export function DownloadCTA({ variant, sourceSection }: DownloadCTAProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const copy = COPY[variant];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("lead_captures").insert({
        email: trimmed,
        resource_name: copy.resourceName,
        source_section: sourceSection,
      });
      if (error) throw error;

      setSubmitted(true);
      // In production, trigger the actual PDF download / email here
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Variant-specific wrapper styling ---
  if (variant === "footer") {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          {copy.cta}
        </button>
        <LeadDialog
          open={open}
          onOpenChange={setOpen}
          copy={copy}
          email={email}
          setEmail={setEmail}
          loading={loading}
          submitted={submitted}
          onSubmit={handleSubmit}
        />
      </>
    );
  }

  return (
    <>
      <div
        className={`rounded-xl border border-border p-6 sm:p-8 text-center ${
          variant === "comparison"
            ? "bg-card shadow-md mt-10"
            : "bg-muted/30 mt-8"
        }`}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <FileDown className="h-5 w-5 text-accent" />
          <h3 className="text-lg font-semibold text-foreground">
            {copy.headline}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-5">
          {copy.description}
        </p>
        <Button
          variant="heroAccent"
          size="lg"
          onClick={() => setOpen(true)}
        >
          {copy.cta} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <LeadDialog
        open={open}
        onOpenChange={setOpen}
        copy={copy}
        email={email}
        setEmail={setEmail}
        loading={loading}
        submitted={submitted}
        onSubmit={handleSubmit}
      />
    </>
  );
}

/* ---- Shared dialog ---- */
function LeadDialog({
  open,
  onOpenChange,
  copy,
  email,
  setEmail,
  loading,
  submitted,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  copy: { headline: string; description: string; cta: string };
  email: string;
  setEmail: (v: string) => void;
  loading: boolean;
  submitted: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {submitted ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="h-12 w-12 text-accent mx-auto" />
            <DialogTitle className="text-xl font-bold text-foreground">
              Check Your Inbox!
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              We've sent the guide to your email. If you don't see it, check your spam folder.
            </DialogDescription>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">
                {copy.headline}
              </DialogTitle>
              <DialogDescription>{copy.description}</DialogDescription>
            </DialogHeader>
            <form onSubmit={onSubmit} className="space-y-4 mt-2">
              <Input
                type="email"
                placeholder="you@yourfirm.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={255}
                autoFocus
              />
              <Button
                type="submit"
                variant="heroAccent"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Sending…" : "Send Me the Guide"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                No spam, ever. Unsubscribe anytime.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
