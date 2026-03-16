import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateBlueOceanPdf } from "@/lib/generateBlueOceanPdf";

const essentialFaqs = [
  {
    question: "Is LedgerStash secure enough for sensitive tax documents?",
    answer:
      "Absolutely. We use bank-grade AES-256 encryption at rest and TLS 1.3 in transit. LedgerStash is built to exceed IRS Pub 4557, FTC Safeguards, and GLBA requirements. Your data is protected by the same standards used by the world's largest financial institutions.",
  },
  {
    question: 'Why do you price by active clients instead of per-user "seats"?',
    answer:
      "Because we believe software should help you grow, not tax you for it. Most portals charge $1,000+ per staff member. We want you to be able to add interns, admins, and partners without checking your bank account first. You only pay for the clients you are actively serving.",
  },
  {
    question: "Do my clients really not need a password or an account?",
    answer:
      "Correct. We use secure, time-sensitive Magic Links sent directly to their verified email. This eliminates the #1 cause of client friction: forgotten passwords. If they can open an email, they can securely upload their documents to you in seconds.",
  },
  {
    question: "How is this actually different from TaxDome or SmartVault?",
    answer:
      'Those are "Enterprise" platforms built for 100-person firms with 6-week onboarding cycles. LedgerStash is built specifically for the boutique firm. We\'ve stripped away the bloat and the "per-seat" pricing to give you a lightning-fast system you can set up in 5 minutes.',
  },
  {
    question: "What happens if I outgrow my current plan?",
    answer:
      'You can upgrade (or downgrade) at any time with one click. If you hit your client limit, we\'ll simply nudge you to move to the next tier. You\'ll never lose access to your files, and we\'ll never charge you a surprise "overage" fee.',
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
      "All standard formats: PDF, JPEG, PNG, HEIC, Excel spreadsheets, scanned documents, and more. Clients drag and drop from their computer or phone.",
  },
  {
    question: "Can I send engagement letters through LedgerStash?",
    answer:
      "Yes. Upload your engagement letter, send it to specific clients, and track exactly who has signed and when. Unsigned clients get automated follow-ups on your schedule — with a full audit trail.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes — 14 days, full access, no credit card required. Set up your vault, invite a test client, and see the workflow in action before you commit.",
  },
  {
    question: "Can my team members access the portal?",
    answer:
      "Yes — every plan includes unlimited staff seats. Add staff, interns, and partners with role-based permissions. You'll never pay a per-seat fee.",
  },
];

const allFaqs = [...essentialFaqs, ...secondaryFaqs];

const faqSchema = {
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

function FAQSchema() {
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
    </Helmet>
  );
}

export function FAQ() {
  const [showMore, setShowMore] = useState(false);

  return (
    <>
    <FAQSchema />
    <section id="faq" className="pt-24 pb-24 bg-background">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="text-[2.25rem] sm:text-[2.5rem] font-bold text-foreground leading-[1.2] mb-4">
              Everything You Need to Know
            </h2>
            <p className="mx-auto max-w-[50rem] text-lg text-muted-foreground font-normal leading-relaxed mb-12">
              Quick, transparent answers about security, the "Success Tax," and how Magic Links protect your firm's margins.
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

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Have a technical question?{" "}
            <a href="/contact#form" className="text-accent hover:underline">Message Us</a>{" "}
            or download our{" "}
            <button onClick={() => generateBlueOceanPdf()} className="text-accent hover:underline">Switching Guide</button>.
          </p>

          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              onClick={() => setShowMore(!showMore)}
              className="text-muted-foreground hover:text-foreground gap-2"
            >
              {showMore ? "Show fewer questions" : "View All Frequently Asked Questions"}
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
    </>
  );
}
