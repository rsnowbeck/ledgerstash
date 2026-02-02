import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect } from "react";

const faqs = [
  {
    question: "Is Attestly a good DocuSign alternative?",
    answer:
      "Yes. Attestly is the best DocuSign alternative for HR compliance and policy acknowledgments. While DocuSign focuses on contract negotiations with multiple signature fields, Attestly is purpose-built for employee handbook signatures, policy attestations, and training acknowledgments. It's simpler, faster, and up to 80% more affordable than DocuSign for compliance use cases.",
  },
  {
    question: "What is employee handbook software?",
    answer:
      "Employee handbook software helps organizations distribute handbooks and collect legally binding acknowledgment signatures from employees. Attestly is employee handbook software that lets recipients sign with one click—no accounts needed—while creating audit-ready proof with timestamps and IP addresses for HR compliance.",
  },
  {
    question: "How does policy acknowledgment software work?",
    answer:
      "Policy acknowledgment software automates the collection of employee signatures on company policies. Attestly sends secure email links to recipients, who can review the policy and sign instantly. Each signature captures timestamp, IP address, and browser information for complete audit trails. No signer accounts or passwords required.",
  },
  {
    question: "Are digital signatures legally binding for compliance?",
    answer:
      "Yes. Digital signatures collected through Attestly are legally defensible under the ESIGN Act and UETA. Each signature includes a timestamp, IP address, browser information, and the exact document version acknowledged. These records meet audit and compliance requirements for employee handbooks, NDAs, training acknowledgments, and policy sign-offs.",
  },
  {
    question: "How does Attestly compare to Adobe Sign?",
    answer:
      "Adobe Sign is designed for complex contract workflows. Attestly is purpose-built as an Adobe Sign alternative for simpler compliance needs—employee handbook signatures, policy attestations, and training acknowledgments. It's faster to set up, easier for recipients (no accounts needed), and significantly more affordable for HR compliance use cases.",
  },
  {
    question: "What is attestation tracking software?",
    answer:
      "Attestation tracking software monitors who has acknowledged policies, training, or compliance requirements. Attestly provides real-time dashboards showing signature status, automated reminders for outstanding signatures, and exportable audit reports—everything you need to prove compliance during audits.",
  },
  {
    question: "How much does Attestly cost compared to DocuSign?",
    answer:
      "Attestly offers a 14-day free trial with no credit card required. Paid plans start at $29/month (Starter) for up to 100 recipients. The Pro plan at $79/month includes 500 recipients and custom branding. This is typically 50-80% less than DocuSign for policy acknowledgment use cases. Enterprise pricing is available.",
  },
  {
    question: "Do signers need to create an account to sign?",
    answer:
      "No. Unlike DocuSign and many HR platforms, Attestly signers receive a secure email link and can review and acknowledge documents instantly—no account creation, passwords, or app downloads required. This dramatically improves completion rates for employee handbook and policy signatures.",
  },
  {
    question: "Why use Attestly instead of my HR platform (ADP, Paylocity, BambooHR)?",
    answer:
      "HR platforms include acknowledgments as a small feature within larger systems. Attestly is dedicated policy acknowledgment software built for fast, audit-ready compliance tracking. It also supports contractors, vendors, and anyone outside your HR system—critical for comprehensive compliance coverage.",
  },
  {
    question: "What types of documents can I send for signature?",
    answer:
      "Attestly supports any document requiring acknowledgment: employee handbooks, codes of conduct, privacy policies (HIPAA, GDPR, CCPA), safety training attestations, NDAs, vendor agreements, confidentiality agreements, and annual policy renewals. You can attach PDFs for recipients to review before signing.",
  },
  {
    question: "How do automated reminders work?",
    answer:
      "Attestly automatically sends reminder emails to recipients who haven't signed their employee handbook or policy documents. You configure reminder intervals after the initial request. This eliminates manual follow-up and significantly improves completion rates for compliance deadlines.",
  },
  {
    question: "Can I export signature records for audits?",
    answer:
      "Yes. Attestly generates PDF proof documents that include the signer's name, email, timestamp, IP address, browser information, and the exact policy or handbook version they acknowledged. You can export individual records or bulk export for audits and legal proceedings—essential for HR compliance.",
  },
  {
    question: "Is Attestly secure for employee data?",
    answer:
      "Yes. Attestly uses bank-level encryption for data at rest and in transit. Each signing link is unique and expires after use. We follow SOC 2 Type II compliant practices and are GDPR compliant. Your employee compliance data is stored securely with regular backups.",
  },
  {
    question: "How do I get started with Attestly?",
    answer:
      "Sign up for a free 14-day trial—no credit card required. Create your first employee handbook or policy requirement, add recipients (manually or via CSV import), and send signature requests in minutes. Most HR teams are fully set up within 5 minutes.",
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