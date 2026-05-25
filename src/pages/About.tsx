import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageSEO } from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Users, Zap } from "lucide-react";

const beliefs = [
  {
    icon: Shield,
    title: "Security Should Not Require a PhD",
    description:
      "Bank-grade encryption should be the default, not an enterprise add-on. Every client vault on Ledger Stash is AES-256 encrypted at rest and TLS 1.3 in transit — on every plan, from day one.",
  },
  {
    icon: Users,
    title: "You Should Not Pay for Seats You Don't Need",
    description:
      "Seasonal staff, junior associates, and part-time bookkeepers should not cost you $800 per seat per year. We charge by the number of clients you manage, not the number of people helping you manage them.",
  },
  {
    icon: Zap,
    title: "Clients Should Not Need a Password to Work With You",
    description:
      "The number one reason clients procrastinate on uploading documents is friction. We eliminated it. One click, one link, documents uploaded. No accounts, no passwords, no excuses.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="About Ledger Stash | Built by Accountants, for Accountants"
        description="Ledger Stash was built by a team that lived the document chaos firsthand. Learn the story behind the platform and why we built it the way we did."
        keywords="about ledger stash, ledger stash founders, who built ledger stash, accounting document vault founders"
        canonical="/about"
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="py-20 bg-gradient-to-b from-muted/40 to-background">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-4">
                Our Story
              </p>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-6 leading-tight">
                Built by People Who Lived the Problem
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Ledger Stash was not built in a vacuum. It was built by a team that watched accounting firms spend 25% of their week chasing documents, paying for software seats they didn't need, and apologizing to clients for portals they couldn't figure out.
              </p>
            </div>
          </div>
        </section>

        {/* The Origin Story */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-8">The Origin</h2>
              <div className="prose prose-neutral max-w-none space-y-6 text-muted-foreground leading-relaxed">
                <p className="text-base">
                  The idea for Ledger Stash came from a real conversation between a founder and a CFO who had spent years inside accounting firms watching the same problem repeat itself every single tax season.
                </p>
                <p className="text-base">
                  The CFO — who now serves as an advisor to Ledger Stash — had managed financial operations at multiple organizations and watched solo practitioners and boutique firms lose thousands of hours every year to the same three problems: clients who couldn't figure out the portal, staff seats that cost a fortune for seasonal workers, and document requests that were too vague to act on.
                </p>
                <p className="text-base">
                  The existing tools were built for enterprise firms with IT departments and implementation budgets. They charged per seat, required guided onboarding, and expected clients to create accounts and remember passwords. None of that made sense for a 3-person CPA firm trying to serve 80 clients during a 90-day tax season.
                </p>
                <p className="text-base">
                  So we built the tool we wished existed. Flat pricing by client volume, not by seat count. Magic Links instead of passwords. AI agents that handle the chasing so you don't have to. And a setup time measured in minutes, not weeks.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CFO Advisor Callout */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto rounded-2xl border border-border bg-card p-8 sm:p-10 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                {/* Photo placeholder */}
                <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
                  <Users className="h-8 w-8 text-primary/40" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">
                    CFO Perspective
                  </p>
                  <blockquote className="text-foreground font-medium text-lg leading-relaxed mb-4 italic">
                    "Every accounting firm I worked with had the same problem: the software was built for the software company's revenue model, not for the firm's workflow. Charging per seat in a seasonal business is not a pricing model — it's a penalty for growth."
                  </blockquote>
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">CFO Advisor, Ledger Stash</strong><br />
                    Former CFO with experience across multiple organizations and accounting firm relationships
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What We Believe */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                What We Believe
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Three principles that shaped every product decision we made.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {beliefs.map((b) => (
                <div key={b.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <b.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground text-sm">{b.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-card border-t border-border">
          <div className="container text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Try It?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              14-day free trial. No credit card required. Set up your first client in under 5 minutes.
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
