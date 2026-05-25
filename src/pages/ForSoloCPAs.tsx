import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageSEO } from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, XCircle, DollarSign, Clock, Users, Bot } from "lucide-react";

const painPoints = [
  {
    pain: "You're paying $110/month minimum for SmartVault — for a solo seat you don't fully use.",
    fix: "Ledger Stash Solo is $49/month flat. No per-seat minimums. No phantom seats.",
  },
  {
    pain: "Clients call you because they forgot their portal password — again.",
    fix: "Magic Links. Clients click one link in their email and upload instantly. No accounts, no passwords.",
  },
  {
    pain: "You spend 2–3 hours every week sending reminder emails.",
    fix: "Automated reminders run on your schedule. Scout AI answers client questions 24/7 so you don't have to.",
  },
  {
    pain: "You hired a seasonal preparer and your software bill jumped $800.",
    fix: "Unlimited staff seats on every plan. Add seasonal help in January, remove them in April. $0 extra.",
  },
];

const included = [
  "Unlimited staff seats",
  "Up to 25 active client vaults",
  "Magic Link client access (no passwords)",
  "10 pre-built PBC checklist templates",
  "Prior-year return scanning (AI-generated checklists)",
  "Scout AI — client-facing assistant",
  "Sage AI — practice intelligence agent",
  "Automated reminders (configurable schedule)",
  "White-label branding (your logo + firm name)",
  "AES-256 encryption + IRS 4557 compliance",
  "E-signatures included",
  "Audit-ready export (one click)",
];

const costComparison = [
  { platform: "SmartVault Accounting Pro", monthly: "$110", annual: "$1,320", note: "2-user minimum — you pay for a seat that doesn't exist" },
  { platform: "TaxDome (1 seat)", monthly: "~$67", annual: "$800", note: "Billed annually upfront — no monthly option" },
  { platform: "Liscio Starter", monthly: "$49", annual: "$588", note: "Per-seat pricing — add one seasonal staff member and the price doubles" },
  { platform: "Ledger Stash Solo", monthly: "$49", annual: "$588", note: "Unlimited seats — add your entire team for $0 extra" },
];

export default function ForSoloCPAs() {
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Ledger Stash for Solo CPAs | $49/Month, Unlimited Staff"
        description="The secure document vault built for solo practitioners. Magic Links replace passwords, Scout AI handles client questions, and unlimited staff seats mean your bill never changes when you hire seasonal help."
        keywords="document vault for solo CPA, client portal for solo practitioner, SmartVault alternative solo CPA, TaxDome alternative solo, PBC checklist software solo accountant, cheap CPA client portal"
        canonical="/for-solo-cpas"
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="py-20 bg-gradient-to-b from-muted/40 to-background">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-4">
                Built for Solo Practitioners
              </p>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-6 leading-tight">
                Stop Paying the<br />Solo CPA Tax
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                SmartVault charges you for two seats when you only need one. TaxDome bills you annually upfront. Ledger Stash is $49/month flat — unlimited staff, unlimited documents, zero per-seat surprises.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/signup" className="gap-2">
                    Start Free Trial
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="xl" asChild>
                  <Link to="/pricing">See All Plans</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">14-day free trial · No credit card required · Cancel anytime</p>
            </div>
          </div>
        </section>

        {/* Pain Points */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                The Problems We Solve
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Every solo CPA we talked to had the same four problems. We built Ledger Stash to fix all of them.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {painPoints.map((item, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-start gap-3 mb-4">
                    <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground italic">{item.pain}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground font-medium">{item.fix}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Everything in the Solo Plan — $49/Month
                </h2>
                <p className="text-muted-foreground">
                  Up to 25 active client vaults. Unlimited staff. No annual commitment required.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {included.map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <Button variant="hero" size="lg" asChild>
                    <Link to="/signup" className="gap-2">
                      Start Free Trial
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cost Comparison */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                The Real Cost Comparison
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                What you actually pay as a solo practitioner with one seasonal staff member.
              </p>
            </div>
            <div className="max-w-4xl mx-auto overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-foreground font-semibold">Platform</th>
                    <th className="text-center py-3 px-4 text-foreground font-semibold">Monthly</th>
                    <th className="text-center py-3 px-4 text-foreground font-semibold">Annual</th>
                    <th className="text-left py-3 px-4 text-foreground font-semibold">The Catch</th>
                  </tr>
                </thead>
                <tbody>
                  {costComparison.map((row, i) => (
                    <tr key={i} className={`border-b border-border ${row.platform.includes("Ledger") ? "bg-primary/5 font-semibold" : ""}`}>
                      <td className={`py-3 px-4 ${row.platform.includes("Ledger") ? "text-primary font-bold" : "text-foreground"}`}>{row.platform}</td>
                      <td className="py-3 px-4 text-center text-foreground">{row.monthly}</td>
                      <td className="py-3 px-4 text-center text-foreground">{row.annual}</td>
                      <td className={`py-3 px-4 text-xs ${row.platform.includes("Ledger") ? "text-primary" : "text-muted-foreground"}`}>{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* AI Callout */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto rounded-2xl border border-border bg-card p-8 sm:p-10 shadow-sm text-center">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Bot className="h-7 w-7 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Scout Handles the 10pm "What Do I Still Owe You?" Texts
              </h3>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Scout is the client-facing AI agent built into every Ledger Stash plan. When your client asks what's still outstanding on their checklist, Scout reads their specific vault and answers instantly — with their actual remaining items, not a generic response. Tax advice is blocked. Every conversation is logged.
              </p>
              <p className="text-sm text-muted-foreground italic">
                No competitor — SmartVault, TaxDome, or Liscio — has a context-aware client AI agent. This is a Ledger Stash exclusive.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-card border-t border-border">
          <div className="container text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Set Up in 5 Minutes. Cancel Anytime.
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              14-day free trial. No credit card required. No onboarding call. No annual commitment.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/signup" className="gap-2">
                Start Free Trial — $49/Month
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
