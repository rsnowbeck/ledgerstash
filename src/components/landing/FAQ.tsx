import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect } from "react";

const faqs = [
  {
    question: "What is compliance software for small businesses?",
    answer:
      "Compliance software helps businesses distribute policies, collect acknowledgments or required form data, and maintain audit-ready records. Attestly simplifies this process by combining fillable forms, signatures, and structured exports in one streamlined platform — purpose-built for small and mid-sized businesses without enterprise complexity.",
  },
  {
    question: "What is policy acknowledgment software?",
    answer:
      "Policy acknowledgment software allows businesses to send digital policies to employees or contractors and track legally defensible acknowledgment. Instead of chasing email confirmations or paper signatures, Attestly provides timestamped proof with exportable records, eliminating manual tracking entirely.",
  },
  {
    question: "Can I create fillable compliance forms?",
    answer:
      "Yes. You can upload a PDF and convert it into a fillable compliance form with required fields and signatures. AI-powered field detection identifies text inputs, checkboxes, dates, and signature areas automatically. Structured responses are securely stored and exportable via CSV.",
  },
  {
    question: "Is Attestly a replacement for DocuSign?",
    answer:
      "Attestly is purpose-built for internal compliance workflows, not contract negotiation. It's ideal for policy acknowledgments, onboarding forms, and audit documentation without enterprise complexity. Unlike DocuSign, recipients don't need accounts or passwords — they simply click a secure link and sign.",
  },
  {
    question: "Are digital signatures legally binding for compliance?",
    answer:
      "Yes. Electronic signatures are legally recognized in most jurisdictions under laws like the ESIGN Act and UETA in the United States.\n\nAttestly captures timestamped signatures, IP addresses, and a full audit trail to provide defensible proof of acknowledgment or completion.",
  },
  {
    question: "Can I export records for audits?",
    answer:
      "Yes. You can download completed PDF copies and export structured response data via CSV — complete with timestamps, IP tracking, and full audit metadata. Attestly is designed to produce audit-ready documentation that meets regulatory requirements.",
  },
  {
    question: "Do signers need to create an account?",
    answer:
      "No. Recipients click a secure link, review the document or complete required fields, and sign. No accounts or passwords required. This no-login approach removes friction and improves completion rates.",
  },
  {
    question: "Is Attestly secure?",
    answer:
      "Yes. Attestly uses HTTPS encryption, secure tokens, encrypted storage, and system safeguards to protect your compliance data. Audit logs and structured exports ensure defensible recordkeeping.",
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
              Frequently asked questions
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