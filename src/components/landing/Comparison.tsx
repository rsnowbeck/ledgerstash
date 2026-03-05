import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";

const rows = [
  {
    feature: "Solo CPA Pricing (Monthly)",
    ledger: "$29/month",
    ledgerSub: "No minimums, no contracts",
    smart: "$210/month",
    smartSub: "$70/user/month, 3-user minimum",
    tax: "$800/year per seat",
    taxSub: "Annual contract only — no monthly option",
  },
  {
    feature: "Annual Cost (Solo CPA)",
    ledger: "$290/year",
    ledgerSub: "Save 16% — just $24.16/month",
    smart: "$1,800/year",
    smartSub: "$50/user/month, 3-user minimum",
    tax: "$800/year per seat",
    taxSub: "Annual contract only — no monthly option",
  },
  {
    feature: "User Minimums",
    ledger: "None — Solo CPA Plan",
    smart: "3 users minimum (Business Pro)",
    smartSub: "2 users minimum (Accounting Pro/Unlimited)",
    tax: "Minimum 1 seat, but designed for teams",
  },
  {
    feature: "Client Login Required?",
    ledger: "No — Frictionless Access",
    smart: "Yes — Clients must create account",
    tax: "Yes — Account & mobile app required",
  },
  {
    feature: "PBC List Management",
    ledger: "Accounting-Specific Terminology",
    smart: 'Generic "File Request" Tool',
    tax: 'Generic "File Request" Tool',
  },
  {
    feature: "White-Label Branding",
    ledger: "Full White-Labeling (All Plans)",
    smart: "Custom Branded Client Portal (All Plans)",
    tax: "Client Portal Branding Only",
  },
  {
    feature: "Setup Time",
    ledger: "Minutes — No Training",
    smart: "Days to Weeks — Requires Training",
    tax: "6–8 Weeks — Dedicated Onboarding Required",
  },
  {
    feature: "Busy Season Automation",
    ledger: "Auto-Pilot Reminders",
    smart: "Manual Document Requests (SmartRequestAI available)",
    tax: "Automated Requests (Requires Complex Setup)",
  },
  {
    feature: "Compliance Focus",
    ledger: "IRS 4557 · FTC Safeguards · GLBA",
    smart: "SOC 2 Type 2 · IRS 4557 · FTC Safeguards · GLBA",
    tax: "General Security & Compliance",
  },
  {
    feature: "Target Audience",
    ledger: "Solo CPAs & Boutique Firms",
    smart: "Small to Large Firms",
    tax: "Small to Enterprise Firms",
  },
  {
    feature: "Core Focus",
    ledger: "Secure Vault + PBC Management",
    smart: "Document Management + Workflow + eSignatures",
    tax: "End-to-End Practice Management",
  },
];

export function Comparison() {
  return (
    <section id="comparison" className="py-24 bg-muted/40">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-[2.25rem] sm:text-[2.5rem] font-bold text-foreground leading-[1.2] mb-4">
            Why Choose LedgerStash Over the Competition?
          </h2>
          <p className="mx-auto max-w-[50rem] text-lg text-muted-foreground font-normal leading-relaxed">
            We know you're evaluating options. Here's why solo CPAs and boutique
            firms choose LedgerStash over SmartVault, TaxDome, and other generic
            solutions.
          </p>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse bg-card rounded-xl shadow-md overflow-hidden">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="px-5 py-4 text-left font-semibold text-sm">Feature</th>
                <th className="px-5 py-4 text-left font-semibold text-sm">LedgerStash</th>
                <th className="px-5 py-4 text-left font-semibold text-sm">SmartVault</th>
                <th className="px-5 py-4 text-left font-semibold text-sm">TaxDome</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors"
                >
                  <td className="px-5 py-4 font-semibold text-foreground text-sm">
                    {row.feature}
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-success bg-success/5">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                      <div>
                        {row.ledger}
                        {row.ledgerSub && (
                          <span className="block text-xs font-normal text-muted-foreground mt-0.5">
                            {row.ledgerSub}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">
                    {row.smart}
                    {row.smartSub && (
                      <span className="block text-xs mt-0.5">{row.smartSub}</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">
                    {row.tax}
                    {row.taxSub && (
                      <span className="block text-xs mt-0.5">{row.taxSub}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-4">
          {rows.map((row, i) => (
            <div key={i} className="bg-card rounded-xl p-4 shadow-sm border border-border">
              <h3 className="font-semibold text-foreground text-sm mb-3">{row.feature}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2 text-success font-semibold bg-success/5 rounded-lg p-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs text-muted-foreground font-normal block">LedgerStash</span>
                    {row.ledger}
                    {row.ledgerSub && <span className="block text-xs font-normal text-muted-foreground">{row.ledgerSub}</span>}
                  </div>
                </div>
                <div className="text-muted-foreground p-2">
                  <span className="text-xs block font-medium text-foreground/60">SmartVault</span>
                  {row.smart}
                </div>
                <div className="text-muted-foreground p-2">
                  <span className="text-xs block font-medium text-foreground/60">TaxDome</span>
                  {row.tax}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 space-y-4">
          <p className="text-lg font-semibold text-foreground">
            <strong>The Math is Simple:</strong> LedgerStash gives you everything
            you need at a fraction of the cost.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl" asChild>
              <Link to="/signup">
                Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#faq">Learn More in FAQ</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
