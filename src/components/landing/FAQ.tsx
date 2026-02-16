import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect } from "react";

const faqs = [
  {
    question: "What is document collection software?",
    answer:
      "Document collection software helps businesses send, track, and manage completed and signed documents in one place. Instead of emailing PDFs and manually tracking responses, you can see who has completed or signed a document, who hasn't, and download organized records anytime.\n\nAttestly combines document sending, form completion, signature capture, reminders, and audit-ready proof in one simple workflow.",
  },
  {
    question: "What types of documents can I send with Attestly?",
    answer:
      "You can send a wide range of documents, including employee policies and acknowledgments, client intake forms, vendor agreements, waivers and consent forms, contracts, and read-and-acknowledge documents.\n\nAttestly works for internal teams and external recipients alike.",
  },
  {
    question: "Can I create fillable forms from a PDF?",
    answer:
      "Yes. Upload a PDF and Attestly can auto-detect form fields to quickly convert it into a fillable document. You can add required fields, dates, and signatures in minutes — no complex setup required.\n\nAll responses are stored in a structured format and tied to a secure activity log.",
  },
  {
    question: "Is Attestly a replacement for DocuSign?",
    answer:
      "Attestly is designed for businesses that need simple, structured document tracking with built-in proof — without the complexity of enterprise contract platforms.\n\nIf you primarily need lightweight document requests, signature tracking, automated reminders, and organized records, Attestly is often a simpler and more cost-effective option.",
  },
  {
    question: "Are digital signatures legally binding?",
    answer:
      "Yes. Electronic signatures are legally binding in most jurisdictions under laws such as the ESIGN Act and UETA in the United States.\n\nAttestly includes timestamping, IP tracking, and full activity logs to help provide defensible proof of document completion.",
  },
  {
    question: "Can I export records and activity logs?",
    answer:
      "Yes. You can download completed PDF copies, export structured response data via CSV, and access full activity logs with timestamps and IP tracking at any time.\n\nThis makes it easy to provide documentation if proof is ever required.",
  },
  {
    question: "Do signers need to create an account?",
    answer:
      "No. Recipients can review documents, complete required fields, and sign securely without creating an account or password.\n\nThis reduces friction and improves completion rates.",
  },
  {
    question: "Is Attestly secure?",
    answer:
      "Yes. Attestly uses encrypted data storage and secure infrastructure to protect your documents and recipient information.\n\nSecurity and data protection are built into every step of the workflow.",
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
    <section className="pt-24 pb-24 bg-background">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="text-[2.25rem] sm:text-[2.5rem] font-bold text-foreground leading-[1.2] mb-4">
              Frequently asked questions
            </h2>
            <p className="mx-auto max-w-[50rem] text-lg text-muted-foreground font-normal leading-relaxed mb-12">
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