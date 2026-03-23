import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageSEO } from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Download } from "lucide-react";
import { generateMigrationGuidePdf } from "@/lib/generateMigrationGuidePdf";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const comparisonRows = [
  { feature: "Starting Price", ledger: "✅ $49/month flat", smart: "❌ $110/month minimum (Accounting Pro, 2-user min)" },
  { feature: "Billing Model", ledger: "✅ Flat per firm", smart: "❌ Per staff seat — annual billing" },
  { feature: "Staff Seat Minimums", ledger: "✅ None — start as a solo", smart: "❌ 2–3 user minimum depending on plan" },
  { feature: "Unlimited Team Members", ledger: "✅ All plans — unlimited at no extra cost", smart: "❌ Per staff seat pricing" },
  { feature: "Seasonal Staff Cost", ledger: "✅ Always included — price never changes", smart: "❌ +$55/staff seat/month" },
  { feature: "Commitment Required", ledger: "✅ None — month to month, cancel anytime", smart: "❌ Annual billing — upfront" },
  { feature: "Pricing Transparency", ledger: "✅ Public — no demo required", smart: "❌ Demo required to purchase" },
  { feature: "Free Trial", ledger: "✅ 14 days — no credit card required", smart: "✅ Available — guided setup required" },
  { feature: "Client Accounts Required", ledger: "✅ No — one-click magic link, no password", smart: "❌ Yes — password-protected portal" },
  { feature: "Context-Aware AI Client Bot (Scout)", ledger: "✅ Scout — conversational, real-time checklist status, 24/7", smart: "⚠️ SmartRequestAI — intake automation, not conversational" },
  { feature: "AI Practice Intelligence Bot (Sage)", ledger: "✅ Sage — queries full portfolio, sends reminders", smart: "—" },
  { feature: "Prior-Year Return Scanning", ledger: "✅ AI scans uploaded 1040 — generates personalized PBC checklist", smart: "✅ SmartRequestAI — scans prior-year return" },
  { feature: "Two-Way Secure Messaging", ledger: "✅ Dedicated thread per client", smart: "❌ No dedicated messaging channel" },
  { feature: "Real-Time Upload Notifications", ledger: "✅ Instant email — toggleable in settings", smart: "❌ Not available" },
  { feature: "E-Signatures", ledger: "✅ Included on all plans", smart: "⚠️ Add-on on most plans — included only on $150/month minimum plan" },
  { feature: "PBC List Management", ledger: "✅ 10 accounting-specific templates", smart: "✅ Accounting-specific folder templates" },
  { feature: "White-Label Branding", ledger: "✅ Logo + firm name — all plans", smart: "✅ Custom branded portal — all plans" },
  { feature: "ESIGN/UETA Audit Trail", ledger: "✅ IP address, timestamp, browser fingerprint", smart: "✅ Activity logs and audit trails" },
  { feature: "Compliance", ledger: "✅ IRS 4557 · FTC Safeguards · GLBA", smart: "✅ SOC 2 Type 2 · IRS 4557 · FTC Safeguards" },
  { feature: "Time to First Client", ledger: "✅ Under 5 minutes — self-serve", smart: "❌ Guided setup required — days to weeks" },
];

const isPositive = (val: string) => val.startsWith("✅");
const isNegative = (val: string) => val.startsWith("❌");
const isWarning = (val: string) => val.startsWith("⚠️");
const isDash = (val: string) => val === "—";

const faqItems = [
  {
    question: "Is Ledger Stash as secure as SmartVault?",
    answer:
      "Yes. AES-256 encryption at rest, TLS 1.3 in transit. Compliant with IRS Publication 4557, FTC Safeguards Rule, and GLBA. Every action — including Scout and Sage AI conversations — generates a full audit trail with IP address, timestamp, and browser fingerprint. SmartVault holds SOC 2 Type 2 — a strong enterprise credential. For solo and boutique firms, Ledger Stash's compliance coverage meets every regulatory requirement you're actually subject to.",
  },
  {
    question: "Does Ledger Stash integrate with tax software like SmartVault does?",
    answer:
      "Not currently. SmartVault's connections to Lacerte, ProConnect, and Drake are genuinely valuable for firms that live in those platforms. If deep tax software integration is your primary requirement, SmartVault is the stronger choice. If you need secure, frictionless document collection with flat pricing and AI-powered client support — Ledger Stash delivers that at a fraction of the cost.",
  },
  {
    question: "SmartVault has SmartRequestAI — what does Ledger Stash have?",
    answer:
      "Ledger Stash has three AI capabilities: Scout (client-side conversational agent that knows each client's specific checklist in real time), Sage (CPA-side practice intelligence agent that queries your entire portfolio and sends reminders), and prior-year return scanning (upload a 1040 and AI generates the personalized PBC checklist automatically). SmartVault's AI handles intake. Ledger Stash AI handles the entire season.",
  },
  {
    question: "How hard is it to switch from SmartVault?",
    answer:
      "Straightforward. Export your client list as CSV, import into Ledger Stash. Download existing documents from SmartVault and upload to your new vaults. Most firms complete the migration in a single afternoon. Your clients receive magic link emails instead of password prompts — most find it easier.",
  },
  {
    question: "Can I add seasonal staff at no extra cost?",
    answer:
      "Yes. All plans include unlimited team members with role-based access. Add preparers in January, remove them in April. Your monthly price never changes.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes. 14 days, full access, no credit card required. No demo call, no guided setup, no waiting.",
  },
];

export default function SmartVaultAlternative() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="SmartVault Alternative for Solo CPAs | Ledger Stash"
        description="SmartVault's accounting plans start at $110/month minimum — solo practitioners pay for a staff seat that doesn't exist. Ledger Stash is $49/month flat with Scout and Sage AI agents, unlimited team members, and setup in under 5 minutes."
        keywords="SmartVault alternative, SmartVault alternatives, SmartVault competitor, SmartVault vs LedgerStash, SmartVault pricing for one user, SmartVault vs TaxDome, secure document exchange for accountants, passwordless client portal for accountants, solo CPA client portal, accounting firm document management"
        canonical="/smartvault-alternative"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-36 lg:pt-44 pb-16 lg:pb-24">
          <div className="container">
            <div className="mx-auto max-w-5xl text-center">
              <h1 className="text-[2.1rem] font-extrabold tracking-tight leading-[1.12] text-foreground sm:text-[3.2rem] lg:text-[3.8rem] mb-5">
                The <span className="text-accent">SmartVault Alternative</span> Built for Solo Practitioners
              </h1>
              <p className="mx-auto max-w-[44rem] text-base text-muted-foreground mb-10">
                SmartVault's accounting plans require a minimum of 2 staff seats — solo practitioners pay for an employee who doesn't exist. Ledger Stash charges $49/month flat for your entire firm, with Scout and Sage AI agents included and no seat minimums.
              </p>
              <Button variant="hero" size="xl" asChild>
                <Link to="/signup" className="gap-2">
                  Start Your Free 14-Day Trial — No Credit Card Required
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* The Core Problem */}
        <section className="py-16 bg-card">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Why Solo CPAs Are Leaving SmartVault
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  SmartVault is a capable, well-built platform. It integrates with Lacerte, ProConnect, UltraTax, Drake, and QuickBooks. Its SmartRequestAI feature generates document request lists from prior-year returns. For mid-size and larger accounting firms with permanent teams, it delivers real value.
                </p>
                <p>
                  But it was never designed with the solo practitioner in mind. And the pricing makes that clear.
                </p>
                <p>
                  SmartVault's Accounting Pro plan costs $55/user/month billed annually, with a 2-user minimum. That means before you've onboarded a single client, you're paying for a staff seat that doesn't exist.
                </p>
                <div className="rounded-xl border border-border bg-muted/30 p-6 my-6">
                  <h3 className="font-semibold text-foreground mb-3">The numbers for a solo practitioner on SmartVault Accounting Pro:</h3>
                  <ul className="space-y-1.5 text-sm">
                    <li>Price: $55/user/month × 2-user minimum</li>
                    <li>Monthly minimum: $110/month</li>
                    <li>Annual minimum: $1,320/year</li>
                    <li>Staff seats you actually need: 1</li>
                    <li>Staff seats you're paying for: 2</li>
                    <li className="text-destructive font-medium">Money spent on a phantom seat annually: $660/year</li>
                  </ul>
                </div>
                <p className="text-foreground font-semibold text-lg">
                  Ledger Stash: $49/month. One price. Your whole firm.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AI Comparison */}
        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Two Different AI Tools for Two Different Jobs
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>SmartVault and Ledger Stash both have AI. They do fundamentally different things.</p>
                <div className="rounded-xl border border-border bg-muted/30 p-6">
                  <h3 className="font-semibold text-foreground mb-2">SmartVault SmartRequestAI</h3>
                  <p className="text-sm">Scans a client's prior-year 1040 and automatically generates a personalized document request list. Saves time at the start of tax season for returning clients. Strong intake automation — particularly valuable for high-volume firms processing hundreds of returns.</p>
                </div>
                <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
                  <h3 className="font-semibold text-foreground mb-2">Ledger Stash — Scout and Sage</h3>
                  <p className="text-sm mb-3"><strong>Scout</strong> is your client-side AI agent. Scout knows exactly which documents each specific client has uploaded and which are still missing from their checklist. When a client asks "what do I still need to send you?" at 10pm, Scout answers with their actual outstanding items — not a generic response. Tax advice is explicitly blocked. Every Scout conversation is logged and reviewable by you.</p>
                  <p className="text-sm mb-3"><strong>Sage</strong> is your practice intelligence agent. Ask Sage "who hasn't uploaded anything in 7 days?" or "which clients are still missing a W-2?" and get a live answer based on your entire portfolio. Sage can send reminders directly from the conversation.</p>
                  <p className="text-sm"><strong>And Ledger Stash also has prior-year return scanning</strong> — upload a client's 1040 and AI generates their personalized PBC checklist automatically, identifying income sources and suggesting exactly what to request.</p>
                </div>
                <p className="text-foreground font-medium">
                  The honest summary: SmartVault automates the start of your workflow. Ledger Stash AI — Scout, Sage, and prior-year scanning — manages the entire season.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-16 bg-muted/40">
          <div className="container">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-12">
              Ledger Stash vs. SmartVault — Feature by Feature
            </h2>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto max-w-4xl mx-auto">
              <table className="w-full border-collapse bg-card rounded-xl shadow-md overflow-hidden">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="px-5 py-4 text-left font-semibold text-sm">Feature</th>
                    <th className="px-5 py-4 text-left font-semibold text-sm">Ledger Stash</th>
                    <th className="px-5 py-4 text-left font-semibold text-sm">SmartVault</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-5 py-4 font-semibold text-foreground text-sm">
                        {row.feature}
                      </td>
                      <td className="px-5 py-4 text-sm font-bold bg-accent/5">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-success" />
                          <span className={isPositive(row.ledger) ? "text-success" : ""}>
                            {row.ledger.replace(/^[✅❌⚠️]\s*/, "")}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        <span
                          className={
                            isNegative(row.smart) ? "text-destructive font-semibold" :
                            isWarning(row.smart) ? "text-amber-600 font-semibold" :
                            isDash(row.smart) ? "text-muted-foreground/50" : ""
                          }
                        >
                          {row.smart}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-muted-foreground mt-3 text-center italic">
                SmartVault Accounting Pro: $55/user/month, 2-user minimum, annual billing. eSignatures are add-on on Business Pro and Accounting Pro plans. Pricing as of 2026.
              </p>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-4 max-w-lg mx-auto">
              {comparisonRows.map((row, i) => (
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
                    <div className="text-muted-foreground p-2">
                      <span className="text-xs block font-medium text-foreground/60">SmartVault</span>
                      <span className={
                        isNegative(row.smart) ? "text-destructive" :
                        isWarning(row.smart) ? "text-amber-600" :
                        isDash(row.smart) ? "text-muted-foreground/50" : ""
                      }>
                        {row.smart}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Where SmartVault Falls Short */}
        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Where SmartVault Doesn't Work for Solo and Boutique Practices
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">The Staff Seat Minimum Problem</h3>
                  <p className="text-sm text-muted-foreground">SmartVault's accounting plans require a minimum number of staff seats regardless of firm size. As a solo practitioner, you pay for a second seat before you've made a single hire. On Accounting Pro that's $660/year in phantom seats. On Business Pro — which requires 3 seats at $50/user — that's $1,200/year before you've used a single feature.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Clients Need Password Accounts</h3>
                  <p className="text-sm text-muted-foreground">SmartVault's client portal requires clients to create an account and remember a password. In practice: password reset requests, phone calls from confused clients, and documents emailed to you anyway because the portal was "too complicated." Ledger Stash clients tap one link from any device and upload instantly — no account, no password, no friction.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Seasonal Staff Costs Full Rate Year-Round</h3>
                  <p className="text-sm text-muted-foreground">If you bring on a seasonal preparer in January, SmartVault charges $55/staff seat/month for that person — billed annually. You pay for 12 months of a seat your seasonal staff occupies for 4. With Ledger Stash, unlimited team members are included on every plan. Add staff in January, remove them in April. Your price never changes.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">No Secure Messaging</h3>
                  <p className="text-sm text-muted-foreground">SmartVault has no dedicated two-way messaging channel between CPA and client. Communication goes back to email. Ledger Stash includes a dedicated message thread per client — separate from documents and tasks.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">No Real-Time Upload Notifications</h3>
                  <p className="text-sm text-muted-foreground">SmartVault does not notify the CPA when a client uploads a document. Ledger Stash sends an immediate email the moment a client uploads — toggleable in settings.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Demo Required to Purchase</h3>
                  <p className="text-sm text-muted-foreground">SmartVault requires a demo or product specialist before you can access the platform. You cannot self-serve into a trial without a sales conversation. Ledger Stash is self-serve — start your free trial right now, no call required.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Real Cost Comparison */}
        <section className="py-16 bg-card">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
                What SmartVault Actually Costs Over 3 Years
              </h2>
              <p className="text-sm text-muted-foreground text-center mb-8">
                Scenario: Solo CPA, 1 permanent staff, adds 2 seasonal staff January–April
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-background rounded-xl shadow-md overflow-hidden">
                  <thead>
                    <tr className="bg-primary text-primary-foreground">
                      <th className="px-5 py-3 text-left font-semibold text-sm"></th>
                      <th className="px-5 py-3 text-left font-semibold text-sm">Ledger Stash</th>
                      <th className="px-5 py-3 text-left font-semibold text-sm">SmartVault Accounting Pro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: "Your permanent seat", ledger: "$49/month flat", smart: "$55/month" },
                      { label: "Minimum seat requirement", ledger: "None", smart: "2-user min = +$55/month phantom seat", smartRed: true },
                      { label: "2 seasonal staff (4 months)", ledger: "Included", smart: "+$110/month × 4 = $440", ledgerGreen: true, smartRed: true },
                      { label: "Annual billing required", ledger: "No", smart: "Yes — upfront", ledgerGreen: true },
                      { label: "Year 1 Total", ledger: "$588", smart: "$1,760+", bold: true, ledgerGreen: true, smartRed: true },
                      { label: "Year 2 Total", ledger: "$588", smart: "$1,760+", bold: true, ledgerGreen: true, smartRed: true },
                      { label: "Year 3 Total", ledger: "$588", smart: "$1,760+", bold: true, ledgerGreen: true, smartRed: true },
                      { label: "3-Year Total", ledger: "$1,764", smart: "$5,280+", bold: true, ledgerGreen: true, smartRed: true },
                      { label: "3-Year Savings", ledger: "—", smart: "$3,516+ with Ledger Stash", ledgerGreen: false, smartRed: false },
                    ].map((row, i) => (
                      <tr key={i} className={`border-b border-border last:border-b-0 ${row.bold ? "bg-muted/30" : ""}`}>
                        <td className={`px-5 py-3 text-sm text-foreground ${row.bold ? "font-bold" : ""}`}>{row.label}</td>
                        <td className={`px-5 py-3 text-sm ${row.ledgerGreen ? "text-success font-bold" : "text-foreground"} ${row.bold ? "font-extrabold text-base" : ""}`}>{row.ledger}</td>
                        <td className={`px-5 py-3 text-sm ${row.smartRed ? "text-destructive font-semibold" : "text-muted-foreground"} ${row.bold ? "font-extrabold text-base" : ""}`}>{row.smart}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground italic mt-4 text-center">
                SmartVault Accounting Pro: $55/user/month, 2-user minimum, annual billing. As of 2026.
              </p>
            </div>
          </div>
        </section>

        {/* Who Should Still Use SmartVault */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-6">Who Should Still Use SmartVault</h2>
              <p className="text-muted-foreground mb-4">SmartVault makes sense if:</p>
              <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                <li>• You run a firm of 5+ permanent staff who use the platform year-round</li>
                <li>• Deep integration with Lacerte, ProConnect, UltraTax, or Drake is essential</li>
                <li>• SmartRequestAI's prior-year return scanning is your primary intake workflow</li>
                <li>• You need unlimited eSignatures, KBA/ID verification, and PDF form fillers</li>
                <li>• You're willing to go through guided onboarding and pay annually upfront</li>
              </ul>
              <p className="text-muted-foreground mb-4">If that's your firm — SmartVault is a serious, well-built product.</p>
              <p className="text-foreground font-medium">But if you're a solo practitioner or small boutique firm who needs a clean, affordable vault with flat pricing and AI that handles the entire season — Ledger Stash was built for you.</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-10">
                Frequently Asked Questions
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left text-foreground font-medium">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Migration Guide Download */}
        <section className="py-16 bg-muted/40">
          <div className="container">
            <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-8 sm:p-10 text-center shadow-md">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent mb-4">
                <Download className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Worried about the move?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Download our <strong>60-Second Migration Guide</strong> to see how we handle the heavy lifting for you.
              </p>
              <Button
                variant="outline"
                size="lg"
                className="gap-2"
                onClick={() => generateMigrationGuidePdf("SmartVault")}
              >
                <Download className="h-4 w-4" />
                Download Migration Guide (PDF)
              </Button>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-card">
          <div className="container text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Set Up in 5 Minutes. Cancel Anytime. No Annual Commitment.
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              14-day free trial. No credit card required.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/signup" className="gap-2">
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
