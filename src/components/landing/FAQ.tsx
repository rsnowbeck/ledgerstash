import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const essentialFaqs = [
  {
    question: "What is Ledger Stash?",
    answer:
      "Ledger Stash is a secure, white-labeled client vault and PBC management system built exclusively for solo CPAs and boutique firms. We deliver bank-grade security and compliance without the enterprise bloat.",
  },
  {
    question: "How do my clients access the vault?",
    answer:
      "Clients receive a branded email with a secure magic link, granting instant, password-free access to their PBC tasks and document folders. No accounts, no passwords, just frictionless document exchange.",
  },
  {
    question: "How is Ledger Stash different from SmartVault or TaxDome?",
    answer:
      "Ledger Stash is purpose-built for solo CPAs, offering massive cost savings. Compare our flexible $29/month to SmartVault's minimum $210/month (3-user minimum) or TaxDome's $800 annual upfront payment (no monthly option). We provide a simpler, more focused, and truly frictionless client experience, unlike bloated enterprise solutions.",
  },
  {
    question: "Is Ledger Stash secure and compliant for tax documents?",
    answer:
      "Absolutely. Ledger Stash is fully compliant with IRS Publication 4557, FTC Safeguards Rule, and GLBA. Your clients' sensitive data is protected with bank-grade encryption and comprehensive audit trails.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes, we offer a 14-day free trial with no credit card required. Experience the Ledger Stash difference risk-free.",
  },
];

const secondaryFaqs = [
  {
    question: "What types of files can clients upload?",
    answer:
      "Clients can securely upload any file type, including PDFs, spreadsheets, images, and more, directly from their computer or mobile device.",
  },
  {
    question: "Can I use Ledger Stash for engagement letters and agreements?",
    answer:
      "Yes, Ledger Stash is ideal for securely storing and managing engagement letters and other client agreements. It integrates seamlessly with your existing e-signature workflows.",
  },
  {
    question: "Can my team members access the portal too?",
    answer:
      "Yes, Ledger Stash offers plans that support multiple users, allowing your team members to securely access and manage client vaults with appropriate role-based permissions.",
  },
  {
    question: "What if I need practice management features in the future?",
    answer:
      "Ledger Stash excels at secure document exchange and PBC management. It's designed to integrate with your broader tech stack. If you expand to need more extensive practice management features, Ledger Stash remains a valuable, focused component of your workflow.",
  },
];

const allFaqs = [...essentialFaqs, ...secondaryFaqs];

function useFAQSchema() {
  useEffect(() => {
    const existingScript = document.querySelector('script[data-faq-schema]');
    if (existingScript) return;

    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: allFaqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
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
  const [showMore, setShowMore] = useState(false);

  return (
    <section id="faq" className="pt-24 pb-24 bg-background">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="text-[2.25rem] sm:text-[2.5rem] font-bold text-foreground leading-[1.2] mb-4">
              Frequently asked questions
            </h2>
            <p className="mx-auto max-w-[50rem] text-lg text-muted-foreground font-normal leading-relaxed mb-12">
              Everything you need to know about Ledger Stash
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {essentialFaqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-foreground hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-3">
                  {faq.answer.split("\n\n").map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}

            {showMore &&
              secondaryFaqs.map((faq, index) => (
                <AccordionItem
                  key={`secondary-${index}`}
                  value={`secondary-item-${index}`}
                >
                  <AccordionTrigger className="text-left text-foreground hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3">
                    {faq.answer.split("\n\n").map((paragraph, pIdx) => (
                      <p key={pIdx}>{paragraph}</p>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>

          <div className="mt-8 text-center">
            <Button
              variant="ghost"
              onClick={() => setShowMore(!showMore)}
              className="text-muted-foreground hover:text-foreground gap-2"
            >
              {showMore ? "Show fewer questions" : "Show more questions"}
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  showMore ? "rotate-180" : ""
                }`}
              />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}