import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageSEO } from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Bot, Zap, Shield, Users, FileText, Bell } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Add Your Clients",
    description:
      "Import your client list via CSV or add them one by one. Each client gets their own private, AES-256 encrypted vault in under a minute. Invite your whole team to help — we don't charge for the seats.",
    bullets: [
      "Bulk CSV import or manual entry",
      "Each client gets a separate secure vault",
      "Add unlimited staff at no extra cost",
    ],
  },
  {
    number: "02",
    title: "Build Your PBC Checklist",
    description:
      "Tell each client exactly what documents to provide using terminology they understand — W-2s, K-1s, bank statements. Use our 10 pre-built templates to launch a full year of tax collection in 30 seconds.",
    bullets: [
      "Pre-built templates for 1040, 1120-S, 1065, and more",
      "Custom due dates and priority levels",
      "Attach sample documents for clarity",
    ],
  },
  {
    number: "03",
    title: 'Send a Secure "Magic Link"',
    description:
      "Your clients receive a branded email with a one-click magic link. They land on your white-labeled portal, see their tasks, and start uploading. No account creation and no passwords for them to lose.",
    bullets: [
      "Your firm's logo and brand colors",
      "Drag-and-drop file uploads on desktop or mobile",
      "Zero passwords, zero app downloads",
    ],
  },
  {
    number: "04",
    title: "Auto-Pilot Tracking & Reminders",
    description:
      "Watch your dashboard light up as documents roll in. Ledger Stash automatically handles the chasing with smart reminders based on your schedule. When you're ready, export an audit-ready, timestamped package in one click.",
    bullets: [
      "Real-time completion tracking",
      "Configurable auto-reminders (1–30 days)",
      "One-click audit-ready PDF export",
    ],
  },
];

const aiFeatures = [
  {
    icon: Bot,
    title: "Scout — Your Client's Assistant",
    description:
      "When a client asks \"what do I still need to send you?\" at 10pm, Scout answers instantly with their specific outstanding checklist items — not a generic response. Tax advice is explicitly blocked. Every conversation is logged and reviewable by you.",
  },
  {
    icon: Zap,
    title: "Sage — Your Practice Intelligence",
    description:
      'Ask Sage "who hasn\'t uploaded anything in 7 days?" or "which clients are still missing a W-2 across my entire book?" and get live answers based on your portfolio data. Sage can send reminders directly from the conversation.',
  },
  {
    icon: FileText,
    title: "Prior-Year Return Scanning",
    description:
      "Upload a client's prior-year 1040 and Ledger Stash automatically generates their personalized PBC checklist. The AI identifies income sources and suggests exactly what to request for the current year.",
  },
];

const differentiators = [
  {
    icon: Users,
    title: "Unlimited Staff Seats",
    description:
      "Hire 5 seasonal interns or a new admin without your software bill skyrocketing. Add your entire team for $0 extra.",
  },
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description:
      "IRS Pub 4557, FTC Safeguards, and GLBA compliant. AES-256 encryption at rest and TLS 1.3 in transit.",
  },
  {
    icon: Bell,
    title: "No Client Accounts Required",
    description:
      "Clients click one link and upload instantly. No accounts to create, no passwords to forget, no excuses for late documents.",
  },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="How Ledger Stash Works | Secure Client Vault & PBC Tracker"
        description="See exactly how Ledger Stash replaces document chaos with a secure, automated system. 4 steps, zero passwords, and two AI agents that do the chasing for you."
        keywords="how ledger stash works, secure document collection for CPAs, magic link client portal, PBC checklist automation, accounting document vault"
        canonical="/how-it-works"
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="py-20 bg-gradient-to-b from-muted/40 to-background">
          <div className="container text-center">
            <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-4">
              How It Works
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-6 max-w-3xl mx-auto leading-tight">
              Stop Chasing.<br />Start Working.
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Ledger Stash is a secure document vault and PBC tracker built specifically for solo CPAs and boutique firms. We replaced the friction of client portals with Magic Links, and the burden of follow-ups with AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/signup" className="gap-2">
                  Start Free Trial
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/pricing">See Pricing</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">14-day free trial · No credit card required</p>
          </div>
        </section>

        {/* 4-Step Workflow */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Up and Running in 5 Minutes
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                No onboarding calls. No training videos. No $1,000 "implementation fees." Just a system that works.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {steps.map((step) => (
                <div key={step.number} className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-4xl font-black text-primary/20 leading-none">{step.number}</span>
                    <h3 className="text-xl font-bold text-foreground pt-1">{step.title}</h3>
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{step.description}</p>
                  <ul className="space-y-2">
                    {step.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Section */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-14">
              <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">
                Exclusive to Ledger Stash
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                The AI Agents No Competitor Has
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Ledger Stash is the only document vault with context-aware AI built into every plan. We built two distinct agents to solve the two biggest bottlenecks in accounting.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {aiFeatures.map((feature) => (
                <div key={feature.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground text-sm">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-8 italic">
              SmartVault, TaxDome, and Liscio don't have this. Context-aware AI that knows each client's specific checklist is a Ledger Stash exclusive.
            </p>
          </div>
        </section>

        {/* Differentiators */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Built for Boutique Economics
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Every other platform charges per seat, per user, or per action. We charge one flat price for your entire firm.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {differentiators.map((d) => (
                <div key={d.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm text-center">
                  <div className="flex justify-center mb-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <d.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{d.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{d.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-card border-t border-border">
          <div className="container text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Replace Chaos With a Real System?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Start free for 14 days and see how much you save when you stop paying for software seats.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/signup" className="gap-2">
                  Start Free Trial
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/pricing">See Pricing</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">No setup fees · No credit card required · Cancel anytime</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
