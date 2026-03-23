import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

interface CompRow {
  feature: string;
  ledger: string;
  ledgerSub?: string;
  smart: string;
  smartSub?: string;
  tax: string;
  taxSub?: string;
  liscio: string;
  liscioSub?: string;
}

const rows: CompRow[] = [
  {
    feature: "Solo Firm Pricing",
    ledger: "✅ $49/month flat — unlimited team members included",
    smart: "❌ $110/month minimum — Accounting Pro, 2-user minimum",
    tax: "❌ ~$800/seat — full year billed upfront",
    liscio: "❌ $49/user/month + usage overages",
  },
  {
    feature: "Staff Seat Minimums",
    ledger: "✅ None — start as a solo",
    smart: "❌ 2–3 user minimum",
    tax: "❌ Per seat — annual lock-in",
    liscio: "❌ Per user",
  },
  {
    feature: "Seasonal Staff Cost",
    ledger: "✅ Always included — price never changes",
    smart: "❌ +$55/staff seat/month",
    tax: "❌ Full year billed upfront per seat",
    liscio: "❌ +$49/user/month per person",
  },
  {
    feature: "Commitment Required",
    ledger: "✅ None — month to month, cancel anytime",
    smart: "❌ Annual billing",
    tax: "❌ Full year billed upfront — no refunds",
    liscio: "❌ Annual — monthly rate requires demo call",
  },
  {
    feature: "Pricing Transparency",
    ledger: "✅ Public pricing — no demo required",
    smart: "❌ Demo required to purchase",
    tax: "✅ Public pricing",
    liscio: "❌ Demo required for monthly rate",
  },
  {
    feature: "Context-Aware AI Client Bot (Scout)",
    ledger: "✅ Scout — conversational, real-time checklist status",
    smart: "⚠️ SmartRequestAI — intake automation only, not conversational",
    tax: "—",
    liscio: "—",
  },
  {
    feature: "AI Practice Intelligence Bot (Sage)",
    ledger: "✅ Sage — queries full portfolio, sends reminders",
    smart: "—",
    tax: "—",
    liscio: "—",
  },
  {
    feature: "E-Signatures",
    ledger: "✅ Included on all plans",
    smart: "⚠️ Add-on on most plans — included only on $150/month minimum plan",
    tax: "✅ Included",
    liscio: "❌ Usage-billed beyond base limit",
  },
  {
    feature: "Client Accounts Required",
    ledger: "✅ No — one-click magic link, no password",
    smart: "❌ Yes — password-protected portal",
    tax: "❌ Yes — client login required",
    liscio: "❌ Yes — account and app required",
  },
  {
    feature: "Time to First Client",
    ledger: "✅ Under 5 minutes — self-serve",
    smart: "❌ Guided setup required — days to weeks",
    tax: "❌ 6–8 weeks onboarding",
    liscio: "❌ Demo required to start",
  },
];

const isPositive = (val: string) => val.startsWith("✅");
const isNegative = (val: string) => val.startsWith("❌");
const isWarning = (val: string) => val.startsWith("⚠️");
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
                    <span className={isPositive(row.ledger) ? "text-success" : ""}>
                      {row.ledger.replace(/^[✅❌⚠️]\s*/, "")}
                    </span>
                  </div>
                </td>
                {([row.smart, row.tax, row.liscio] as const).map((val, j) => (
                  <td key={j} className="px-4 py-4 text-sm text-muted-foreground">
                    <span className={
                      isWarning(val) ? "text-amber-600 font-semibold" :
                      isNegative(val) ? "text-destructive font-semibold" :
                      isDash(val) ? "text-muted-foreground/50" : ""
                    }>
                      {val}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-muted-foreground mt-3 text-center italic">
          SmartVault Accounting Pro: $55/user/month, 2-user minimum, annual billing. TaxDome billed annually upfront — no refunds. Liscio usage fees apply beyond base limits. Pricing as of 2026.
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
                  <span className={isPositive(row.ledger) ? "text-success" : ""}>
                    {row.ledger.replace(/^[✅❌⚠️]\s*/, "")}
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
                  <span className={
                    isWarning(c.val) ? "text-amber-600" :
                    isNegative(c.val) ? "text-destructive" :
                    isDash(c.val) ? "text-muted-foreground/50" : ""
                  }>
                    {c.val}
                  </span>
                </div>
              ))}
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
