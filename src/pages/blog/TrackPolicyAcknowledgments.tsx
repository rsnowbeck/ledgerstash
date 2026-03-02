import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageSEO } from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect } from "react";

const faqs = [
  {
    question: "What is employee policy acknowledgment software?",
    answer:
      "It's a tool that helps businesses distribute policies digitally and track legally defensible acknowledgment from employees or contractors.",
  },
  {
    question: "Are digital acknowledgments legally binding?",
    answer:
      "Yes. Electronic signatures are recognized under ESIGN and UETA in the United States, provided proper audit records are maintained.",
  },
  {
    question: "Can I track recurring policy updates?",
    answer:
      "Yes. Some compliance tools allow you to set recurring acknowledgment requirements for annual policy updates.",
  },
];

function useBlogSchema() {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "How to Track Employee Policy Acknowledgments (Without HR Software)",
      description:
        "Learn how to track employee policy acknowledgments with audit-ready records, without investing in complex HR software.",
      author: { "@type": "Organization", name: "VaultLedger" },
      publisher: { "@type": "Organization", name: "VaultLedger", url: "https://getvaultledger.com" },
      datePublished: "2025-02-14",
      mainEntityOfPage: "https://getvaultledger.com/blog/track-employee-policy-acknowledgments",
    };
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-blog-schema", "true");
    script.textContent = JSON.stringify([schema, faqSchema]);
    document.head.appendChild(script);
    return () => {
      const el = document.querySelector("script[data-blog-schema]");
      if (el) el.remove();
    };
  }, []);
}

export default function TrackPolicyAcknowledgments() {
  useBlogSchema();

  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="How to Track Employee Policy Acknowledgments (Without HR Software)"
        description="Learn how to track employee policy acknowledgments with audit-ready records, timestamped signatures, and automated reminders — without complex HR software."
        keywords="employee policy acknowledgment tracking, policy acknowledgment software, track policy sign-offs, compliance tracking small business, audit-ready acknowledgments"
        canonical="/blog/track-employee-policy-acknowledgments"
      />
      <Header />
      <main>
        {/* Hero */}
        <article className="pt-28 lg:pt-40 pb-16 lg:pb-24">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <p className="text-sm font-medium text-accent mb-3 uppercase tracking-wide">
                Compliance Guide
              </p>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-6">
                How to Track Employee Policy Acknowledgments{" "}
                <span className="text-accent">(Without HR Software)</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Employee policy acknowledgment tracking is one of the most overlooked compliance
                risks for small businesses. Here's how to fix it — without investing in complex HR
                software.
              </p>

              {/* Intro */}
              <div className="prose-section space-y-4 text-muted-foreground mb-12">
                <p>
                  You may have a signed employee handbook on file — but can you quickly prove who
                  acknowledged your harassment policy update last quarter? Or who hasn't confirmed
                  receipt of your new remote work guidelines?
                </p>
                <p>
                  If you're relying on email replies, printed signatures, or spreadsheet tracking,
                  you're exposing your business to unnecessary risk.
                </p>
              </div>

              {/* Why it matters */}
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Why policy acknowledgment tracking matters
              </h2>
              <div className="space-y-4 text-muted-foreground mb-8">
                <p>
                  When policies change — harassment prevention, remote work, IT security, safety
                  standards — employers must demonstrate that employees received and acknowledged the
                  updates.
                </p>
                <p>In the event of:</p>
                <ul className="space-y-2 ml-1">
                  {[
                    "Legal disputes",
                    "Workplace investigations",
                    "Compliance audits",
                    "Insurance claims",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-accent flex-shrink-0 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>You need defensible documentation showing:</p>
                <ul className="space-y-2 ml-1">
                  {[
                    "Who received the policy",
                    "When they reviewed it",
                    "When they acknowledged it",
                    "A timestamped record",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>Without structured tracking, this becomes manual and unreliable.</p>
              </div>

              {/* Problem with email/paper */}
              <h2 className="text-2xl font-bold text-foreground mb-4">
                The problem with email and paper tracking
              </h2>
              <div className="space-y-4 text-muted-foreground mb-8">
                <p>Many small businesses rely on:</p>
                <ul className="space-y-2 ml-1 mb-4">
                  {[
                    '"Reply all to confirm" emails',
                    "Shared spreadsheets",
                    "Printed signature pages",
                    "PDF attachments stored in folders",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <XCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>These approaches create problems:</p>
                <ul className="space-y-2 ml-1">
                  {[
                    "No centralized dashboard",
                    "No audit trail metadata",
                    "No IP tracking",
                    "No easy export",
                    "No automated reminders",
                    "Hard to track overdue acknowledgments",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <XCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>As your team grows, this breaks down quickly.</p>
              </div>

              {/* What it does */}
              <h2 className="text-2xl font-bold text-foreground mb-4">
                What policy acknowledgment software does
              </h2>
              <div className="space-y-4 text-muted-foreground mb-8">
                <p>Policy acknowledgment software allows businesses to:</p>
                <ul className="space-y-2 ml-1">
                  {[
                    "Send policies digitally",
                    "Collect legally defensible acknowledgments",
                    "Track completion status in real time",
                    "Store audit-ready records",
                    "Export proof when needed",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  Unlike full HR systems, compliance-focused tools are lightweight and purpose-built
                  for documentation workflows.
                </p>
                <div className="card-elevated p-6 border-l-4 border-accent">
                  <p className="text-foreground font-medium">
                    VaultLedger is compliance software designed for small and mid-sized businesses that
                    need to distribute policies, collect acknowledgments or fillable form data, and
                    maintain audit-ready records without enterprise complexity.
                  </p>
                </div>
              </div>

              {/* What to look for */}
              <h2 className="text-2xl font-bold text-foreground mb-4">
                What to look for in an acknowledgment tracking tool
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  {
                    title: "No-login signing",
                    desc: "Employees should not need to create accounts to acknowledge policies.",
                  },
                  {
                    title: "Secure signing links",
                    desc: "Unique, single-use links prevent duplicate submissions.",
                  },
                  {
                    title: "Timestamped audit trail",
                    desc: "Every acknowledgment should capture time, IP address, and metadata.",
                  },
                  {
                    title: "Real-time dashboard",
                    desc: "You need visibility into pending and completed acknowledgments.",
                  },
                  {
                    title: "Automated reminders",
                    desc: "Manual chasing wastes time.",
                  },
                  {
                    title: "Exportable records",
                    desc: "Download completed PDF copies and export structured data via CSV for audits.",
                  },
                ].map((f) => (
                  <div key={f.title} className="card-elevated p-5">
                    <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </div>
                ))}
              </div>

              {/* More than a signature */}
              <h2 className="text-2xl font-bold text-foreground mb-4">
                When you need more than just a signature
              </h2>
              <div className="space-y-4 text-muted-foreground mb-8">
                <p>Sometimes policies require more than acknowledgment. For example:</p>
                <ul className="space-y-2 ml-1">
                  {[
                    "Updated emergency contact forms",
                    "Security access confirmations",
                    "Equipment receipt documentation",
                    "Training certifications",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  In those cases, you may need fillable compliance forms in addition to signatures.
                  Modern compliance software allows you to upload a PDF and convert it into a
                  fillable form with required fields and signatures — all tracked in one place.
                </p>
              </div>

              {/* Simple workflow */}
              <h2 className="text-2xl font-bold text-foreground mb-4">
                A simple workflow for small teams
              </h2>
              <div className="space-y-4 text-muted-foreground mb-8">
                <p>Here's what streamlined compliance tracking looks like:</p>
                <ol className="space-y-3 ml-1">
                  {[
                    "Add employees or contractors",
                    "Upload your policy document",
                    "Send secure signing links",
                    "Monitor completion status",
                    "Export audit-ready proof",
                  ].map((step, i) => (
                    <li key={step} className="flex items-start gap-3">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
                <p>
                  No HR system required. No enterprise contract negotiation tools. Just structured
                  compliance tracking.
                </p>
              </div>

              {/* Final thoughts */}
              <h2 className="text-2xl font-bold text-foreground mb-4">Final thoughts</h2>
              <div className="space-y-4 text-muted-foreground mb-12">
                <p>
                  Tracking employee policy acknowledgments doesn't need to be complicated — but it
                  does need to be defensible.
                </p>
                <p>
                  Manual spreadsheets and email confirmations may work temporarily, but they don't
                  scale and don't protect you during audits or disputes.
                </p>
                <p>
                  Using compliance-focused software ensures every acknowledgment is timestamped,
                  exportable, and audit-ready.
                </p>
              </div>

              {/* FAQ */}
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Frequently asked questions
              </h2>
              <Accordion type="single" collapsible className="w-full mb-12">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-foreground hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {/* CTA */}
              <div className="card-elevated p-8 text-center">
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  Start tracking policy acknowledgments today
                </h2>
                <p className="text-muted-foreground mb-6">
                  Free 14-day trial. No credit card required. Send your first policy in minutes.
                </p>
                <Button variant="hero" size="xl" asChild>
                  <Link to="/signup" className="gap-2">
                    Start Free Trial
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
