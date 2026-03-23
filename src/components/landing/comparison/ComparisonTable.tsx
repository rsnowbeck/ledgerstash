import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const rows = [
  {
    feature: "Solo Firm Pricing",
    ledger: "$49/month flat",
    ledgerSub: "Unlimited team members included",
    smart: "$90/month",
    smartSub: "2-user minimum",
    tax: "~$800/seat — paid upfront annually",
    taxSub: "Full year billed upfront — no refunds, no cancellation",
    liscio: "$49/user + overages",
    liscioSub: "Demo required for monthly pricing",
  },
  {
    feature: "User Minimums",
    ledger: "None — start as a solo",
    smart: "2-user minimum",
    tax: "Per seat",
    liscio: "Per user",
  },
  {
    feature: "Seasonal Staff Cost",
    ledger: "Always included",
    smart: "+$45/user/month",
    tax: "Full year upfront per seat",
    liscio: "+$49/user/month",
  },
  {
    feature: "Annual Contract",
    ledger: "Month to month",
    smart: "Annual",
    tax: "Full year paid upfront",
    liscio: "Contact for monthly",
  },
  {
    feature: "Pricing Transparency",
    ledger: "Public pricing",
    smart: "Public",
    tax: "Public",
    liscio: "Demo required",
  },
  {
    feature: "Context-Aware AI Bot",
    ledger: "Included — all plans",
    smart: "—",
    tax: "—",
    liscio: "—",
  },
  {
    feature: "AI Practice Intelligence",
    ledger: "Included — all plans",
    smart: "—",
    tax: "—",
    liscio: "—",
  },
  {
    feature: "Client Accounts Required",
    ledger: "No — magic link",
    smart: "Yes",
    tax: "Yes",
    liscio: "Yes",
  },
  {
    feature: "Time to First Client",
    ledger: "Under 5 minutes",
    smart: "Days to weeks",
    tax: "6–8 weeks",
    liscio: "Demo required",
  },
  {
    feature: "Best For",
    ledger: "Solo CPAs, boutique firms, EAs",
    smart: "Small to large firms",
    tax: "Small to enterprise firms",
    liscio: "Small to mid firms",
  },
];

const greenValues = [
  "$49/month flat",
  "None — start as a solo",
  "No — magic link",
  "Under 5 minutes",
  "Always included",
  "Month to month",
  "Public pricing",
  "Included — all plans",
];
const isGreenValue = (val: string) =>
  greenValues.includes(val) || val.includes("Included");

const redKeywords = ["$90", "$800", "$45/user", "$49/user", "Per-user", "Per user", "Per seat", "Demo required", "Full year", "Annual", "+$"];
const isRedValue = (val: string) => redKeywords.some((k) => val.includes(k));

const isDash = (val: string) => val === "—";

export function ComparisonTable() {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto max-w-6xl mx-auto">
        <table className="w-full border-collapse bg-card rounded-xl shadow-md overflow-hidden">
          <thead>
            <tr className="bg-primary text-primary-foreground">
              <th className="px-4 py-4 text-left font-semibold text-sm">Feature</th>
              <th className="px-4 py-4 text-left font-semibold text-sm">Ledger Stash</th>
              <th className="px-4 py-4 text-left font-semibold text-sm">SmartVault</th>
              <th className="px-4 py-4 text-left font-semibold text-sm">TaxDome</th>
              <th className="px-4 py-4 text-left font-semibold text-sm">Liscio</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className="border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors"
              >
                <td className="px-4 py-4 font-semibold text-foreground text-sm">
                  {row.feature}
                </td>
                {/* LedgerStash column */}
                <td className="px-4 py-4 text-sm font-bold bg-accent/5">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-success" />
                    <div>
                      <span className={isGreenValue(row.ledger) ? "text-success" : ""}>
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
                <td className="px-4 py-4 text-sm text-muted-foreground">
                  <span className={isRedValue(row.smart) ? "text-destructive font-semibold" : isDash(row.smart) ? "text-muted-foreground/50" : ""}>
                    {row.smart}
                  </span>
                  {row.smartSub && (
                    <span className={`block text-xs mt-0.5 ${isRedValue(row.smartSub || "") ? "text-destructive" : ""}`}>
                      {row.smartSub}
                    </span>
                  )}
                </td>
                <td className="px-4 py-4 text-sm text-muted-foreground">
                  <span className={isRedValue(row.tax) ? "text-destructive font-semibold" : isDash(row.tax) ? "text-muted-foreground/50" : ""}>
                    {row.tax}
                  </span>
                  {row.taxSub && (
                    <span className={`block text-xs mt-0.5 ${isRedValue(row.taxSub || "") ? "text-destructive" : ""}`}>
                      {row.taxSub}
                    </span>
                  )}
                </td>
                <td className="px-4 py-4 text-sm text-muted-foreground">
                  <span className={isRedValue(row.liscio) ? "text-destructive font-semibold" : isDash(row.liscio) ? "text-muted-foreground/50" : ""}>
                    {row.liscio}
                  </span>
                  {row.liscioSub && (
                    <span className={`block text-xs mt-0.5 ${isRedValue(row.liscioSub || "") ? "text-destructive" : ""}`}>
                      {row.liscioSub}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-muted-foreground mt-3 text-center italic">
          Competitor pricing based on publicly available information as of 2026. TaxDome billed annually upfront.
        </p>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-4">
        {rows.map((row, i) => (
          <div key={i} className="bg-card rounded-xl p-4 shadow-sm border border-border">
            <h3 className="font-semibold text-foreground text-sm mb-3">{row.feature}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2 font-bold rounded-lg p-2 bg-accent/5">
                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-success" />
                <div>
                  <span className="text-xs text-muted-foreground font-normal block">Ledger Stash</span>
                  <span className={isGreenValue(row.ledger) ? "text-success" : ""}>
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
                <span className={isRedValue(row.smart) ? "text-destructive" : ""}>
                  {row.smart}
                </span>
              </div>
              <div className="text-muted-foreground p-2">
                <span className="text-xs block font-medium text-foreground/60">TaxDome</span>
                <span className={isRedValue(row.tax) ? "text-destructive" : ""}>
                  {row.tax}
                </span>
              </div>
              <div className="text-muted-foreground p-2">
                <span className="text-xs block font-medium text-foreground/60">Liscio</span>
                <span className={isRedValue(row.liscio) ? "text-destructive" : ""}>
                  {row.liscio}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full comparison link */}
      <div className="text-center mt-6">
        <Link to="/compare" className="text-sm font-medium text-accent hover:underline">
          See the full 25-point comparison →
        </Link>
      </div>
    </>
  );
}
