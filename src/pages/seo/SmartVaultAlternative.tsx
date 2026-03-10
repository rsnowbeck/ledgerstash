import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageSEO } from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, UserX, Bell, Sparkles } from "lucide-react";

const whySwitchCards = [
  {
    icon: UserX,
    title: 'No "Solo Penalty"',
    description:
      "SmartVault forces you into a 3-user minimum. LedgerStash lets you start as a solo firm at $29/mo and grow at your own pace.",
  },
  {
    icon: Bell,
    title: "Automated PBC Chasing",
    description:
      "Don't just store files; get them. Our automated nudges follow up with clients until the task is done. You get the files; we do the chasing.",
  },
  {
    icon: Sparkles,
    title: "Modern Client Experience",
    description:
      "SmartVault feels like a 90s folder tree. LedgerStash feels like a premium, modern portal that makes your boutique firm look like a tech leader.",
  },
];

const comparisonRows = [
  {
    feature: "Solo Firm Pricing",
    ledger: "$29/month (Unlimited team)",
    smart: "$210/month ($2,520/yr)",
    ledgerGreen: true,
    smartRed: true,
  },
  {
    feature: "User Minimums",
    ledger: "None — start as a solo",
    smart: "3-user minimum required",
    ledgerGreen: true,
  },
  {
    feature: "Maximum Staff Seats",
    ledger: "Unlimited (Included)",
    smart: "Per-user pricing",
    ledgerGreen: true,
    smartRed: true,
  },
  {
    feature: "Client Login Required?",
    ledger: "No — one-click magic link",
    smart: "Yes — forced portal login",
    ledgerGreen: true,
  },
  {
    feature: "PBC List Terminology",
    ledger: "Built for accountants",
    smart: 'Generic "file requests"',
  },
  {
    feature: "White-Label Branding",
    ledger: "Logo + name on all plans",
    smart: "Custom portal",
  },
  {
    feature: "Time to First Client",
    ledger: "Under 5 minutes",
    smart: "Days to weeks",
    ledgerGreen: true,
  },
  {
    feature: "Compliance",
    ledger: "IRS 4557 · FTC · GLBA",
    smart: "SOC 2 · IRS 4557",
  },
  {
    feature: "Audit Trail",
    ledger: "ESIGN/UETA Compliant",
    smart: "Basic audit trail",
  },
  {
    feature: "Best For",
    ledger: "Solo firms, EAs, & Boutique practices",
    smart: "Large firms with IT staff",
  },
];

export default function SmartVaultAlternative() {
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="SmartVault Alternative for Solo Accounting Firms | Ledger Stash"
        description="Looking for a SmartVault alternative without 3-user minimums? Ledger Stash gives solo CPAs and boutique firms a branded client vault with unlimited team seats for $29/month."
        keywords="SmartVault alternative, SmartVault competitor, SmartVault vs LedgerStash, document portal CPA, solo CPA client portal, accounting firm document management"
        canonical="/smartvault-alternative"
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-28 lg:pt-40 pb-16 lg:pb-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl pb-6">
                The <span className="text-accent">SmartVault Alternative</span> with Zero User Minimums.
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto" style={{ lineHeight: 1.6 }}>
                Why pay $2,520/year for 3 seats when you only need one? Get a professional, branded vault with unlimited staff seats for a fraction of the cost.
              </p>
              <Button variant="hero" size="xl" asChild>
                <Link to="/signup" className="gap-2">
                  Stop Paying for Seats You Don't Need
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <p className="mt-4 text-xs text-muted-foreground">
                No credit card required. 14-day free trial.
              </p>
            </div>
          </div>
        </section>

        {/* Why Switch — 3 Column Cards */}
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
              LedgerStash vs SmartVault
            </h2>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto max-w-4xl mx-auto">
              <table className="w-full border-collapse bg-card rounded-xl shadow-md overflow-hidden">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="px-5 py-4 text-left font-semibold text-sm">Feature</th>
                    <th className="px-5 py-4 text-left font-semibold text-sm">Ledger Stash</th>
                    <th className="px-5 py-4 text-left font-semibold text-sm">SmartVault</th>
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
                            color: row.smartRed ? "#D93025" : undefined,
                            fontWeight: row.smartRed ? 600 : undefined,
                          }}
                        >
                          {row.smart}
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
                        SmartVault
                      </span>
                      <span
                        style={{
                          color: row.smartRed ? "#D93025" : undefined,
                        }}
                      >
                        {row.smart}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-card">
          <div className="container text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Ready to eliminate the Success Tax?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Unlimited team seats. No user minimums. Built for solo firms and boutique practices.
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
        </section>
      </main>
      <Footer />
    </div>
  );
}
