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
      "DocuSign is built for contracts—complex documents with multiple signature fields, negotiations, and legal review. That's overkill (and expensive) for compliance acknowledgments. Attestly is purpose-built for the simpler use case: getting employees to quickly acknowledge policies, handbooks, and training. No signer accounts, no complex workflows, just fast one-click signatures with audit-ready proof.",
  },
  {
    question: "What is employee handbook software?",
    answer:
      "Employee handbook software helps organizations distribute handbooks and collect legally binding acknowledgment signatures from employees. Attestly lets recipients sign with one click—no accounts needed—while creating audit-ready proof with timestamps and IP addresses for HR compliance.",
  },
  {
    question: "Are digital signatures legally binding for compliance?",
    answer:
      "Yes. Digital signatures collected through Attestly are legally defensible under the ESIGN Act and UETA. Each signature includes a timestamp, IP address, browser information, and the exact document version acknowledged. These records meet audit and compliance requirements for employee handbooks, NDAs, training acknowledgments, and policy sign-offs.",
  },
  {
    question: "How much does Attestly cost?",
    answer:
      "Attestly offers a 14-day free trial with no credit card required. Paid plans start at $29/month for up to 100 recipients—typically 50-80% less than DocuSign for policy acknowledgments. The Pro plan at $79/month includes 500 recipients and custom branding. Enterprise pricing is available.",
  },
  {
    question: "Do signers need to create an account?",
    answer:
      "No. Attestly signers receive a secure email link and can review and sign instantly—no account creation, passwords, or app downloads required. This dramatically improves completion rates compared to DocuSign or HR platforms that require signer registration.",
  },
  {
    question: "Why use Attestly instead of my HR platform?",
    answer:
      "HR platforms like ADP, Paylocity, and BambooHR include acknowledgments as a small feature within larger systems. Attestly is dedicated policy acknowledgment software built for fast, audit-ready compliance tracking—and it works for contractors and vendors outside your HR system too.",
  },
  {
    question: "What documents can I send for signature?",
    answer:
      "Any document requiring acknowledgment: employee handbooks, codes of conduct, privacy policies (HIPAA, GDPR, CCPA), safety training, NDAs, vendor agreements, and annual policy renewals. Attach PDFs for recipients to review before signing.",
  },
  {
    question: "Can I export signature records for audits?",
    answer:
      "Yes. Attestly generates PDF proof documents with signer name, email, timestamp, IP address, browser info, and the exact document version acknowledged. Export individual records or bulk export for audits and legal proceedings.",
  },
  {
    question: "Is Attestly secure?",
    answer:
      "Yes. Bank-level encryption for data at rest and in transit. Each signing link is unique and expires after use. SOC 2 Type II compliant practices, GDPR compliant, with regular backups.",
  },
  {
    question: "How do I get started?",
    answer:
      "Sign up for a free 14-day trial—no credit card required. Create your first policy or handbook requirement, add recipients (manually or via CSV), and send signature requests in minutes. Most teams are set up in under 5 minutes.",
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
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}