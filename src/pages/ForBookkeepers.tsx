import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageSEO } from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Bot, FileText, Bell, Shield } from "lucide-react";

const useCases = [
  {
    title: "Monthly Bank Statements",
    description: "Send your client a Magic Link at the start of every month. They upload their statements. Scout confirms receipt. You start reconciling — no emails, no texts, no chasing.",
  },
  {
    title: "Receipt Collection",
    description: "Clients upload photos of receipts directly to their vault from their phone. Organized by month, timestamped, and ready for categorization. No more email attachments buried in your inbox.",
  },
  {
    title: "Year-End Packages",
    description: "Build a year-end PBC checklist with every document you need for the annual close. Send it once, let automated reminders do the follow-up, and export an audit-ready package when it's complete.",
  },
  {
    title: "New Client Onboarding",
    description: "Send every new client a Magic Link with your standard onboarding checklist. They complete it at their own pace. You get notified when everything is in.",
  },
];

const included = [
  "Magic Link client access — no passwords",
  "Unlimited staff seats",
  "PBC checklist templates for bookkeeping engagements",
  "Automated monthly reminders",
  "Scout AI — answers client questions about their checklist",
  "Sage AI — portfolio-level status queries",
  "White-label branding",
  "Secure two-way messaging per client",
  "AES-256 encryption + FTC Safeguards compliance",
  "Audit-ready export with timestamps",
];

export default function ForBookkeepers() {
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Ledger Stash for Bookkeepers | Secure Document Collection"
        description="Bookkeepers spend hours every month chasing bank statements, receipts, and source documents. Ledger Stash replaces that chaos with Magic Links, automated reminders, and AI that answers client questions for you."
        keywords="document collection for bookkeepers, client portal for bookkeepers, bookkeeper document vault, secure file sharing bookkeeper, bookkeeping client portal software"
        canonical="/for-bookkeepers"
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="py-20 bg-gradient-to-b from-muted/40 to-background">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-4">
                Built for Bookkeepers
              </p>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-6 leading-tight">
                Stop Chasing Statements.<br />Start Reconciling.
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Every month, bookkeepers lose hours chasing the same documents from the same clients. Ledger Stash replaces the chase with a system — Magic Links, automated reminders, and an AI assistant that handles client questions so you don't have to.
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
              <p className="text-sm text-muted-foreground mt-4">14-day free trial · No credit card required · Cancel anytime</p>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                How Bookkeepers Use Ledger Stash
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                The same secure vault and Magic Link workflow that CPAs use for tax season works perfectly for monthly bookkeeping engagements.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {useCases.map((uc) => (
                <div key={uc.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <h3 className="font-bold text-foreground mb-3">{uc.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{uc.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The Magic Link Difference */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Why Your Clients Will Actually Use This
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                The reason clients don't use your current portal is friction. They forgot the password. They don't want to create another account. They'll just email you the file instead.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Ledger Stash uses Magic Links. Your client receives an email, clicks one link, and lands directly in their vault — no account creation, no password, no friction. On mobile, on desktop, from any browser.
              </p>
              <p className="text-foreground font-medium">
                When you remove the friction, the documents arrive on time. It is that simple.
              </p>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Everything You Need — Starting at $49/Month
                </h2>
                <p className="text-muted-foreground">
                  Unlimited staff seats. No per-seat charges. Cancel anytime.
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
              Ready to Stop Chasing?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Set up your first client in under 5 minutes. No onboarding call required.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/signup" className="gap-2">
                Start Free Trial
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
