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
  { feature: "Starting Price", ledger: "✅ $49/month flat", competitor: "❌ ~$800/seat/year — full year billed upfront" },
  { feature: "Billing Model", ledger: "✅ Flat per firm — one price", competitor: "❌ Per seat — full year upfront, no refunds" },
  { feature: "Staff Seat Minimums", ledger: "✅ None — start as a solo", competitor: "❌ Per seat — scales with team size" },
  { feature: "Unlimited Team Members", ledger: "✅ All plans — unlimited at no extra cost", competitor: "❌ Per seat — annual upfront per person" },
  { feature: "Seasonal Staff Cost", ledger: "✅ Always included — price never changes", competitor: "❌ Full year billed upfront per seat" },
  { feature: "Commitment Required", ledger: "✅ None — month to month, cancel anytime", competitor: "❌ Full year billed upfront — no refunds, no cancellation" },
  { feature: "Pricing Transparency", ledger: "✅ Public — no demo required", competitor: "✅ Public pricing" },
  { feature: "Free Trial", ledger: "✅ 14 days — no credit card required", competitor: "✅ Available" },
  { feature: "Client Accounts Required", ledger: "✅ No — one-click magic link", competitor: "❌ Yes — client login required" },
  { feature: "Context-Aware AI Client Bot (Scout)", ledger: "✅ Scout — conversational, real-time checklist status, 24/7", competitor: "—" },
  { feature: "AI Practice Intelligence Bot (Sage)", ledger: "✅ Sage — queries full portfolio, sends reminders", competitor: "—" },
  { feature: "Prior-Year Return Scanning", ledger: "✅ AI scans uploaded 1040 — generates personalized PBC checklist", competitor: "—" },
  { feature: "Two-Way Secure Messaging", ledger: "✅ Dedicated thread per client — included", competitor: "✅ Included — per seat pricing" },
  { feature: "Real-Time Upload Notifications", ledger: "✅ Instant email — toggleable in settings", competitor: "✅ Available" },
  { feature: "Mobile Experience", ledger: "✅ Mobile-first (React) — no download required", competitor: "✅ Native iOS/Android app" },
  { feature: "PBC List Management", ledger: "✅ 10 accounting-specific templates", competitor: "⚠️ Generic file requests — not PBC-specific terminology" },
  { feature: "White-Label Branding", ledger: "✅ Logo + firm name — all plans", competitor: "✅ Portal branding — paid tiers" },
  { feature: "E-Signatures", ledger: "✅ Included on all plans", competitor: "✅ Included" },
  { feature: "ESIGN/UETA Audit Trail", ledger: "✅ IP address, timestamp, browser fingerprint", competitor: "✅ Built-in eSign logs" },
  { feature: "Compliance", ledger: "✅ IRS 4557 · FTC Safeguards · GLBA", competitor: "⚠️ General security practices" },
  { feature: "Workflow Automation", ledger: "✅ Busy season auto-reminders — per client schedule", competitor: "✅ Full pipeline automation — custom workflows" },
  { feature: "CRM / Invoicing", ledger: "— Not a practice management suite", competitor: "✅ Full suite — CRM, invoicing, payment processing" },
  { feature: "Time to First Client", ledger: "✅ Under 5 minutes — self-serve", competitor: "❌ 6–8 weeks onboarding" },
];

const isPositive = (val: string) => val.startsWith("✅");
const isNegative = (val: string) => val.startsWith("❌");
const isWarning = (val: string) => val.startsWith("⚠️");
const isDash = (val: string) => val === "—" || val.startsWith("—");

const faqItems = [
  {
    question: "Does Ledger Stash have workflow automation like TaxDome?",
    answer:
      "Ledger Stash includes automated reminders with configurable schedules — per client or org-wide — so missing documents get chased automatically. We don't offer TaxDome's full pipeline automation. If custom workflow automation is central to how your firm operates, TaxDome's pipelines are genuinely powerful. If you need document collection, engagement letter tracking, and automated reminders — Ledger Stash does all of that in minutes.",
  },
  {
    question: "What about the AI? Does TaxDome have anything similar to Scout and Sage?",
    answer:
      "No. TaxDome does not have Scout (client-side AI that knows each client's specific checklist) or Sage (CPA-side portfolio intelligence that queries your entire book and sends reminders). TaxDome also doesn't have prior-year return scanning. All three AI features are Ledger Stash exclusives included on every plan.",
  },
  {
    question: "Can I switch from TaxDome mid-contract?",
    answer:
      "You can start your Ledger Stash trial anytime and run clients through it immediately. Many firms run both in parallel during a transition — using Ledger Stash for new clients while existing clients remain on TaxDome until the contract expires. When your TaxDome term ends, you've already proven Ledger Stash works.",
  },
  {
    question: "What about TaxDome's mobile app?",
    answer:
      "TaxDome has a well-reviewed mobile app. Ledger Stash is built mobile-first — the entire platform is optimized for mobile on both the CPA and client side. Clients don't need to download anything — they tap a magic link from any device and upload instantly.",
  },
  {
    question: "Does Ledger Stash have invoicing and payment processing?",
    answer:
      "Not currently. Ledger Stash is purpose-built for secure document collection, PBC management, and engagement letter tracking. If invoicing inside your practice management platform is a requirement, TaxDome covers that comprehensively.",
  },
  {
    question: "Can I add seasonal staff at no extra cost?",
    answer:
      "Yes. Every plan includes unlimited team members with role-based access. Add preparers in January, remove them in April. Your monthly price never changes.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes. 14 days, full access, no credit card required.",
  },
];

export default function TaxDomeAlternative() {
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
        title="TaxDome Alternative for Small Accounting Firms | Ledger Stash"
        description="TaxDome charges ~$800/seat billed upfront annually with 6–8 weeks of onboarding. Ledger Stash is $49/month flat with Scout and Sage AI agents, month to month, setup in under 5 minutes."
        keywords="TaxDome alternative, TaxDome alternatives, TaxDome competitor, TaxDome vs LedgerStash, TaxDome pricing per user, simple client portal for tax pros, TaxDome alternative for solo firms, solo CPA client portal, accounting firm document management, practice management alternative"
        canonical="/taxdome-alternative"
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
                The <span className="text-accent">TaxDome Alternative</span> for Firms That Don't Need a Practice Management Suite
              </h1>
              <p className="mx-auto max-w-[44rem] text-base text-muted-foreground mb-10">
                TaxDome is powerful — and priced to match. ~$800/seat billed upfront annually, 6–8 weeks of onboarding, and seasonal staff costs locked in for 12 months. Ledger Stash is $49/month flat, set up in under 5 minutes, with Scout and Sage AI agents included on every plan.
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

        {/* Honest Positioning */}
        <section className="py-16 bg-card">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                TaxDome Is a Great Product — For the Right Firm
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  TaxDome is one of the most capable platforms in the accounting software market. Workflow automation, CRM, invoicing, payment processing, client portal, e-signatures, time tracking — it's all there. For a mid-size firm processing hundreds of returns with a team that lives in the platform year-round, TaxDome delivers real value.
                </p>
                <p>
                  But that power comes with a price — and not just a monetary one.
                </p>
                <p>
                  TaxDome charges per seat, billed for the full year upfront. You commit financially before you've confirmed the software works for your firm. Add seasonal staff in January and you're locked into paying for those seats through December — even if you only need them for 4 months. Reviewers consistently describe the setup as weeks-long.
                </p>
                <p>
                  For a solo CPA or boutique firm that needs secure document collection, PBC lists, and engagement letter tracking — you're paying for a full practice management suite at enterprise pricing, upfront, on an annual contract you can't exit.
                </p>
                <p className="text-foreground font-semibold text-lg pt-2">
                  Ledger Stash does the specific job exceptionally well — at a flat monthly rate you can cancel anytime, with Scout and Sage AI agents no competitor offers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Meet Scout and Sage */}
        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                The AI Advantage TaxDome Doesn't Have
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>TaxDome does not include AI agents. Ledger Stash includes two purpose-built AI agents on every plan.</p>
                <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
                  <h3 className="font-semibold text-foreground mb-2">Scout — Client Assistant</h3>
                  <p className="text-sm">Scout knows exactly which documents each specific client has uploaded and which are still missing. When a client asks "what do I still need to send you?" at 10pm, Scout answers with their actual outstanding items by name. Tax advice is explicitly blocked. Every Scout conversation is logged and reviewable by you.</p>
                </div>
                <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
                  <h3 className="font-semibold text-foreground mb-2">Sage — Practice Intelligence Agent</h3>
                  <p className="text-sm">Ask Sage "who hasn't uploaded anything in 7 days?" or "which clients are still missing a W-2 across my entire book?" and get live answers based on your portfolio data. Sage can send reminders directly from the conversation — no manual dashboard scanning during busy season.</p>
                </div>
                <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
                  <h3 className="font-semibold text-foreground mb-2">Prior-Year Return Scanning</h3>
                  <p className="text-sm">Upload a client's prior-year 1040 and AI automatically generates their personalized PBC checklist — identifying income sources like W-2s, 1099s, Schedule C, K-1s, and rentals. Review, edit, and send in seconds. TaxDome doesn't have this.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-16 bg-muted/40">
          <div className="container">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-12">
              Ledger Stash vs. TaxDome — Feature by Feature
            </h2>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto max-w-4xl mx-auto">
              <table className="w-full border-collapse bg-card rounded-xl shadow-md overflow-hidden">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="px-5 py-4 text-left font-semibold text-sm">Feature</th>
                    <th className="px-5 py-4 text-left font-semibold text-sm">Ledger Stash</th>
                    <th className="px-5 py-4 text-left font-semibold text-sm">TaxDome</th>
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
                            isNegative(row.competitor) ? "text-destructive font-semibold" :
                            isWarning(row.competitor) ? "text-amber-600 font-semibold" :
                            isDash(row.competitor) ? "text-muted-foreground/50" : ""
                          }
                        >
                          {row.competitor}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-muted-foreground mt-3 text-center italic">
                TaxDome pricing based on publicly available information as of 2026. Annual billing upfront — no refunds.
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
                      <span className="text-xs block font-medium text-foreground/60">TaxDome</span>
                      <span className={
                        isNegative(row.competitor) ? "text-destructive" :
                        isWarning(row.competitor) ? "text-amber-600" :
                        isDash(row.competitor) ? "text-muted-foreground/50" : ""
                      }>
                        {row.competitor}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Where TaxDome Falls Short */}
        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                The Real Problems With TaxDome for Solo Practitioners and Small Firms
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">You Pay the Full Year Before You're Operational</h3>
                  <p className="text-sm text-muted-foreground">TaxDome bills annually, upfront. You commit to a full year of cost before you've completed onboarding, before your first client has uploaded a document, and before you know whether the platform fits your workflow. Reviewers on G2 and Capterra consistently describe the setup period as weeks-long. You're paying for a tool you're not yet using. With Ledger Stash, you're operational in under 5 minutes and pay month to month. If it doesn't work, you cancel. No sunk cost.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Seasonal Staff Becomes a Year-Long Expense</h3>
                  <p className="text-sm text-muted-foreground">Tax season runs January through April. Many firms bring on 2–5 additional staff and let them go when it's over. On TaxDome, each seasonal seat costs the full annual rate — regardless of how many months they actually work. Three seasonal preparers at $800/seat isn't 4 months of access. It's $2,400 upfront for 12 months of seats those people will vacate in April. With Ledger Stash, unlimited team members are included on every plan. Add preparers in January, remove them in April. Your price never changes.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">No AI Agents</h3>
                  <p className="text-sm text-muted-foreground">TaxDome has no Scout, no Sage, no prior-year return scanning. When your client asks "what do I still need to send?" at 10pm — they email you. When you need to know which clients are behind — you scan the dashboard manually. Ledger Stash's AI handles both — automatically.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">The Learning Curve Is Real and Documented</h3>
                  <p className="text-sm text-muted-foreground">TaxDome's most consistent criticism across G2 and Capterra is setup complexity. Reviewers describe weeks of configuration before the platform is operational. Once set up, users love it. But for a solo CPA heading into busy season who needs to be operational this week — that investment is time you don't have.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">You're Paying for Features You Won't Use</h3>
                  <p className="text-sm text-muted-foreground">TaxDome includes CRM, invoicing, payment processing, time tracking, scheduling, and more. Genuinely useful for the right firm. But if you need document collection, PBC lists, and engagement letter tracking — you're paying for a full practice management suite when you need a smart, affordable vault.</p>
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
                What TaxDome Actually Costs a Solo CPA With Seasonal Staff
              </h2>
              <p className="text-sm text-muted-foreground text-center mb-8">
                Scenario: Solo CPA, adds 3 seasonal staff January–April
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-background rounded-xl shadow-md overflow-hidden">
                  <thead>
                    <tr className="bg-primary text-primary-foreground">
                      <th className="px-5 py-3 text-left font-semibold text-sm"></th>
                      <th className="px-5 py-3 text-left font-semibold text-sm">Ledger Stash</th>
                      <th className="px-5 py-3 text-left font-semibold text-sm">TaxDome</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: "Your permanent seat", ledger: "$49/month flat", td: "$800/year — upfront" },
                      { label: "3 seasonal staff", ledger: "Included", td: "$2,400/year — upfront in January", ledgerGreen: true, tdRed: true },
                      { label: "Total Year 1", ledger: "$588", td: "$3,200 — paid upfront", bold: true, ledgerGreen: true, tdRed: true },
                      { label: "Total Year 2", ledger: "$588", td: "$3,200", bold: true, ledgerGreen: true, tdRed: true },
                      { label: "Total Year 3", ledger: "$588", td: "$3,200", bold: true, ledgerGreen: true, tdRed: true },
                      { label: "3-Year Total", ledger: "$1,764", td: "$9,600", bold: true, ledgerGreen: true, tdRed: true },
                      { label: "3-Year Savings", ledger: "—", td: "$7,836 with Ledger Stash", ledgerGreen: false, tdRed: false },
                    ].map((row, i) => (
                      <tr key={i} className={`border-b border-border last:border-b-0 ${row.bold ? "bg-muted/30" : ""}`}>
                        <td className={`px-5 py-3 text-sm text-foreground ${row.bold ? "font-bold" : ""}`}>{row.label}</td>
                        <td className={`px-5 py-3 text-sm ${row.ledgerGreen ? "text-success font-bold" : "text-foreground"} ${row.bold ? "font-extrabold text-base" : ""}`}>{row.ledger}</td>
                        <td className={`px-5 py-3 text-sm ${row.tdRed ? "text-destructive font-semibold" : "text-muted-foreground"} ${row.bold ? "font-extrabold text-base" : ""}`}>{row.td}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground italic mt-4 text-center">
                TaxDome pricing based on publicly available information as of 2026. Annual billing upfront — no refunds.
              </p>
            </div>
          </div>
        </section>

        {/* Who Should Still Use TaxDome */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-6">Who Should Still Use TaxDome</h2>
              <p className="text-muted-foreground mb-4">TaxDome makes sense if:</p>
              <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                <li>• You run a firm of 5+ people who use the platform year-round</li>
                <li>• Full workflow automation with custom pipelines is a priority</li>
                <li>• Invoicing, payment processing, and CRM in one platform is essential</li>
                <li>• You're willing to invest 6–8 weeks in setup</li>
                <li>• Your volume justifies the annual upfront cost per seat</li>
              </ul>
              <p className="text-muted-foreground mb-4">If that's your firm — TaxDome is a serious, capable product and we'd recommend it.</p>
              <p className="text-foreground font-medium">But if you're a solo practitioner, a 2–3 person boutique firm, or anyone who needs to be operational this week — Ledger Stash was built for you.</p>
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
                onClick={() => generateMigrationGuidePdf("TaxDome")}
              >
                <Download className="h-4 w-4" />
                Download Migration Guide (PDF)
              </Button>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
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
