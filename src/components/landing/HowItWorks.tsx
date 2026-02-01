import { CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Add your recipients",
    description: "Import employees, contractors, or vendors. Add names and emails manually, or bulk import via CSV.",
    details: ["Add recipients manually or import via CSV", "Organize by groups or roles", "No recipient limits on Pro plan"]
  },
  {
    number: "02",
    title: "Create a requirement",
    description: "Define what needs to be acknowledged. Attach a policy document, set a due date, and choose one-time or recurring.",
    details: ["Attach policy documents (PDF, Word, or image files)", "Set recurring acknowledgments", "Preview before publishing"]
  },
  {
    number: "03",
    title: "Publish & send",
    description: "With one click, generate secure signing links and email them to selected recipients.",
    details: ["Unique single-use tokens", "Automatic email delivery", "Custom email templates"]
  },
  {
    number: "04",
    title: "Track & export",
    description: "Watch completion status in real-time. Send reminders. Export audit-ready proof anytime.",
    details: ["Live compliance dashboard", "PDF proof generation", "Full audit trail"]
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-32">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            How it works
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Get started in minutes. No complex setup, no training required.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="card-elevated p-8 relative overflow-hidden group"
            >
              <div className="absolute top-6 right-6 text-6xl font-bold text-muted/30 select-none">
                {step.number}
              </div>
              <div className="relative">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold mb-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {step.description}
                </p>
                <ul className="space-y-2">
                  {step.details.map((detail) => (
                    <li key={detail} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
