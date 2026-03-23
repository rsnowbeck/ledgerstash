import { Link } from "react-router-dom";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageSEO } from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, XCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";

const comparisonRows = [
  { feature: "Solo Firm Pricing", ledger: "$49/month flat", smart: "$110/month min (Accounting Pro, 2-user min)", tax: "~$800/seat — paid upfront annually", liscio: "$49/user/month + overages" },
  { feature: "Staff Seat Minimums", ledger: "None", smart: "2–3 user minimum", tax: "Per seat", liscio: "Per user" },
  { feature: "Seasonal Staff Cost", ledger: "Included — always", smart: "+$55/staff seat/month", tax: "Full year upfront per seat", liscio: "+$49/user/month" },
  { feature: "Annual Contract Required", ledger: "No — month to month", smart: "Yes", tax: "Full year billed upfront — no refunds, no cancellation", liscio: "Contact for monthly" },
  { feature: "Pricing Transparency", ledger: "Public pricing", smart: "Public pricing", tax: "Public pricing", liscio: "Demo required" },
  { feature: "Client Accounts Required", ledger: "No", smart: "Yes", tax: "Yes", liscio: "Yes" },
  { feature: "Client Access Method", ledger: "One-click magic link", smart: "Password login", tax: "Password login", liscio: "Password login" },
  { feature: "Mobile Experience", ledger: "Mobile-first (React)", smart: "Desktop-focused", tax: "Limited mobile", liscio: "Native app" },
  { feature: "PBC List Terminology", ledger: "Built for accountants (W-2s, K-1s, PBC)", smart: 'Generic "file requests"', tax: 'Generic "file requests"', liscio: "Generic tasks" },
  { feature: "White-Label Branding", ledger: "Logo + name — all plans", smart: "Custom portal", tax: "Portal branding only", liscio: "Paid add-on" },
  { feature: "E-Signatures", ledger: "Included — all plans", smart: "⚠️ Add-on on most plans", tax: "Included", liscio: "Usage-billed per signature" },
  { feature: "Context-Aware AI Client Bot", ledger: "Conversational, real-time checklist status", smart: "⚠️ SmartRequestAI — intake only, not conversational", tax: "—", liscio: "—" },
  { feature: "AI Practice Intelligence Bot", ledger: "Portfolio queries + sends reminders", smart: "—", tax: "—", liscio: "—" },
  { feature: "Time to First Client", ledger: "Under 5 minutes", smart: "Days to weeks", tax: "6–8 weeks", liscio: "Demo required" },
  { feature: "Setup / Onboarding", ledger: "Self-serve — no demo needed", smart: "Self-serve", tax: "6–8 week onboarding", liscio: "Mandatory demo call" },
  { feature: "Busy Season Auto-Reminders", ledger: "Included", smart: "Included", tax: "Included", liscio: "Included" },
  { feature: "Unlimited Team Members", ledger: "Included — all plans", smart: "Per-user pricing", tax: "Per-user pricing", liscio: "Per-user pricing" },
  { feature: "Best For", ledger: "Solo CPAs, boutique firms, EAs", smart: "Small to large firms", tax: "Small to enterprise", liscio: "Small to mid firms" },
];

const greenValues = [
  "$49/month flat",
  "None — start as a solo",
  "No — month to month",
  "One-click magic link",
  "Under 5 minutes",
  "Included — always",
  "Included — all plans",
  "No",
  "Self-serve — no demo needed",
  "Public pricing",
];
const isGreenValue = (val: string) => greenValues.includes(val) || val.includes("Included");

const redKeywords = ["$110", "$800", "$55/staff", "+$49", "Per-user pricing", "2–3 user minimum", "Yes", "Demo required", "Mandatory demo", "6–8 week", "Days to weeks", "Password login", "Add-on", "Usage-billed", "Paid add-on", "Contact for monthly", "Per seat", "Per user"];
const isRedValue = (val: string) => redKeywords.some((k) => val.includes(k));

const costCards = [
  {
    name: "SmartVault",
    tagline: "SmartVault requires a 2-user minimum.",
    pain: "As a solo practitioner you pay for 1 employee who doesn't exist.",
    bullets: [
      "Base cost: $110/month (2-seat minimum, Accounting Pro)",
      "Annual cost: $1,320/year",
      "Employees you're paying for who don't work for you: 1",
      "eSignatures: Add-on — not included",
      "Setup time: Days to weeks",
    ],
    ledgerCost: "$588/year",
    savings: "$732/year",
  },
  {
    name: "TaxDome",
    tagline: "TaxDome charges per seat on an annual contract.",
    pain: "Add 3 seasonal staff in January — you're locked in for 12 months.",
    bullets: [
      "Base cost: ~$800/seat/year",
      "4 seats (you + 3 seasonal): $3,200/year",
      "Months you actually need those extra seats: 4",
      "Months you're paying for anyway: 12",
      "Setup time: 6–8 weeks",
    ],
    ledgerCost: "$588/year",
    savings: "$2,612/year",
  },
  {
    name: "Liscio",
    tagline: "Liscio charges per user plus usage fees on every core action.",
    pain: "Every tax gathering, delivery, and e-signature adds to your bill.",
    bullets: [
      "Base cost: $49/user/month (Tax Solo)",
      "4 users: $196/month",
      "Plus: overages on tax gatherings, deliveries, e-signatures",
      "Requires a demo call just to see monthly pricing",
      "Annual estimate with overages: $2,400–3,600+/year",
    ],
    ledgerCost: "$588/year",
    savings: "$1,800–3,000+/year",
  },
];

const deepDives = [
  {
    name: "SmartVault",
    text: "SmartVault was built for mid-size and enterprise accounting firms. It's a capable product — but it was never designed for the solo practitioner or boutique firm. The 2-user minimum isn't an oversight. It's a business model that assumes you have a team.\n\nSmartVault does offer SmartRequestAI for intake automation from prior-year returns — a genuine feature. But it's not conversational AI. Ledger Stash includes two purpose-built AI agents that work in real time. If you're a solo CPA, Ledger Stash starts at $49/month with no minimums, no phantom seats, and no annual commitment.",
    link: "/smartvault-alternative",
    linkText: "Full SmartVault vs Ledger Stash comparison",
  },
  {
    name: "TaxDome",
    text: "TaxDome is a powerful full-practice management suite. If you need CRM, invoicing, workflow automation, and a client portal all in one — TaxDome delivers. But that power comes with a price: annual contracts, per-seat billing, and a 6–8 week onboarding process before you see your first client.\n\nIf you need secure document collection, PBC lists, and engagement letter tracking — without the enterprise overhead — Ledger Stash is set up in under 5 minutes with no contract required.",
    link: "/taxdome-alternative",
    linkText: "Full TaxDome vs Ledger Stash comparison",
  },
  {
    name: "Liscio",
    text: "Liscio is built around two-way client communication — secure messaging, mobile app, email integration. It's a strong communication tool. But its pricing model is built around per-user fees plus usage-based billing on the actions you perform most: tax gatherings, deliveries, and e-signatures.\n\nLedger Stash includes e-signatures on all plans, charges one flat fee regardless of team size, and publishes its pricing publicly — no demo required.",
    link: "/liscio-alternative",
    linkText: "Full Liscio vs Ledger Stash comparison",
  },
];

const comparePageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Compare Ledger Stash vs SmartVault, TaxDome & Liscio",
  description: "See how Ledger Stash compares to SmartVault, TaxDome, and Liscio. No per-user fees, no seat minimums, no annual contracts.",
  url: "https://www.ledgerstash.com/compare",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://ledgerstash.com" },
      { "@type": "ListItem", position: 2, name: "Compare", item: "https://ledgerstash.com/compare" },
    ],
  },
};

export default function Compare() {
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Compare Ledger Stash vs SmartVault, TaxDome & Liscio | Ledger Stash"
        description="See how Ledger Stash compares to SmartVault, TaxDome, and Liscio. No per-user fees, no seat minimums, no annual contracts. Built for solo CPAs and boutique firms. Start free for 14 days."
        keywords="smartvault alternative, taxdome alternative, liscio alternative, CPA client vault comparison, accounting firm portal pricing"
        canonical="/compare"
        ogType="website"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(comparePageSchema)}</script>
      </Helmet>
      <Header />

      <main>
        {/* SECTION 1 — Page Header */}
        <section className="pt-36 lg:pt-44 pb-16 px-4">
          <div className="container max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6">
              How Ledger Stash Compares
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-3">
              Every other platform charges per seat, per user, or per action.
              <br className="hidden sm:block" />
              We charge one flat price for your entire firm.
            </p>
            <p className="text-sm text-muted-foreground">
              No user minimums. No annual lock-in. No usage fees. Just one number.
            </p>
          </div>
        </section>

        {/* SECTION 2 — Full Comparison Table */}
        <section className="pb-20 px-4">
          <div className="container max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
              Feature-by-Feature Breakdown
            </h2>

            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full border-collapse bg-card rounded-xl shadow-md overflow-hidden">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="px-4 py-4 text-left font-semibold text-sm w-[200px]">Feature</th>
                    <th className="px-4 py-4 text-left font-semibold text-sm">Ledger Stash</th>
                    <th className="px-4 py-4 text-left font-semibold text-sm">SmartVault</th>
                    <th className="px-4 py-4 text-left font-semibold text-sm">TaxDome</th>
                    <th className="px-4 py-4 text-left font-semibold text-sm">Liscio</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr key={i} className="border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3.5 font-semibold text-foreground text-sm">{row.feature}</td>
                      <td className="px-4 py-3.5 text-sm font-bold" style={{ backgroundColor: "hsl(220 80% 97%)" }}>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-success" />
                          <span style={{ color: isGreenValue(row.ledger) ? "hsl(160 60% 35%)" : undefined }}>
                            {row.ledger}
                          </span>
                        </div>
                      </td>
                      {[row.smart, row.tax, row.liscio].map((val, j) => (
                        <td key={j} className="px-4 py-3.5 text-sm text-muted-foreground">
                          <span style={{ color: isRedValue(val) ? "hsl(0 72% 51%)" : undefined, fontWeight: isRedValue(val) ? 600 : undefined }}>
                            {val}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden space-y-4">
              {comparisonRows.map((row, i) => (
                <div key={i} className="bg-card rounded-xl p-4 shadow-sm border border-border">
                  <h3 className="font-semibold text-foreground text-sm mb-3">{row.feature}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2 font-bold rounded-lg p-2" style={{ backgroundColor: "hsl(220 80% 97%)" }}>
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-success" />
                      <div>
                        <span className="text-xs text-muted-foreground font-normal block">Ledger Stash</span>
                        <span style={{ color: isGreenValue(row.ledger) ? "hsl(160 60% 35%)" : undefined }}>
                          {row.ledger}
                        </span>
                      </div>
                    </div>
                    {[
                      { label: "SmartVault", val: row.smart },
                      { label: "TaxDome", val: row.tax },
                      { label: "Liscio", val: row.liscio },
                    ].map((c, j) => (
                      <div key={j} className="text-muted-foreground p-2">
                        <span className="text-xs block font-medium text-foreground/60">{c.label}</span>
                        <span style={{ color: isRedValue(c.val) ? "hsl(0 72% 51%)" : undefined }}>
                          {c.val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground text-center mt-6 max-w-3xl mx-auto">
              Competitor pricing and features based on publicly available information as of 2026. SmartVault Accounting Pro: $55/user/month, 2-user minimum, annual billing. TaxDome billed annually upfront. Liscio usage fees apply beyond base limits.
            </p>
          </div>
        </section>

        {/* SECTION 3 — The Real Cost Breakdown */}
        <section className="pb-20 px-4 bg-muted/30">
          <div className="container max-w-6xl mx-auto pt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-2">
              What You're Actually Paying
            </h2>
            <p className="text-muted-foreground text-center mb-12">
              For a solo CPA with 3 seasonal staff for 4 months.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {costCards.map((card) => (
                <div key={card.name} className="bg-card rounded-2xl border border-border p-6 shadow-sm flex flex-col">
                  <h3 className="text-lg font-bold text-foreground mb-1">{card.name}</h3>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{card.tagline}</p>
                  <p className="text-sm text-destructive font-medium mb-4">{card.pain}</p>
                  <ul className="space-y-1.5 text-sm text-muted-foreground mb-6 flex-1">
                    {card.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 mt-0.5 shrink-0 text-destructive/70" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-border pt-4 space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Your cost with Ledger Stash: <span className="font-bold text-foreground">{card.ledgerCost}</span>
                    </p>
                    <p className="text-xl font-extrabold text-primary">
                      You save: {card.savings}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4 — Individual Competitor Deep Dives */}
        <section className="pb-20 px-4 pt-16">
          <div className="container max-w-4xl mx-auto space-y-10">
            {deepDives.map((d) => (
              <div key={d.name} className="bg-card rounded-2xl border border-border p-6 md:p-8">
                <h3 className="text-xl font-bold text-foreground mb-3">{d.name} vs Ledger Stash</h3>
                {d.text.split("\n\n").map((p, i) => (
                  <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-3">{p}</p>
                ))}
                <Link to={d.link} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                  → {d.linkText}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5 — Bottom CTA */}
        <section className="pb-24 px-4">
          <div className="container max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
              Ready to Stop Paying for Seats You Don't Need?
            </h2>
            <p className="text-muted-foreground mb-8">
              14-day free trial. No credit card required. Set up your first client in under 5 minutes.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/signup">Start Free Trial</Link>
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Already on SmartVault or TaxDome? We'll help you switch.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
