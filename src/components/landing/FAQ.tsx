import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect } from "react";

const faqs = [
  {
    question: "Why not just use DocuSign?",
    answer:
      "DocuSign is built for complex contracts — multi-party agreements, legal negotiations, and enterprise workflows. That's powerful, but often excessive (and expensive) for internal compliance needs.\n\nAttestly is purpose-built for compliance workflows. Send policies for read-and-acknowledge, or turn PDFs into fillable forms with required fields and signatures. No signer accounts. No complex setup. Just structured, audit-ready compliance tracking.",
  },
  {
    question: "What is employee handbook software?",
    answer:
      "Employee handbook software helps businesses distribute policies and track acknowledgment from employees. Instead of printing documents or chasing email confirmations, you can send policies digitally, collect signatures, and maintain audit-ready records.\n\nAttestly goes further by supporting both simple acknowledgments and fillable compliance forms — all stored securely with exportable records.",
  },
  {
    question: "Are digital signatures legally binding for compliance?",
    answer:
      "Yes. Electronic signatures are legally recognized in most jurisdictions under laws like the ESIGN Act and UETA in the United States.\n\nAttestly captures timestamped signatures, IP addresses, and a full audit trail to provide defensible proof of acknowledgment or completion.",
  },
  {
    question: "Can I collect more than just a signature?",
    answer:
      "Yes. In addition to read-and-acknowledge workflows, you can upload a PDF and add required fields such as text inputs, dates, dropdowns, checkboxes, initials, and signatures. Structured response data is securely stored and exportable via CSV.",
  },
  {
    question: "What documents can I send?",
    answer:
      "You can upload PDFs, Word documents, or image files for acknowledgment. PDFs can be converted into fillable compliance forms with required fields and signatures.\n\nCommon use cases include employee handbooks, workplace policies, NDA agreements, training confirmations, vendor compliance forms, and contractor onboarding forms.",
  },
  {
    question: "Can I export records for audits?",
    answer:
      "Yes. You can download completed PDF copies and export structured response data via CSV — complete with timestamps, IP tracking, and full audit metadata.",
  },
  {
    question: "Do signers need to create an account?",
    answer:
      "No. Recipients click a secure link, review the document or complete required fields, and sign. No accounts or passwords required.",
  },
  {
    question: "Is Attestly secure?",
    answer:
      "Yes. Attestly uses HTTPS encryption, secure tokens, encrypted storage, and system safeguards to protect your compliance data. Audit logs and structured exports ensure defensible recordkeeping.",
  },
  {
    question: "How do I get started?",
    answer:
      "Start a 14-day free trial — no credit card required. Add your recipients, create your first requirement, and send secure links in minutes.",
  },
];

// Generate FAQ Schema for AI and search engines
function useFAQSchema() {
  useEffect(() => {
    const existingScript = document.querySelector('script[data-faq-schema]');
    if (existingScript) return;

    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer,
        },
      })),
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-faq-schema", "true");
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const el = document.querySelector('script[data-faq-schema]');
      if (el) el.remove();
    };
  }, []);
}

export function FAQ() {
  useFAQSchema();

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about Attestly
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-foreground hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-3">
                  {faq.answer.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}