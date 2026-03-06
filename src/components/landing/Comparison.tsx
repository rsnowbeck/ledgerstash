import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Download } from "lucide-react";
import { generateBlueOceanPdf } from "@/lib/generateBlueOceanPdf";

const rows = [
  {
    feature: "Solo CPA Pricing",
    ledger: "$29/month",
    ledgerSub: "$290/year (save 16%)",
    ledgerSub2: "All Plans Unlimited Users",
    smart: "$210/month",
    smartSub: "$1,800/year — 3-user minimum",
    smartSub2: "Price per user",
    tax: "$800/year per seat",
    taxSub: "Annual contract only",
    taxSub2: "Price per user",
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
                      <span className="block text-xs mt-0.5 text-destructive">{row.smartSub2}</span>
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
                    {row.ledgerSub2 && <span className="block text-xs font-normal text-success">{row.ledgerSub2}</span>}
                  </div>
                </div>
                <div className="text-muted-foreground p-2">
                  <span className="text-xs block font-medium text-foreground/60">SmartVault</span>
                  {row.smart}
                  {row.smartSub2 && <span className="block text-xs text-destructive">{row.smartSub2}</span>}
                </div>
                <div className="text-muted-foreground p-2">
                  <span className="text-xs block font-medium text-foreground/60">TaxDome</span>
                  {row.tax}
                  
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PDF Download — No Gate */}
        <div className="rounded-xl border border-border bg-muted/30 p-6 sm:p-8 text-center mt-10">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Want to review the numbers later?
          </h3>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-5">
            Download our comprehensive Cost Savings Guide and see exactly how much you can save by switching to LedgerStash.
          </p>
          <button
            onClick={() => generateBlueOceanPdf()}
            className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-colors"
          >
            <Download className="h-5 w-5" />
            Download PDF Guide
          </button>
          <p className="mt-3 text-xs text-muted-foreground italic">
            No email required.
          </p>
        </div>

      </div>
    </section>
  );
}
