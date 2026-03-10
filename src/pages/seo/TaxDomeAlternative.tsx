import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageSEO } from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Clock, Users, Shield, Download } from "lucide-react";
import { generateMigrationGuidePdf } from "@/lib/generateMigrationGuidePdf";

const whySwitchCards = [
  {
    icon: Clock,
    title: "Set Up in 5 Minutes",
    description:
      'TaxDome requires weeks of "Academy" training just to get started. LedgerStash is a dedicated vault. If you can send an email, you can send your first PBC request today.',
  },
  {
    icon: Users,
    title: "Unlimited Staff Seats",
    description:
      "TaxDome penalizes you for hiring seasonal help or an admin. We don't. Add your entire team—from interns to partners—for $0 extra and keep your margins as you grow.",
  },
  {
    icon: Shield,
    title: "Passwordless for Clients",
    description:
      "Stop acting as your clients' IT support. Our secure Magic Links let clients upload documents in one click—no accounts to create, no passwords to reset.",
  },
];

const comparisonRows = [
  {
    feature: "Solo Firm Pricing",
    ledger: "$29/month (Unlimited team)",
    competitor: "$800/year per seat",
    ledgerGreen: true,
    competitorRed: true,
  },
  {
    feature: "Implementation Time",
    ledger: "Under 5 minutes",
    competitor: "6–8 weeks (Training required)",
    ledgerGreen: true,
  },
  {
    feature: "Maximum Staff Seats",
    ledger: "Unlimited (Included)",
    competitor: "Per-user pricing",
    ledgerGreen: true,
    competitorRed: true,
  },
  {
    feature: "Client Login Required?",
    ledger: "No — one-click magic link",
    competitor: "Yes — forced account creation",
    ledgerGreen: true,
  },
  {
    feature: "PBC List Terminology",
    ledger: "Built for accountants",
    competitor: 'Generic "file requests"',
  },
  {
    feature: "White-Label Branding",
    ledger: "Logo + name on all plans",
    competitor: "Portal branding only",
  },
  {
    feature: "Audit Trail",
    ledger: "ESIGN/UETA Compliant",
    competitor: "Built-in eSign logs",
  },
  {
    feature: "Compliance",
    ledger: "IRS 4557 · FTC · GLBA",
    competitor: "General Security",
  },
  {
    feature: "Best For",
    ledger: "Solo firms, EAs, & Boutique practices",
    competitor: "Enterprise-level firms",
  },
];

export default function TaxDomeAlternative() {
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="TaxDome Alternative for Solo & Boutique Firms | Ledger Stash"
        description="Looking for a TaxDome alternative without per-seat pricing or weeks of training? Ledger Stash gives solo CPAs a branded vault with unlimited team seats for $29/month."
        keywords="TaxDome alternative, TaxDome competitor, TaxDome vs LedgerStash, solo CPA client portal, accounting firm document management, practice management alternative"
        canonical="/taxdome-alternative"
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-28 lg:pt-40 pb-16 lg:pb-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl pb-6">
                The <span className="text-accent">TaxDome Alternative</span> for Firms That Don't Need a CRM.
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto" style={{ lineHeight: 1.6 }}>
                Stop paying $800/year per seat for a complex practice management system you don't use. LedgerStash is the streamlined vault built for speed, security, and zero "Success Tax" on your staff.
              </p>
              <Button variant="hero" size="xl" asChild>
                <Link to="/signup" className="gap-2">
                  Eliminate the Success Tax
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <p className="mt-4 text-xs text-muted-foreground">
                No credit card required. 14-day free trial.
              </p>
            </div>
          </div>
        </section>

        {/* Why Firms Are Switching — 3 Column Cards */}
        <section className="py-16 bg-muted/40">
          <div className="container">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-12">
              Why Firms Are Switching
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {whySwitchCards.map((card) => (
                <div
                  key={card.title}
                  className="group p-8 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md hover:border-accent/30 transition-all duration-300 text-center"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent mb-5">
                    <card.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 1-on-1 Comparison Table */}
        <section className="py-16">
          <div className="container">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-12">
              LedgerStash vs TaxDome
            </h2>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto max-w-4xl mx-auto">
              <table className="w-full border-collapse bg-card rounded-xl shadow-md overflow-hidden">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="px-5 py-4 text-left font-semibold text-sm">Feature</th>
                    <th className="px-5 py-4 text-left font-semibold text-sm">Ledger Stash</th>
                    <th className="px-5 py-4 text-left font-semibold text-sm">TaxDome</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-5 py-4 font-semibold text-foreground text-sm">
                        {row.feature}
                      </td>
                      <td
                        className="px-5 py-4 text-sm font-bold"
                        style={{ backgroundColor: "#F0F7FF" }}
                      >
                        <div className="flex items-start gap-2">
                          <CheckCircle2
                            className="h-4 w-4 mt-0.5 shrink-0"
                            style={{ color: "#1E8E3E" }}
                          />
                          <span
                            style={{
                              color: row.ledgerGreen ? "#1E8E3E" : undefined,
                            }}
                          >
                            {row.ledger}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        <span
                          style={{
                            color: row.competitorRed ? "#D93025" : undefined,
                            fontWeight: row.competitorRed ? 600 : undefined,
                          }}
                        >
                          {row.competitor}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-4 max-w-lg mx-auto">
              {comparisonRows.map((row, i) => (
                <div key={i} className="bg-card rounded-xl p-4 shadow-sm border border-border">
                  <h3 className="font-semibold text-foreground text-sm mb-3">{row.feature}</h3>
                  <div className="space-y-2 text-sm">
                    <div
                      className="flex items-start gap-2 font-bold rounded-lg p-2"
                      style={{ backgroundColor: "#F0F7FF" }}
                    >
                      <CheckCircle2
                        className="h-4 w-4 mt-0.5 shrink-0"
                        style={{ color: "#1E8E3E" }}
                      />
                      <div>
                        <span className="text-xs text-muted-foreground font-normal block">
                          Ledger Stash
                        </span>
                        <span
                          style={{
                            color: row.ledgerGreen ? "#1E8E3E" : undefined,
                          }}
                        >
                          {row.ledger}
                        </span>
                      </div>
                    </div>
                    <div className="text-muted-foreground p-2">
                      <span className="text-xs block font-medium text-foreground/60">
                        TaxDome
                      </span>
                      <span
                        style={{
                          color: row.competitorRed ? "#D93025" : undefined,
                        }}
                      >
                        {row.competitor}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Migration Guide Download */}
        <section className="py-12 bg-muted/40">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent mb-4">
                <Download className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Worried about the move?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Download our <strong>60-Second Migration Guide</strong> to see how we handle the heavy lifting for you.
              </p>
              <Button
                variant="outline"
                size="lg"
                className="gap-2"
                onClick={() => generateMigrationGuidePdf("TaxDome")}
              >
                <Download className="h-4 w-4" />
                Download Migration Guide (PDF)
              </Button>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 bg-card">
          <div className="container text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Ready to stop paying the Success Tax?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Unlimited team seats. No user minimums. Built for boutique firms.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/signup" className="gap-2">
                Start Your Free Trial
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <p className="mt-4 text-xs text-muted-foreground">
              No credit card required. 14-day free trial.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
