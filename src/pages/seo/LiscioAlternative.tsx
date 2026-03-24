import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageSEO } from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, AlertTriangle, Bot, DollarSign, Users, Eye, Search, BrainCircuit, ScanLine } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const comparisonRows = [
  { feature: "Starting Price", ledger: "✅ $49/month flat", liscio: "❌ $49/user/month + usage overages" },
  { feature: "Billing Model", ledger: "✅ Flat per firm — one price", liscio: "❌ Per user + per action (gatherings, deliveries, signatures)" },
  { feature: "Tax Gatherings", ledger: "✅ Included — unlimited", liscio: "❌ Usage-billed beyond base limit" },
  { feature: "Tax Deliveries", ledger: "✅ Included — unlimited", liscio: "❌ Usage-billed beyond base limit" },
  { feature: "E-Signatures", ledger: "✅ Included on all plans", liscio: "❌ Usage-billed beyond base limit" },
  { feature: "Seasonal Staff Cost", ledger: "✅ Always included — price never changes", liscio: "❌ +$49/user/month per person" },
  { feature: "Staff Seat Minimums", ledger: "✅ None", liscio: "❌ Per user — every addition increases bill" },
  { feature: "Commitment Required", ledger: "✅ None — month to month, cancel anytime", liscio: "❌ Annual — monthly rate requires demo call" },
  { feature: "Pricing Transparency", ledger: "✅ Public — no demo required", liscio: "❌ Monthly rate requires demo call" },
  { feature: "Free Trial", ledger: "✅ 14 days — no credit card required", liscio: "❌ No free trial — demo required to start" },
  { feature: "Client Accounts Required", ledger: "✅ No — one-click magic link", liscio: "❌ Yes — account and app required" },
  { feature: "Client Access Method", ledger: "✅ One-click magic link — any device, no download", liscio: "❌ Password login or mobile app download" },
  { feature: "Context-Aware AI Client Agent (Scout)", ledger: "✅ Scout — knows each client's specific checklist, conversational, 24/7", liscio: "—" },
  { feature: "AI Practice Intelligence Agent (Sage)", ledger: "✅ Sage — queries full portfolio, surfaces at-risk clients, sends reminders", liscio: "—" },
  { feature: "AI Conversation Audit Trail", ledger: "✅ Full log — CPA-reviewable per client", liscio: "—" },
  { feature: "Prior-Year Return Scanning", ledger: "✅ AI scans uploaded 1040 — generates personalized PBC checklist", liscio: "—" },
  { feature: "Two-Way Secure Messaging", ledger: "✅ Dedicated thread per client — included", liscio: "✅ Core feature — per user pricing" },
  { feature: "Real-Time Upload Notifications", ledger: "✅ Instant email — toggleable in settings", liscio: "✅ Via mobile app" },
  { feature: "Per-Client Reminder Schedule", ledger: "✅ 1–30 days — per client override", liscio: "✅ Configurable" },
  { feature: "Mobile Experience", ledger: "✅ Mobile-first (React) — no download required", liscio: "✅ Native iOS/Android app" },
  { feature: "PBC List Management", ledger: "✅ 10 accounting-specific templates", liscio: "⚠️ Generic tasks — not PBC-specific terminology" },
  { feature: "Document Preview", ledger: "✅ Inline preview", liscio: "✅ Available" },
  { feature: "White-Label Branding", ledger: "✅ Logo + firm name — all plans", liscio: "✅ Custom branding — paid tiers" },
  { feature: "ESIGN/UETA Audit Trail", ledger: "✅ IP address, timestamp, browser fingerprint", liscio: "⚠️ Basic audit trail" },
  { feature: "Compliance", ledger: "✅ IRS 4557 · FTC Safeguards · GLBA", liscio: "⚠️ General security practices" },
  { feature: "Unlimited Team Members", ledger: "✅ All plans — unlimited at no extra cost", liscio: "❌ Per user — every team member adds to bill" },
  { feature: "Time to First Client", ledger: "✅ Under 5 minutes — self-serve", liscio: "❌ Demo required to start" },
];

const isPositive = (val: string) => val.startsWith("✅");
const isNegative = (val: string) => val.startsWith("❌");
const isWarning = (val: string) => val.startsWith("⚠️");
const isDash = (val: string) => val === "—";

const costRows = [
  { component: "Base (1 user, 12 months)", ledger: "$588/year", liscio: "$588/year ($49 × 12)" },
  { component: "1 seasonal preparer (4 months)", ledger: "Included", liscio: "+$196 (4 × $49)", ledgerGreen: true, liscioRed: true },
  { component: "80 tax gatherings", ledger: "Included", liscio: "Overage charges apply", ledgerGreen: true, liscioRed: true },
  { component: "80 tax deliveries", ledger: "Included", liscio: "Overage charges apply", ledgerGreen: true, liscioRed: true },
  { component: "E-signatures (80+ returns)", ledger: "Included", liscio: "Overage charges apply", ledgerGreen: true, liscioRed: true },
  { component: "Scout + Sage AI agents", ledger: "Included", liscio: "Not available", ledgerGreen: true, liscioRed: true },
  { component: "Prior-year return scanning", ledger: "Included", liscio: "Not available", ledgerGreen: true, liscioRed: true },
  { component: "Estimated annual total", ledger: "$588", liscio: "$1,200–2,400+ estimated", ledgerGreen: true, liscioRed: true, bold: true },
];

const gapCards = [
  {
    icon: DollarSign,
    title: "Per-User Pricing Punishes Every Addition",
    description: "Every seasonal preparer, part-time bookkeeper, or shared admin represents a direct monthly cost increase. You end up making software access decisions based on cost during the season when you should be focused on clients. Ledger Stash includes unlimited team members on every plan.",
  },
  {
    icon: AlertTriangle,
    title: "Usage Fees on the Three Things You Do Most",
    description: "The more effectively you use Liscio during tax season — more gatherings, more deliveries, more signatures — the more you pay. This is a structural pricing problem. Ledger Stash includes all three in your flat monthly fee.",
  },
  {
    icon: Bot,
    title: "No AI Agents — On Either Side",
    description: "Liscio does not include Scout, Sage, or prior-year return scanning. When your client asks \"what do I still need to send?\" — they email you. When you need to know which clients are behind — you check manually. Ledger Stash's AI agents handle both automatically, all season long.",
  },
  {
    icon: Users,
    title: "Clients Need Accounts",
    description: "Liscio requires clients to create an account and use a mobile app or web login. For the client who doesn't want to download another app — it's a barrier that sends them back to email. Ledger Stash's magic link requires nothing. Tap. Upload. Done.",
  },
  {
    icon: Eye,
    title: "No Free Trial — Demo Required to Start",
    description: "Liscio offers no public free trial. To evaluate the platform you book a demo, go through a sales conversation, and wait for access. Ledger Stash: click Start Free Trial, enter your email, set up your first client. No call required.",
  },
];

const faqItems = [
  {
    q: "Is Ledger Stash's security comparable to Liscio?",
    a: "Yes. AES-256 encryption at rest, TLS 1.3 in transit, compliant with IRS Publication 4557, FTC Safeguards Rule, and GLBA. Full ESIGN/UETA audit trails with IP address, timestamp, and browser fingerprint — including Scout and Sage AI agent conversations. Ledger Stash matches every regulatory requirement relevant to CPA firms.",
  },
  {
    q: "My clients are used to Liscio's app. Will magic links work for them?",
    a: "Almost certainly better. Magic links have zero friction — your client receives a branded email, taps one link, and uploads from their phone browser without downloading anything. The clients most likely to struggle with a new app are the same clients most likely to appreciate not needing one.",
  },
  {
    q: "Does Ledger Stash have Liscio's email integration?",
    a: "Not currently. Liscio integrates Gmail and Outlook into the platform. Ledger Stash focuses specifically on the document collection and vault workflow. If email-inside-the-portal is a core requirement for your team today, that's worth knowing before you switch.",
  },
  {
    q: "What about Liscio's messaging features?",
    a: "Ledger Stash includes a dedicated two-way message thread per client — separate from documents and tasks. Accessible to the CPA on the Client Detail page and to the client in their portal. Liscio's messaging is more mature and built for team-based communication. If multi-staff messaging is central to your workflow, Liscio has a more developed feature. If you need clean one-to-one client communication — Ledger Stash delivers that.",
  },
  {
    q: "Liscio doesn't have Scout or Sage — does that matter?",
    a: "It depends on your workflow. If your biggest busy season pain is chasing clients for documents and manually tracking who's behind — Scout and Sage solve that directly. Scout answers client questions about their specific checklist 24/7. Sage tells you exactly who needs attention across your entire book and can send reminders without you lifting a finger. Liscio has no equivalent.",
  },
  {
    q: "Can I add seasonal staff at no extra cost?",
    a: "Yes. Every plan includes unlimited team members with role-based access. Add preparers in January, remove them in April. Your monthly price never changes.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes. 14 days, full access, no credit card required. No demo call. No sales conversation. Start right now.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function LiscioAlternative() {
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Liscio Alternative for Solo CPAs | Ledger Stash"
        description="Liscio charges per user plus usage fees on tax gatherings, deliveries, and e-signatures — and requires a demo just to see monthly pricing. Ledger Stash is $49/month flat with Scout and Sage AI agents included. No demo required."
        keywords="Liscio alternative, Liscio competitor, Liscio alternative CPA, Liscio pricing, cheaper alternative to Liscio, client portal for accountants"
        canonical="/liscio-alternative"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Header />
      <main>
        {/* SECTION 1 — Hero */}
        <section className="pt-28 lg:pt-40 pb-16 lg:pb-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-6">
                The <span className="text-accent">Liscio Alternative</span> With Flat Pricing, No Usage Fees, and Built-In AI Agents
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Liscio charges per user, then bills separately for the actions you perform most — tax gatherings, deliveries, and e-signatures. Their monthly pricing requires a demo call to see. Ledger Stash publishes its pricing publicly, charges one flat rate for your entire firm, and includes Scout and Sage AI agents that no competitor offers. Start a free trial right now — no call required.
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

        {/* SECTION 2 — The Core Problem */}
        <section className="py-16 bg-card">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Liscio's Pricing Model Is Built to Grow Your Bill — Not Your Firm
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Liscio is a well-built platform. Its mobile app is strong, its messaging features are well-reviewed, and its focus on client communication is real. For larger firms where team communication is as important as document collection, Liscio delivers.
                </p>
                <p>
                  But its pricing model has a fundamental problem for solo practitioners and small firms: <strong className="text-foreground">every asterisk is a hidden bill.</strong>
                </p>
                <p>
                  Liscio's Tax Solo plan starts at $49/user/month. That's already per-user — the moment you add a seasonal preparer or part-time reviewer, your cost increases. But the per-user fee is just the floor. On top of that, Liscio bills separately for:
                </p>
                <ul className="space-y-2 pl-4">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive mt-1 shrink-0" />
                    <span><strong className="text-foreground">Tax gatherings</strong> — each time you send a document request</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive mt-1 shrink-0" />
                    <span><strong className="text-foreground">Tax deliveries</strong> — each time you deliver a completed return</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive mt-1 shrink-0" />
                    <span><strong className="text-foreground">E-signatures</strong> — each signature request you send</span>
                  </li>
                </ul>
                <p>
                  A solo CPA handling 80 returns isn't paying $49/month. They're paying $49 plus overages on 80 gatherings, 80 deliveries, and however many signatures their returns require. The real cost requires a demo call to calculate — because Liscio doesn't publish it.
                </p>
                <p className="text-foreground font-semibold text-lg pt-2">
                  Ledger Stash publishes pricing on this page, right now. $49/month. Your whole firm. No usage limits on the actions you perform every day.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3 — Pricing Transparency */}
        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <div className="rounded-xl border-2 border-destructive/30 bg-destructive/5 p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Why Does Liscio Require a Demo Just to See Monthly Pricing?
                </h2>
                <p className="text-muted-foreground mb-4">
                  On Liscio's pricing page, monthly billing is listed as "contact us." You cannot calculate your real cost or start a trial without booking a call with their sales team first.
                </p>
                <p className="text-muted-foreground mb-4">
                  Companies that hide monthly pricing behind demo calls do so because the number is harder to justify without a salesperson walking you through the value story.
                </p>
                <p className="text-foreground font-medium">
                  Ledger Stash disagrees with that approach. You're a CPA — you can evaluate a pricing table without a sales pitch. Our pricing is public, our trial is self-serve, and you can be operational before you've finished your morning coffee.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4 — Comparison Table */}
        <section className="py-16 bg-card">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                Ledger Stash vs. Liscio — Feature by Feature
              </h2>

              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse bg-background rounded-xl shadow-md overflow-hidden">
                  <thead>
                    <tr className="bg-primary text-primary-foreground">
                      <th className="px-5 py-4 text-left font-semibold text-sm">Feature</th>
                      <th className="px-5 py-4 text-left font-semibold text-sm">Ledger Stash</th>
                      <th className="px-5 py-4 text-left font-semibold text-sm">Liscio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row, i) => (
                      <tr key={i} className="border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors">
                        <td className="px-5 py-3.5 font-semibold text-foreground text-sm">{row.feature}</td>
                        <td className="px-5 py-3.5 text-sm bg-accent/5">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-success" />
                            <span className={isPositive(row.ledger) ? "text-success font-bold" : "text-foreground"}>
                              {row.ledger.replace(/^[✅❌⚠️]\s*/, "")}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-muted-foreground">
                          <span className={
                            isNegative(row.liscio) ? "text-destructive font-semibold" :
                            isWarning(row.liscio) ? "text-amber-600 font-semibold" :
                            isDash(row.liscio) ? "text-muted-foreground/50" : ""
                          }>
                            {row.liscio}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-3">
                {comparisonRows.map((row, i) => (
                  <div key={i} className="bg-background rounded-xl p-4 shadow-sm border border-border">
                    <h3 className="font-semibold text-foreground text-sm mb-2">{row.feature}</h3>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex items-start gap-2 rounded-lg p-2 bg-accent/5">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-success" />
                        <div>
                          <span className="text-xs text-muted-foreground block">Ledger Stash</span>
                          <span className={isPositive(row.ledger) ? "text-success font-bold" : "text-foreground"}>{row.ledger.replace(/^[✅❌⚠️]\s*/, "")}</span>
                        </div>
                      </div>
                      <div className="text-muted-foreground p-2">
                        <span className="text-xs block font-medium text-foreground/60">Liscio</span>
                        <span className={
                          isNegative(row.liscio) ? "text-destructive" :
                          isWarning(row.liscio) ? "text-amber-600" :
                          isDash(row.liscio) ? "text-muted-foreground/50" : ""
                        }>{row.liscio}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-muted-foreground italic mt-4 text-center">
                Liscio overage rates require a demo call to confirm. Estimates based on published base pricing and reported usage-based billing. Pricing as of 2026.
              </p>
              <p className="text-[11px] text-muted-foreground/70 mt-1.5 text-center">
                Per seat and per user refer to the same concept — a charge for each staff member who accesses the software. Terminology varies by vendor.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 5 — Meet Scout and Sage */}
        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-2xl font-bold text-foreground mb-4 text-center">
                The AI Agents Liscio Doesn't Have
              </h2>
              <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
                Liscio does not include AI agents. Ledger Stash includes two purpose-built AI agents on every plan — at no extra cost.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl bg-card border border-border hover:border-accent/50 transition-all duration-300">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent mb-4">
                    <Search className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Scout — AI Client Agent</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Scout knows exactly which documents each specific client has uploaded and which are still missing from their checklist. When a client asks "what do I still need to send you?" at 10pm, Scout answers with their actual outstanding items by name — not a generic response. Tax advice is explicitly blocked. Every Scout conversation is logged and reviewable by you on the client detail page.
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-card border border-border hover:border-accent/50 transition-all duration-300">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent mb-4">
                    <BrainCircuit className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Sage — AI Practice Agent</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Ask Sage "who hasn't uploaded anything in 7 days?" or "which clients are still missing a W-2 across my entire book?" and get live answers based on your real portfolio data. Sage queries your entire client base in real time and can send reminders directly from the conversation — no manual dashboard scanning during busy season.
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-card border border-border hover:border-accent/50 transition-all duration-300">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent mb-4">
                    <ScanLine className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Prior-Year Return Scanning</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Upload a client's prior-year 1040 and AI automatically generates their personalized PBC checklist — identifying income sources like W-2s, 1099s, Schedule C, K-1s, and rentals. Review, edit, and send in seconds.
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center mt-6 font-medium">
                Liscio has none of these. They are Ledger Stash exclusives included on every plan.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 6 — Where Liscio Falls Short */}
        <section className="py-16 bg-card">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                The Real Gaps for Solo Practitioners and Boutique Firms
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gapCards.map((card) => (
                  <div key={card.title} className="group p-6 rounded-xl bg-background border border-border hover:border-accent/50 transition-all duration-300">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300">
                      <card.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{card.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7 — Real Cost Comparison */}
        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
                What Liscio Actually Costs a Solo CPA During Tax Season
              </h2>
              <p className="text-sm text-muted-foreground text-center mb-8">
                Scenario: Solo CPA, 80 clients, adds 1 seasonal preparer for 4 months
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-card rounded-xl shadow-md overflow-hidden">
                  <thead>
                    <tr className="bg-primary text-primary-foreground">
                      <th className="px-5 py-3 text-left font-semibold text-sm">Cost Component</th>
                      <th className="px-5 py-3 text-left font-semibold text-sm">Ledger Stash</th>
                      <th className="px-5 py-3 text-left font-semibold text-sm">Liscio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {costRows.map((row, i) => (
                      <tr key={i} className={`border-b border-border last:border-b-0 ${row.bold ? "bg-muted/30" : ""}`}>
                        <td className={`px-5 py-3 text-sm text-foreground ${row.bold ? "font-bold" : ""}`}>{row.component}</td>
                        <td className={`px-5 py-3 text-sm ${row.ledgerGreen ? "text-accent font-bold" : "text-foreground"} ${row.bold ? "font-extrabold text-base" : ""}`}>
                          {row.ledger}
                        </td>
                        <td className={`px-5 py-3 text-sm ${row.liscioRed ? "text-destructive font-semibold" : "text-muted-foreground"} ${row.bold ? "font-extrabold text-base" : ""}`}>
                          {row.liscio}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground italic mt-4 text-center">
                Liscio overage rates require a demo call to confirm. Estimates based on published base pricing and reported usage-based billing.
              </p>
              <p className="text-[11px] text-muted-foreground/70 mt-1.5 text-center">
                Per seat and per user refer to the same concept — a charge for each staff member who accesses the software. Terminology varies by vendor.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 8 — Where Liscio Wins */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-6">Where Liscio Wins — We'll Be Honest</h2>
              <p className="text-muted-foreground mb-6">Liscio is genuinely stronger than Ledger Stash in these areas:</p>
              <div className="space-y-5">
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Native mobile app</h3>
                  <p className="text-sm text-muted-foreground">
                    Liscio has a native iOS and Android app that clients can download and use directly. Ledger Stash is mobile-first and works seamlessly in any mobile browser via magic link — but no native app currently. If a downloadable client app is important to your firm's brand experience, Liscio has an edge here.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Email integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Liscio integrates with Gmail and Outlook, bringing client emails into the platform. Ledger Stash focuses specifically on the document collection workflow and doesn't currently match this.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">For larger team-based firms</h3>
                  <p className="text-sm text-muted-foreground">
                    Liscio's team communication features and firm-wide visibility tools are built for firms where multiple staff interact with the same clients. If you run a 10+ person firm where team communication drives the workflow, Liscio is worth a serious look.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 9 — FAQ */}
        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left text-foreground">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* SECTION 10 — Bottom CTA */}
        <section className="py-16 bg-card">
          <div className="container text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Flat Pricing. No Usage Fees. No Demo Required. Scout and Sage Included.
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Start your free trial right now — no sales call, no credit card, no commitment.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/signup" className="gap-2">
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <p className="mt-4 text-sm text-muted-foreground italic">
              Switching from Liscio? Your clients will appreciate the magic link more than the app.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
