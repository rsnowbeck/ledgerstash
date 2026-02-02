import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect } from "react";

const faqs = [
  {
    question: "Do I need a full HR platform to use Attestly?",
    answer:
      "No. Attestly is purpose-built for compliance acknowledgments and works alongside your existing HR or payroll tools.",
  },
  {
    question: "Why not just use Paylocity, ADP, Rippling, or BambooHR?",
    answer:
      "Those platforms include acknowledgments as part of a full HR system. Attestly is purpose-built for fast, audit-ready compliance tracking—without the overhead of a complete HR platform—and works alongside your existing tools.",
  },
  {
    question: "Is Attestly legally defensible for audits and disputes?",
    answer:
      "Yes. Attestly provides timestamped, signer-verified records designed to meet common audit and compliance requirements.",
  },
  {
    question: "Who is Attestly designed for?",
    answer:
      "Attestly is designed for teams that need simple, audit-ready compliance acknowledgments—without the cost or complexity of a full HR platform. It supports employees, contractors, and vendors, even if they aren't in your HR system.",
  },
  {
    question: "Do signers need an account or login?",
    answer:
      "No. Signers can securely review and acknowledge documents without creating an account or remembering passwords.",
  },
  {
    question: "Can Attestly work with our existing tools?",
    answer:
      "Yes. Attestly works alongside your existing HR or payroll tools by handling compliance acknowledgments separately.",
  },
  {
    question: "What types of compliance does Attestly support?",
    answer:
      "Attestly is industry-agnostic and supports any policy or training that requires acknowledgment and audit-ready proof. Common use cases include employee handbooks and codes of conduct, privacy and security policies (HIPAA, GDPR/CCPA), safety training, NDAs, vendor agreements, and annual renewals.",
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