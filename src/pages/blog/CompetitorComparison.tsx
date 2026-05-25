import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageSEO } from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";

function useBlogSchema() {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "TaxDome vs. SmartVault vs. Ledger Stash: Which Is Right for Your Firm?",
      description:
        "An honest comparison of TaxDome, SmartVault, and Ledger Stash — pricing, features, and which platform is right for solo CPAs and boutique firms.",
      author: { "@type": "Organization", name: "Ledger Stash" },
      publisher: { "@type": "Organization", name: "Ledger Stash", url: "https://ledgerstash.com" },
      datePublished: "2026-01-22",
      mainEntityOfPage: "https://ledgerstash.com/blog/taxdome-vs-smartvault-vs-ledger-stash",
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-blog-schema", "true");
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    return () => {
      const el = document.querySelector("script[data-blog-schema]");
      if (el) el.remove();
    };
  }, []);
}

export default function CompetitorComparison() {
  useBlogSchema();
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="TaxDome vs SmartVault vs Ledger Stash (2026 Comparison)"
        description="Comparing TaxDome, SmartVault, and Ledger Stash for solo CPAs and boutique firms. Honest breakdown of pricing, features, and which platform is right for your practice."
        keywords="TaxDome vs SmartVault, TaxDome alternative, SmartVault alternative, best CPA client portal 2026, accounting document vault comparison, ledger stash vs taxdome"
        canonical="/blog/taxdome-vs-smartvault-vs-ledger-stash"
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="py-16 bg-gradient-to-b from-muted/40 to-background">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-4">
                Platform Comparison
              </p>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-6 leading-tight">
                TaxDome vs. SmartVault vs. Ledger Stash: Which Is Right for Your Firm?
              </h1>
              <p className="text-muted-foreground text-sm">Published January 22, 2026 · 8 min read</p>
            </div>
          </div>
        </section>

        {/* Article Body */}
        <section className="py-12">
          <div className="container">
            <div className="max-w-3xl mx-auto space-y-6 text-muted-foreground leading-relaxed">

              <p className="text-base">
                If you are an accounting firm owner looking to securely collect documents from clients, you have likely narrowed your choices down to a few major players. TaxDome and SmartVault are two of the biggest names in the industry. Ledger Stash is the newer, specialized alternative. But comparing them feature-by-feature can be exhausting. Software companies love to hide their true costs behind "Contact Us" buttons and complex tier structures.
              </p>
              <p className="text-base">
                In this guide, we will break down exactly what each platform does best, where they fall short, and how much they actually cost — so you can choose the right tool for your firm.
              </p>

              {/* Summary Box */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm my-8">
                <h3 className="text-lg font-bold text-foreground mb-4">The Short Version</h3>
                <ul className="space-y-3 text-sm">
                  <li><strong className="text-foreground">Choose TaxDome if:</strong> You are a mid-to-large firm that wants an all-in-one practice management suite and you are willing to pay ~$800 per seat, billed annually upfront.</li>
                  <li><strong className="text-foreground">Choose SmartVault if:</strong> You are a mid-size firm that needs deep integration with Lacerte or ProConnect, and you don't mind paying $55/user/month with a strict 2-user minimum.</li>
                  <li><strong className="text-foreground">Choose Ledger Stash if:</strong> You are a solo CPA or boutique firm that wants a highly secure, frictionless way to collect documents with Magic Links and AI automation, without paying per-seat "Success Taxes" for your seasonal staff.</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">TaxDome: The Enterprise Heavyweight</h2>
              <p className="text-base">
                TaxDome is a massive, capable platform. It is not just a document portal; it is a complete practice management suite. If you want to run your entire firm out of one piece of software, TaxDome is a strong contender. It handles CRM, invoicing, payment processing, time tracking, scheduling, and complex workflow automation.
              </p>
              <p className="text-base">
                <strong className="text-foreground">Where it struggles:</strong> Complexity and cost. The most common complaint about TaxDome on review sites like G2 is the setup time — users consistently report 6 to 8 weeks to get the platform configured. Furthermore, TaxDome charges per seat and bills for the full year upfront. If you hire two seasonal preparers for tax season, you pay for 12 months of access for those two seats, even though they will only be used for four months.
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">SmartVault: The Legacy Integration Play</h2>
              <p className="text-base">
                SmartVault has been around for a long time and has built a solid reputation as a secure document storage solution, particularly for firms that use Intuit products. Its integration with Lacerte, ProConnect, and QuickBooks is genuinely valuable for firms that live in those platforms.
              </p>
              <p className="text-base">
                <strong className="text-foreground">Where it struggles:</strong> The pricing model is hostile to solo practitioners. SmartVault's Accounting Pro plan costs $55/user/month with a strict 2-user minimum — meaning a solo CPA pays $1,320 a year, effectively paying for a phantom seat they do not need. Additionally, SmartVault requires clients to create accounts and remember passwords, which remains the number one source of friction in document collection.
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">Ledger Stash: The Boutique Specialist</h2>
              <p className="text-base">
                Ledger Stash was built specifically for solo CPAs, boutique firms, and fractional CFOs who need secure document collection without the enterprise bloat. It eliminates friction on both sides of the desk: Magic Links for clients (no passwords), and flat per-client pricing for the firm (no per-seat charges).
              </p>
              <p className="text-base">
                Every plan includes two context-aware AI agents: Scout (client-facing, answers document questions 24/7) and Sage (practice-facing, queries your entire portfolio). Neither competitor offers anything comparable.
              </p>
              <p className="text-base">
                <strong className="text-foreground">Where it falls short:</strong> Ledger Stash is not a practice management suite. It does not do invoicing, time tracking, or CRM pipelines. If you want one piece of software to run every single aspect of your business, Ledger Stash is not the right fit.
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">The 3-Year Cost Comparison</h2>
              <p className="text-base">
                For a solo CPA who hires one seasonal preparer from January to April:
              </p>
              <div className="overflow-x-auto my-6">
                <table className="w-full text-sm border-collapse border border-border rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-muted">
                      <th className="text-left py-3 px-4 text-foreground font-semibold border-b border-border">Platform</th>
                      <th className="text-center py-3 px-4 text-foreground font-semibold border-b border-border">Annual Cost</th>
                      <th className="text-center py-3 px-4 text-foreground font-semibold border-b border-border">3-Year Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-foreground">SmartVault (2-user minimum)</td>
                      <td className="py-3 px-4 text-center text-muted-foreground">$1,320</td>
                      <td className="py-3 px-4 text-center text-muted-foreground">$3,960</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-foreground">TaxDome (2 seats, annual billing)</td>
                      <td className="py-3 px-4 text-center text-muted-foreground">$1,600</td>
                      <td className="py-3 px-4 text-center text-muted-foreground">$4,800</td>
                    </tr>
                    <tr className="bg-primary/5">
                      <td className="py-3 px-4 text-primary font-bold">Ledger Stash Solo (unlimited seats)</td>
                      <td className="py-3 px-4 text-center text-primary font-bold">$588</td>
                      <td className="py-3 px-4 text-center text-primary font-bold">$1,764</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">The Verdict</h2>
              <p className="text-base">
                If you need a massive, all-in-one suite to run a 20-person firm, and you have the budget and time to implement it, look closely at TaxDome. If you are a solo practitioner or boutique firm owner who wants to stop chasing documents, stop paying for phantom seats, and give your clients a portal they will actually use — Ledger Stash is the clear winner.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-muted/30 border-t border-border">
          <div className="container">
            <div className="max-w-3xl mx-auto rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
              <h3 className="text-xl font-bold text-foreground mb-3">
                Ready to Stop Paying the Success Tax?
              </h3>
              <p className="text-muted-foreground mb-6">
                14-day free trial. No credit card required. Set up your first client in under 5 minutes.
              </p>
              <Button variant="hero" size="lg" asChild>
                <Link to="/signup" className="gap-2">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
