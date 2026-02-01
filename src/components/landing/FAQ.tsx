import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Do I need a full HR platform to use Attestly?",
    answer:
      "No. Attestly is purpose-built for compliance acknowledgments and works alongside your existing HR or payroll tools.",
  },
  {
    question: "Why not just use Paylocity, ADP, or Rippling?",
    answer:
      "Those platforms include acknowledgments as part of a full HR system. Attestly is purpose-built for fast, audit-ready compliance tracking and can be used alongside existing HR tools.",
  },
  {
    question: "Is Attestly legally defensible for audits and disputes?",
    answer:
      "Yes. Attestly provides timestamped, signer-verified records designed to meet common audit and compliance requirements.",
  },
  {
    question: "Who is Attestly designed for?",
    answer:
      "Attestly is designed for teams that need simple, audit-ready compliance acknowledgments without the cost or complexity of full HR platforms. It's ideal for organizations that want a focused solution that works alongside existing HR or payroll tools.",
  },
  {
    question: "Do signers need an account or login?",
    answer:
      "No. Signers can acknowledge documents securely without creating an account or remembering passwords.",
  },
  {
    question: "Can Attestly work with our existing HR tools?",
    answer:
      "Yes. Attestly complements tools like Paylocity, ADP, and BambooHR by handling acknowledgments separately.",
  },
  {
    question: "What types of compliance does Attestly support?",
    answer:
      "Attestly is industry-agnostic and supports any policy or training that requires acknowledgment and audit-ready proof. Common use cases include employee handbooks and codes of conduct, privacy and security policies (HIPAA, GDPR/CCPA), safety training, NDAs, vendor agreements, and annual policy renewals.",
  },
];

export function FAQ() {
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
