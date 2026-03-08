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
    question: "What exactly is Ledger Stash?",
    answer:
      "Ledger Stash is a secure client vault where your clients upload tax documents, complete PBC checklists, and sign engagement letters — without creating an account. Think of it as the organized, encrypted version of emailing files back and forth.",
  },
  {
    question: "Do my clients need to create an account?",
    answer:
      "No. Clients receive a branded email with a secure magic link. One click, and they're inside their vault — seeing exactly what documents to upload and what's already done. No passwords, no app downloads, no friction.",
  },
  {
    question: "How is this different from SmartVault or TaxDome?",
    answer:
      'SmartVault starts at $210/month (3-user minimum). TaxDome charges $800/year per seat. Ledger Stash starts at $29/month with unlimited team members — no per-user fees, ever. We also skip the 6-week onboarding: you\'re collecting documents in under 5 minutes.',
  },
  {
    question: "Is it secure enough for tax documents?",
    answer:
      "Yes. AES-256 encryption at rest, TLS 1.3 in transit, and full audit trails with IP addresses and timestamps. Compliant with IRS Publication 4557, FTC Safeguards Rule, and GLBA — the same standards your E&O carrier expects.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes — 14 days, full access, no credit card required. Set up your vault, invite a test client, and see the workflow in action before you commit.",
  },
];

const secondaryFaqs = [
  {
    question: "Are document acknowledgments legally binding?",
    answer:
      "Yes. Every acknowledgment captures IP address, timestamp, browser fingerprint, and the signer's typed name — fully compliant with the ESIGN Act and UETA. You can download a PDF certificate for each one as legally defensible proof.",
  },
  {
    question: "What file types can clients upload?",
    answer:
      "Any file type — PDFs, Excel spreadsheets, images, scanned documents, and more. Clients drag and drop from their computer or phone.",
  },
  {
    question: "Can I send engagement letters through Ledger Stash?",
    answer:
      "Yes. Upload your engagement letter, send it to specific clients, and track exactly who has signed and when. Unsigned clients get automated follow-ups on your schedule.",
  },
  {
    question: "Can my team members access the portal?",
    answer:
      "Yes — every plan includes unlimited team members. Add staff, interns, and partners with role-based permissions. You'll never pay a per-seat fee.",
  },
  {
    question: "What if I outgrow the Solo plan?",
    answer:
      "Upgrade anytime. The Boutique plan ($79/mo) supports up to 100 clients and adds full white-labeling plus auto-reminders. Enterprise ($199/mo) removes all client limits. Your data carries over seamlessly.",
  },
];

const allFaqs = [...essentialFaqs, ...secondaryFaqs];

function useFAQSchema() {
  useEffect(() => {
    const existingScript = document.querySelector("script[data-faq-schema]");
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
      const el = document.querySelector("script[data-faq-schema]");
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
              Common Questions
            </h2>
            <p className="mx-auto max-w-[50rem] text-lg text-muted-foreground font-normal leading-relaxed mb-12">
              Quick answers about pricing, security, and how Ledger Stash
              works day-to-day.
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
