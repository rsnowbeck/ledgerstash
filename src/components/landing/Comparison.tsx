import { Download } from "lucide-react";
import { generateBlueOceanPdf } from "@/lib/generateBlueOceanPdf";
import { ComparisonTable } from "./comparison/ComparisonTable";
import { SuccessTaxCalculator } from "./comparison/SuccessTaxCalculator";

export function Comparison() {
  return (
    <section id="comparison" className="py-24 bg-muted/40">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-[2.25rem] sm:text-[2.5rem] font-bold text-foreground leading-[1.2] mb-4">
            Stop Paying the &ldquo;Success Tax&rdquo;
          </h2>
          <p className="mx-auto max-w-[50rem] text-lg text-muted-foreground font-normal leading-relaxed">
            We built LedgerStash because SmartVault and TaxDome weren&rsquo;t designed for boutique firms.
            Compare the hidden costs of enterprise bloat vs. a system built for your scale.
          </p>
        </div>

        {/* Chart */}
        <ComparisonTable />

        {/* Calculator */}
        <SuccessTaxCalculator />

        {/* PDF Download */}
        <div className="rounded-xl border border-border bg-card p-6 sm:p-8 text-center mt-10 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Want the full audit?
          </h3>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-5">
            Download our Switching Guide to see the line-by-line cost breakdown and the 60-second plan to reclaim your margins.
          </p>
          <button
            onClick={() => generateBlueOceanPdf()}
            className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-colors"
          >
            <Download className="h-5 w-5" />
            Download Free Switching Guide (PDF)
          </button>
          <p className="mt-3 text-xs text-muted-foreground italic">
            No email required. Instant download.
          </p>
        </div>
      </div>
    </section>
  );
}
