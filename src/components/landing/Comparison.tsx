import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Download } from "lucide-react";
import { generateBlueOceanPdf } from "@/lib/generateBlueOceanPdf";

const rows = [
  {
    feature: "Solo CPA Pricing",
    ledger: "$29/month",
    ledgerSub: "$290/year (save 16%)",
    ledgerSub2: "Unlimited team members included",
    smart: "$210/month",
    smartSub: "$1,800/year — 3-user minimum",
    smartSub2: "Per-user pricing",
    tax: "$800/year per seat",
    taxSub: "Annual contract required",
    taxSub2: "Per-user pricing",
  },
  {
    feature: "User Minimums",
    ledger: "None — start as a solo",
    smart: "3 users minimum (Business Pro)",
    smartSub: "2 users minimum (Accounting Pro)",
    tax: "1 seat minimum, team-oriented",
  },
  {
    feature: "Client Login Required?",
    ledger: "No — one-click magic link",
    smart: "Yes — clients must create an account",
    tax: "Yes — account + mobile app required",
  },
  {
    feature: "PBC List Terminology",
    ledger: "Built for accountants (W-2s, K-1s, PBC)",
    smart: 'Generic "file requests"',
    tax: 'Generic "file requests"',
  },
  {
    feature: "White-Label Branding",
    ledger: "Logo + name on all plans",
    ledgerSub: "Full white-label on Boutique+",
    smart: "Custom portal (all plans)",
    tax: "Portal branding only",
  },
  {
    feature: "Time to First Client Invite",
    ledger: "Under 5 minutes",
    smart: "Days to weeks (training required)",
    tax: "6–8 weeks (dedicated onboarding)",
  },
  {
    feature: "Automated Reminders",
    ledger: "Set-and-forget auto-pilot",
    smart: "Manual requests (SmartRequestAI available)",
    tax: "Automated but complex setup",
  },
  {
    feature: "Compliance",
    ledger: "IRS 4557 · FTC Safeguards · GLBA",
    smart: "SOC 2 · IRS 4557 · FTC · GLBA",
    tax: "General security & compliance",
  },
  {
    feature: "Audit Trail",
    ledger: "ESIGN/UETA compliant",
    ledgerSub: "IP, timestamp, browser + PDF certificate",
    smart: "Basic audit trail",
    tax: "Built-in eSignature logs",
  },
  {
    feature: "Best For",
    ledger: "Solo CPAs, boutique firms, controllers",
    smart: "Small to large firms",
    tax: "Small to enterprise firms",
  },
];

export function Comparison() {
  return (
    <section id="comparison" className="py-24 bg-muted/40">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-[2.25rem] sm:text-[2.5rem] font-bold text-foreground leading-[1.2] mb-4">
            See How Ledger Stash Stacks Up
          </h2>
          <p className="mx-auto max-w-[50rem] text-lg text-muted-foreground font-normal leading-relaxed">
            We built Ledger Stash because SmartVault and TaxDome weren't designed for solo CPAs. Here's the side-by-side.
          </p>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse bg-card rounded-xl shadow-md overflow-hidden">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="px-5 py-4 text-left font-semibold text-sm">Feature</th>
                <th className="px-5 py-4 text-left font-semibold text-sm">Ledger Stash</th>
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
                        {row.ledgerSub2 && (
                          <span className="block text-xs font-normal text-success mt-0.5">
                            {row.ledgerSub2}
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
                    {row.smartSub2 && (
                      <span className="block text-xs mt-0.5 text-destructive">
                        {row.smartSub2}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">
                    {row.tax}
                    {row.taxSub && (
                      <span className="block text-xs mt-0.5">{row.taxSub}</span>
                    )}
                    {row.taxSub2 && (
                      <span className="block text-xs mt-0.5 text-destructive">
                        {row.taxSub2}
                      </span>
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
                    <span className="text-xs text-muted-foreground font-normal block">
                      Ledger Stash
                    </span>
                    {row.ledger}
                    {row.ledgerSub && (
                      <span className="block text-xs font-normal text-muted-foreground">
                        {row.ledgerSub}
                      </span>
                    )}
                    {row.ledgerSub2 && (
                      <span className="block text-xs font-normal text-success">
                        {row.ledgerSub2}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-muted-foreground p-2">
                  <span className="text-xs block font-medium text-foreground/60">SmartVault</span>
                  {row.smart}
                  {row.smartSub2 && (
                    <span className="block text-xs text-destructive">{row.smartSub2}</span>
                  )}
                </div>
                <div className="text-muted-foreground p-2">
                  <span className="text-xs block font-medium text-foreground/60">TaxDome</span>
                  {row.tax}
                  {row.taxSub2 && (
                    <span className="block text-xs text-destructive">{row.taxSub2}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PDF Download */}
        <div className="rounded-xl border border-border bg-card p-6 sm:p-8 text-center mt-10 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Want the full breakdown?
          </h3>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-5">
            Download our cost comparison guide and see exactly how much your firm saves by switching to Ledger Stash.
          </p>
          <button
            onClick={() => generateBlueOceanPdf()}
            className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-colors"
          >
            <Download className="h-5 w-5" />
            Download Free PDF Guide
          </button>
          <p className="mt-3 text-xs text-muted-foreground italic">
            No email required. Instant download.
          </p>
        </div>
      </div>
    </section>
  );
}
