import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageSEO } from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Users, Bot, Shield, Palette } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Unlimited Staff — No Exceptions",
    description:
      "Add every preparer, admin, and seasonal hire to your Ledger Stash account at no extra cost. Role-based permissions keep each team member seeing only what they need to see.",
  },
  {
    icon: Palette,
    title: "White-Label Branding",
    description:
      "Your logo, your firm name, your brand colors on every client-facing email and portal. Clients see your firm, not ours. Included on every plan.",
  },
  {
    icon: Bot,
    title: "Sage — Your Practice Intelligence Layer",
    description:
      'Ask Sage "which clients are still missing a W-2 across my entire book?" and get a live answer. Sage queries your entire portfolio and can send reminders directly from the conversation.',
  },
  {
    icon: Shield,
    title: "Compliance Built In",
    description:
      "IRS Publication 4557, FTC Safeguards Rule, and GLBA compliance on every plan. AES-256 encryption at rest, TLS 1.3 in transit. Full audit trail with IP, timestamp, and browser fingerprint.",
  },
];

const included = [
  "Unlimited staff seats with role-based access",
  "Up to 100 active client vaults",
  "Magic Link client access — no passwords",
  "White-label branding on all client communications",
  "10 pre-built PBC checklist templates",
  "Prior-year return scanning (AI-generated checklists)",
  "Scout AI — client-facing assistant (all clients)",
  "Sage AI — portfolio-level practice intelligence",
  "Automated reminders with configurable schedules",
  "Two-way secure client messaging",
  "E-signatures included",
  "Bulk client CSV import",
  "Audit-ready export with full timestamp trail",
  "AES-256 + IRS 4557 + FTC Safeguards compliance",
];

export default function ForBoutiqueFirms() {
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Ledger Stash for Boutique Accounting Firms | $149/Month Flat"
        description="The document vault built for boutique CPA firms. Up to 100 active clients, unlimited staff seats, white-label branding, and Sage AI for portfolio-level intelligence. $149/month flat — no per-seat surprises."
        keywords="document vault boutique CPA firm, client portal small accounting firm, TaxDome alternative boutique firm, SmartVault alternative multi-staff, PBC tracking software accounting firm"
        canonical="/for-boutique-firms"
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="py-20 bg-gradient-to-b from-muted/40 to-background">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-4">
                Built for Boutique Firms
              </p>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-6 leading-tight">
                Your Whole Team.<br />One Flat Price.
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                TaxDome charges ~$800 per seat, billed annually upfront. SmartVault charges $55/user/month. Ledger Stash Boutique is $149/month flat — for your entire firm, up to 100 active clients, with unlimited staff seats and AI built in.
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

        {/* The Success Tax Problem */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                The "Success Tax" Is Real
              </h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                When your firm grows and you hire a new associate, your software bill should not grow proportionally. But with TaxDome and SmartVault, it does. Every new team member — permanent or seasonal — triggers another per-seat charge.
              </p>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                A boutique firm with 4 permanent staff and 3 seasonal preparers pays TaxDome approximately $5,600 per year. For the same firm, Ledger Stash Boutique is $1,788 per year — regardless of how many people are on your team.
              </p>
              <p className="text-foreground font-medium">
                The difference is $3,812 per year. That is a junior associate's monthly salary. That is your marketing budget. That is money that should stay in your firm.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                What Makes Boutique Different
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {features.map((f) => (
                <div key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <f.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground">{f.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Everything in the Boutique Plan — $149/Month
                </h2>
                <p className="text-muted-foreground">
                  Up to 100 active client vaults. Unlimited staff. No annual commitment required.
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

        {/* CTA */}
        <section className="py-20 bg-card border-t border-border">
          <div className="container text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Stop Paying Per Seat?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              14-day free trial. No credit card required. Set up your first client in under 5 minutes.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/signup" className="gap-2">
                Start Free Trial — $149/Month
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
