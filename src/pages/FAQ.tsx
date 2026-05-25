import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageSEO } from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect } from "react";

const faqSections = [
  {
    category: "Pricing & Plans",
    items: [
      {
        question: "How does Ledger Stash pricing work?",
        answer: "We charge a flat monthly rate based on the number of active client vaults you manage — not the number of staff members on your account. Solo Plan is $49/month (up to 25 active clients), Boutique is $149/month (up to 100 active clients), and Enterprise Vault is $199/month (unlimited clients). All plans include unlimited staff seats.",
      },
      {
        question: "What does 'unlimited staff seats' mean?",
        answer: "It means you can add every member of your team — permanent staff, seasonal preparers, admins, and contractors — to your Ledger Stash account at no additional cost. Your monthly price is determined by how many clients you manage, not how many people help you manage them.",
      },
      {
        question: "Is there a free trial?",
        answer: "Yes. Every plan includes a 14-day free trial with full access to all features. No credit card required to start. No demo call, no guided setup, no waiting.",
      },
      {
        question: "Do I have to pay annually?",
        answer: "No. Ledger Stash is available month-to-month with no annual commitment required. You can cancel at any time.",
      },
      {
        question: "What happens if I exceed my active client limit?",
        answer: "You'll be notified when you're approaching your plan's client limit and prompted to upgrade. You can upgrade at any time and the change takes effect immediately.",
      },
    ],
  },
  {
    category: "Security & Compliance",
    items: [
      {
        question: "How secure is Ledger Stash?",
        answer: "All data is encrypted with AES-256 at rest and TLS 1.3 in transit. Ledger Stash is compliant with IRS Publication 4557, the FTC Safeguards Rule, and GLBA. Every action on the platform — including document uploads, AI conversations, and e-signatures — generates a full audit trail with IP address, timestamp, and browser fingerprint.",
      },
      {
        question: "Is Ledger Stash HIPAA compliant?",
        answer: "Ledger Stash is built for accounting and financial document management and is compliant with IRS 4557, FTC Safeguards, and GLBA. If your practice handles medical records or PHI, please contact us to discuss your specific requirements.",
      },
      {
        question: "What happens to client data if I cancel?",
        answer: "You have 30 days after cancellation to export all client data and documents. After 30 days, data is permanently deleted from our servers. We will never sell or share your client data.",
      },
      {
        question: "Are e-signatures legally binding?",
        answer: "Yes. Electronic signatures on Ledger Stash are compliant with ESIGN and UETA, which recognize electronic signatures as legally equivalent to handwritten signatures in the United States. Every signature includes a full audit trail with timestamp, IP address, and browser fingerprint.",
      },
    ],
  },
  {
    category: "Magic Links & Client Access",
    items: [
      {
        question: "What is a Magic Link?",
        answer: "A Magic Link is a unique, encrypted URL sent directly to your client's email address. When they click it, the system authenticates them instantly and drops them into their secure vault — no account creation, no password, no friction. Each Magic Link is single-use and expires after a configurable time period.",
      },
      {
        question: "Do my clients need to create an account?",
        answer: "No. Clients never create accounts or passwords. They receive a Magic Link email, click it, and upload their documents. That's it. This is the primary reason clients actually use Ledger Stash instead of ignoring the portal.",
      },
      {
        question: "What if a client's Magic Link expires?",
        answer: "You can resend a new Magic Link from your dashboard at any time. The process takes about 10 seconds.",
      },
      {
        question: "Can clients upload from their phone?",
        answer: "Yes. The client portal is fully mobile-responsive. Clients can upload documents, photos of receipts, and files directly from their phone's camera or file storage.",
      },
    ],
  },
  {
    category: "Scout & Sage AI",
    items: [
      {
        question: "What is Scout?",
        answer: "Scout is the client-facing AI agent built into every Ledger Stash plan. When your clients ask questions like 'what do I still need to send you?', Scout reads their specific checklist and replies with their exact outstanding items. Tax advice is explicitly blocked. Every conversation is logged and reviewable by you.",
      },
      {
        question: "What is Sage?",
        answer: "Sage is the CPA-facing practice intelligence agent. You can ask Sage portfolio-level questions like 'who hasn't uploaded anything in 7 days?' or 'which clients are still missing a W-2?' and get live answers based on your entire book of business. Sage can also send reminders directly from the conversation.",
      },
      {
        question: "Can Scout give tax advice?",
        answer: "No. Scout is strictly limited to document collection assistance. It cannot provide tax advice, legal guidance, or financial recommendations. This is a hard guardrail, not a soft suggestion.",
      },
      {
        question: "Are AI conversations logged?",
        answer: "Yes. Every Scout and Sage conversation is logged with a full transcript, timestamp, and client attribution. You can review any conversation from your dashboard at any time.",
      },
      {
        question: "Do I have to set up the AI agents?",
        answer: "No. Scout and Sage are active on your account from day one. There is no configuration required. Scout automatically knows each client's checklist based on the vault you've set up for them.",
      },
    ],
  },
  {
    category: "Switching & Migration",
    items: [
      {
        question: "How hard is it to switch from TaxDome?",
        answer: "Straightforward. Export your client list from TaxDome as a CSV and import it into Ledger Stash. Download your existing documents from TaxDome and upload them to your new vaults. Most firms complete the migration in a single afternoon. We also have a free step-by-step switching guide available for download.",
      },
      {
        question: "How hard is it to switch from SmartVault?",
        answer: "Similar process. Export your client data, import it into Ledger Stash, and migrate your documents. Your clients will receive Magic Link emails instead of password prompts — most find it easier. Download our free SmartVault switching guide for the full step-by-step process.",
      },
      {
        question: "Can I import my existing client list?",
        answer: "Yes. Ledger Stash supports bulk client import via CSV. You can upload your entire client list at once and have all vaults created automatically.",
      },
    ],
  },
];

function useFAQSchema() {
  useEffect(() => {
    const allItems = faqSections.flatMap((s) => s.items);
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: allItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-faq-schema", "true");
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    return () => {
      const el = document.querySelector("script[data-faq-schema]");
      if (el) el.remove();
    };
  }, []);
}

export default function FAQ() {
  useFAQSchema();
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Frequently Asked Questions | Ledger Stash"
        description="Everything you need to know about Ledger Stash — pricing, security, Magic Links, Scout AI, Sage AI, and switching from TaxDome or SmartVault."
        keywords="ledger stash FAQ, ledger stash questions, how does ledger stash work, ledger stash pricing FAQ, ledger stash security, magic link FAQ"
        canonical="/faq"
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="py-20 bg-gradient-to-b from-muted/40 to-background">
          <div className="container text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about Ledger Stash. If you don't see your question here, contact us at{" "}
              <Link to="/contact" className="text-primary hover:underline">our contact page</Link>.
            </p>
          </div>
        </section>

        {/* FAQ Sections */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto space-y-12">
              {faqSections.map((section) => (
                <div key={section.category}>
                  <h2 className="text-xl font-bold text-foreground mb-6 pb-2 border-b border-border">
                    {section.category}
                  </h2>
                  <Accordion type="single" collapsible className="w-full">
                    {section.items.map((item, i) => (
                      <AccordionItem key={i} value={`${section.category}-${i}`}>
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
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-card border-t border-border">
          <div className="container text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Still Have Questions?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Or just start your free trial and see it for yourself. 14 days, full access, no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/signup" className="gap-2">
                  Start Free Trial
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
