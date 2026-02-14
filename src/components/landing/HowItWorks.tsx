import { CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Add your recipients",
    description: "Import employees, contractors, or vendors and keep your compliance list organized from day one.",
    details: ["Add recipients manually or bulk import via CSV", "Organize by groups or roles", "No recipient limits on Pro plan"]
  },
  {
    number: "02",
    title: "Create a requirement",
    description: "Create the policy, training, or compliance item recipients need to complete.",
    details: ["Attach a document for read-and-acknowledge workflows", "Or upload a PDF and add fillable fields", "Add required inputs, dates, or signatures", "Set one-time or recurring requirements", "Preview before publishing"]
  },
  {
    number: "03",
    title: "Publish & send",
    description: "Generate secure signing links and send them instantly.",
    details: ["Unique single-use tokens", "Automatic email delivery", "Custom email templates", "No login required for recipients"]
  },
  {
    number: "04",
    title: "Track & export",
    description: "Monitor completion status in real time and export everything you need for audits.",
    details: ["Live compliance dashboard", "Automated reminders", "Download completed PDF copies", "Export structured response data via CSV", "Full audit trail with timestamps and IP tracking"]
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="pt-12 lg:pt-20 pb-20 lg:pb-32">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-[2.75rem] mb-3">
            How Attestly simplifies compliance
          </h2>
          <p className="mx-auto max-w-[46rem] text-lg text-muted-foreground">
            Get started in minutes. No complex setup. No training required.
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
