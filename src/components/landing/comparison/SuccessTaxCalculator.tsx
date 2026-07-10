import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Calculator } from "lucide-react";

type Competitor = "smartvault" | "taxdome" | "liscio";

const competitors: { key: Competitor; label: string }[] = [
  { key: "smartvault", label: "SmartVault" },
  { key: "taxdome", label: "TaxDome" },
  { key: "liscio", label: "Liscio" },
];

function getCompetitorCost(competitor: Competitor, staffCount: number): number {
  switch (competitor) {
    case "smartvault":
      // $110/month base (2 users) + $55/month per additional user
      const extraUsers = Math.max(0, staffCount - 2);
      return (110 + extraUsers * 55) * 12;
    case "taxdome":
      // $800/seat/year upfront
      return staffCount * 800;
    case "liscio":
      // $49/user/month per person
      return staffCount * 49 * 12;
  }
}

export function SuccessTaxCalculator() {
  const [staffCount, setStaffCount] = useState(3);
  const [competitor, setCompetitor] = useState<Competitor>("smartvault");

  const competitorCost = getCompetitorCost(competitor, staffCount);
  const ledgerStashCost = 49 * 12; // $49/month flat
  const annualSavings = competitorCost - ledgerStashCost;
  const competitorLabel = competitors.find((c) => c.key === competitor)?.label;

  return (
    <div className="max-w-2xl mx-auto mt-14 rounded-xl border border-border bg-card p-6 sm:p-8 shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Calculator className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground">
          Calculate Your &ldquo;Success Tax&rdquo;
        </h3>
      </div>

      {/* Competitor selector */}
      <label className="block text-sm font-medium text-foreground mb-2">
        Compare against:
      </label>
      <div className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 p-1 mb-6">
        {competitors.map((c) => (
          <button
            key={c.key}
            onClick={() => setCompetitor(c.key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              competitor === c.key
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <label className="block text-sm font-medium text-foreground mb-4">
        How many staff members do you have?{" "}
        <span className="text-primary font-bold text-lg">{staffCount}</span>
      </label>

      <Slider
        min={1}
        max={50}
        step={1}
        value={[staffCount]}
        onValueChange={([v]) => setStaffCount(v)}
        className="mb-8"
        aria-label="Number of staff members"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="rounded-lg border border-border p-4 text-center">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
            {competitorLabel}
          </p>
          <p className="text-2xl font-bold text-destructive">
            ${competitorCost.toLocaleString()}
            <span className="text-sm font-normal text-muted-foreground"> / year</span>
          </p>
        </div>
        <div className="rounded-lg border border-border p-4 text-center bg-accent/5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
            Ledger Stash
          </p>
          <p className="text-2xl font-bold text-success">
            ${ledgerStashCost.toLocaleString()}
            <span className="text-sm font-normal text-muted-foreground"> / year</span>
          </p>
        </div>
      </div>

      {annualSavings > 0 && (
        <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 text-center">
          <p className="text-sm font-medium text-muted-foreground mb-1">Your Annual Savings</p>
          <p className="text-3xl font-bold text-primary">
            ${annualSavings.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
