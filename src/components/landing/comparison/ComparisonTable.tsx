import { CheckCircle2 } from "lucide-react";

const rows = [
  {
    feature: "Solo Firm Pricing",
    ledger: "$29/month",
    ledgerSub: "Unlimited team members included",
    smart: "$210/month",
    smartSub: "$1,800/year — 3-user minimum",
    tax: "$800/year per seat",
    taxSub: "Annual contract required",
  },
  {
    feature: "User Minimums",
    ledger: "None — start as a solo",
    smart: "3-user minimum",
    tax: "1-seat minimum",
  },
  {
    feature: "Maximum Staff Seats",
    ledger: "Unlimited (Included)",
    smart: "Per-user pricing",
    tax: "Per-user pricing",
  },
  {
    feature: "Client Login Required?",
    ledger: "No — one-click magic link",
    smart: "Yes",
    tax: "Yes",
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
    smart: "Custom portal",
    tax: "Portal branding only",
  },
  {
    feature: "Time to First Client",
    ledger: "Under 5 minutes",
    smart: "Days to weeks",
    tax: "6–8 weeks",
  },
  {
    feature: "Compliance",
    ledger: "IRS 4557 · FTC Safeguards · GLBA",
    smart: "SOC 2 · IRS 4557",
    tax: "General Security",
  },
  {
    feature: "Audit Trail",
    ledger: "ESIGN/UETA (IP, Timestamp, Browser)",
    smart: "Basic audit trail",
    tax: "Built-in eSign logs",
  },
  {
    feature: "Best For",
    ledger: "Solo firms, boutique practices, EAs, and Controllers",
    smart: "Small to large firms",
    tax: "Small to enterprise firms",
  },
];

const greenValues = [
  "$29/month",
  "None — start as a solo",
  "No — one-click magic link",
  "Under 5 minutes",
  "Unlimited (Included)",
];
const isGreenValue = (val: string) =>
  greenValues.includes(val) || val.includes("Unlimited");

const redKeywords = ["$210", "$800", "$1,800", "Per-user pricing"];
const isRedValue = (val: string) => redKeywords.some((k) => val.includes(k));

export function ComparisonTable() {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto max-w-5xl mx-auto">
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
                {/* LedgerStash column – anchored with light blue bg */}
                <td className="px-5 py-4 text-sm font-bold" style={{ backgroundColor: "#F0F7FF" }}>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#1E8E3E" }} />
                    <div>
                      <span style={{ color: isGreenValue(row.ledger) ? "#1E8E3E" : undefined }}>
                        {row.ledger}
                      </span>
                      {row.ledgerSub && (
                        <span className="block text-xs font-normal text-muted-foreground mt-0.5">
                          {row.ledgerSub}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-muted-foreground">
                  <span style={{ color: isRedValue(row.smart) ? "#D93025" : undefined, fontWeight: isRedValue(row.smart) ? 600 : undefined }}>
                    {row.smart}
                  </span>
                  {row.smartSub && (
                    <span className="block text-xs mt-0.5" style={{ color: isRedValue(row.smartSub) ? "#D93025" : undefined }}>
                      {row.smartSub}
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 text-sm text-muted-foreground">
                  <span style={{ color: isRedValue(row.tax) ? "#D93025" : undefined, fontWeight: isRedValue(row.tax) ? 600 : undefined }}>
                    {row.tax}
                  </span>
                  {row.taxSub && (
                    <span className="block text-xs mt-0.5" style={{ color: isRedValue(row.taxSub) ? "#D93025" : undefined }}>
                      {row.taxSub}
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
              <div className="flex items-start gap-2 font-bold rounded-lg p-2" style={{ backgroundColor: "#F0F7FF" }}>
                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#1E8E3E" }} />
                <div>
                  <span className="text-xs text-muted-foreground font-normal block">Ledger Stash</span>
                  <span style={{ color: isGreenValue(row.ledger) ? "#1E8E3E" : undefined }}>
                    {row.ledger}
                  </span>
                  {row.ledgerSub && (
                    <span className="block text-xs font-normal text-muted-foreground">
                      {row.ledgerSub}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-muted-foreground p-2">
                <span className="text-xs block font-medium text-foreground/60">SmartVault</span>
                <span style={{ color: isRedValue(row.smart) ? "#D93025" : undefined }}>
                  {row.smart}
                </span>
              </div>
              <div className="text-muted-foreground p-2">
                <span className="text-xs block font-medium text-foreground/60">TaxDome</span>
                <span style={{ color: isRedValue(row.tax) ? "#D93025" : undefined }}>
                  {row.tax}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
