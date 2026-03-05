import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect } from "react";

const faqs = [
  {
    question: "What is LedgerStash?",
    answer:
      "LedgerStash is a secure client vault built for boutique accounting and tax firms. It lets you exchange sensitive documents, manage PBC task lists, and communicate with clients — all in one organized, white-labeled portal.",
  },
  {
    question: "How do my clients access the vault?",
    answer:
      "You invite clients by email. They receive a branded invitation, create a simple account, and immediately see their PBC tasks and document folders. No complex onboarding — it's a frictionless experience designed for high-net-worth clients.",
  },
  {
    question: "Is it secure enough for tax documents?",
    answer:
      "Yes. LedgerStash uses AES-256 encryption at rest, TLS 1.2+ encryption in transit, role-based access control, and per-client data isolation. Only your firm and the specific client can access their documents — never other clients. Our security practices are designed to help firms meet the requirements of IRS Publication 4557, the FTC Safeguards Rule, and the Gramm-Leach-Bliley Act (GLBA).",
  },
  {
    question: "Does LedgerStash comply with IRS Publication 4557?",
    answer:
      "LedgerStash is built to help tax preparers and accounting firms meet the data security requirements outlined in IRS Publication 4557 (Safeguarding Taxpayer Data). This includes encrypted storage, access controls, secure transmission of documents, and data isolation between clients. While compliance ultimately depends on your firm's overall security practices, LedgerStash provides the technical safeguards the IRS expects.",
  },
  {
    question: "What about the FTC Safeguards Rule and GLBA?",
    answer:
      "The FTC Safeguards Rule (part of the Gramm-Leach-Bliley Act) requires financial institutions — including tax preparers and accounting firms — to implement safeguards for customer information. LedgerStash supports this with encrypted document storage, role-based access, authentication requirements, and audit-ready records. We're designed to be a core part of your firm's Written Information Security Plan (WISP).",
  },
  {
    question: "Do I need SOC 2 certification to use LedgerStash?",
    answer:
      "No. SOC 2 certification is not legally required for CPA or accounting firms. What is required is compliance with IRS Publication 4557, the FTC Safeguards Rule, and GLBA — all of which LedgerStash is designed to support. SOC 2 is a voluntary trust framework typically pursued by technology vendors. LedgerStash's infrastructure provider maintains SOC 2 Type II certification, which means the underlying systems meet rigorous security and availability standards.",
  },
  {
    question: "Can I use it for engagement letters and agreements?",
    answer:
      "Absolutely. Create PBC tasks for clients to review and sign engagement letters, fee agreements, or authorization forms. Track completion status from your firm dashboard and automate follow-ups.",
  },
  {
    question: "How is this different from email or shared drives?",
    answer:
      "Email is insecure and unorganized. Shared drives lack task tracking and client-specific access. LedgerStash gives you per-client folders, PBC list management, Busy Season auto-reminders, and a professional branded experience that builds client trust.",
  },
  {
    question: "Can my team members access the portal too?",
    answer:
      "Yes. On the Boutique Firm and Enterprise Vault plans, you can invite team members to your firm. They can manage clients, upload documents, and assign tasks alongside you.",
  },
  {
    question: "What types of files can clients upload?",
    answer:
      "Clients can upload any file type — PDFs, images, spreadsheets, Word documents, and more. There's no restriction on file formats. All files are encrypted at rest and in transit.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes. Every plan includes a 14-day free trial with full access. No credit card required to start. You'll have your vault live in under 5 minutes.",
  },
  {
    question: "How is LedgerStash different from SmartVault and TaxDome?",
    answer:
      "LedgerStash is purpose-built for solo CPAs and boutique firms, while SmartVault and TaxDome are enterprise-grade solutions designed for larger practices.\n\nPricing: LedgerStash starts at $29/month ($348/year) with no user minimums. SmartVault charges $50–75/user/month with a 3-user minimum ($1,800–2,700/year). TaxDome costs $700–900/year per seat with a 3-year commitment.\n\nComplexity: LedgerStash sets up in minutes with no training. SmartVault requires days to weeks, and TaxDome requires 6–8 weeks of dedicated onboarding.\n\nClient Experience: LedgerStash clients access documents without creating an account or remembering passwords. SmartVault and TaxDome both require client accounts.\n\nAccounting Language: LedgerStash uses 'PBC List Management' — the terminology CPAs actually use. SmartVault and TaxDome use generic 'File Request' tools.",
  },
  {
    question: "Should I switch from SmartVault or TaxDome to LedgerStash?",
    answer:
      "If you're currently using SmartVault or TaxDome but only using the document vault and client portal features, switching to LedgerStash could save you significant money and reduce complexity.\n\nAnnual Cost Comparison (Solo CPA): SmartVault costs $1,800–2,700/year (3-user minimum). TaxDome costs $700–900/year. LedgerStash costs just $348/year with no minimums.\n\nThat's $1,452–2,352/year in savings vs. SmartVault and $352–552/year vs. TaxDome — plus faster setup, frictionless client experience, and accounting-specific PBC list management.\n\nMigration is easy: We'll help you migrate your documents and set up your clients in minutes.",
  },
  {
    question: "What if I need practice management features in the future?",
    answer:
      "LedgerStash is designed to do one thing exceptionally well: secure document exchange and PBC management. If you later need billing, CRM, or other practice management features, you can integrate LedgerStash with your existing tools or upgrade to a more comprehensive platform.\n\nYou're not paying for features you'll never use, and you're not locked into a bloated ecosystem. You can build your tech stack around your actual needs, and LedgerStash will be a core part of it.",
  },
  {
    question: "Is LedgerStash secure enough compared to larger competitors?",
    answer:
      "Yes. LedgerStash meets the same compliance standards as enterprise solutions: IRS Publication 4557 compliance for tax document storage, FTC Safeguards Rule compliance for protecting client data, GLBA adherence for financial data, bank-grade encryption at rest and in transit, and full audit trails with timestamps and IP tracking for every file.\n\nYour clients' sensitive documents are as secure with LedgerStash as they would be with any enterprise solution — but at a price that makes sense for your practice size.",
  },
];

function useFAQSchema() {
  useEffect(() => {
    const existingScript = document.querySelector('script[data-faq-schema]');
    if (existingScript) return;

    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
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

  return (
    <section id="faq" className="pt-24 pb-24 bg-background">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="text-[2.25rem] sm:text-[2.5rem] font-bold text-foreground leading-[1.2] mb-4">
              Frequently asked questions
            </h2>
            <p className="mx-auto max-w-[50rem] text-lg text-muted-foreground font-normal leading-relaxed mb-12">
              Everything you need to know about LedgerStash
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
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
          </Accordion>
        </div>
      </div>
    </section>
  );
}
