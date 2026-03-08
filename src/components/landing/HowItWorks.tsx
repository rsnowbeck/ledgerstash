import { CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Add Your Clients",
    description:
      "Import your client list via CSV or add them one by one. Each client gets their own private, organized vault in under a minute.",
    details: [
      "Bulk CSV import or manual entry",
      "Each client gets a separate secure vault",
      "Individual or business client types",
    ],
  },
  {
    number: "02",
    title: "Build Your PBC Checklist",
    description:
      "Tell each client exactly what documents to provide — W-2s, K-1s, bank statements, receipts. Set due dates, mark priorities, attach reference files.",
    details: [
      "Pre-built templates for common engagements",
      "Custom due dates and priority levels",
      "Attach sample documents for clarity",
      "Clients see a clear, numbered task list",
    ],
  },
  {
    number: "03",
    title: "Send a Secure Link",
    description:
      "Clients receive a branded email with a one-click magic link. They land on your white-labeled portal, see their tasks, and start uploading. No account needed.",
    details: [
      "Your firm's logo and brand colors",
      "Drag-and-drop file uploads",
      "Works on desktop and mobile",
      "No passwords, no app downloads",
    ],
  },
  {
    number: "04",
    title: "Track, Remind & Close",
    description:
      "Watch your dashboard light up as documents roll in. Automated reminders handle the stragglers. When you're ready, export an audit-ready package.",
    details: [
      "Real-time completion tracking",
      "Configurable auto-reminders",
      "One-click audit-ready export",
      "Full trail: timestamps, IP, browser",
    ],
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="pt-24 pb-24">
      <div className="container">
        <div className="text-center">
          <h2 className="text-[2.25rem] sm:text-[2.5rem] font-bold text-foreground leading-[1.2] mb-4">
            Up and Running in 5 Minutes
          </h2>
          <p className="mx-auto max-w-[50rem] text-lg text-muted-foreground font-normal leading-relaxed mb-12">
            No onboarding calls. No training videos. No IT department required.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="card-elevated p-9 rounded-2xl relative overflow-hidden group"
            >
              <div className="absolute top-6 right-6 text-6xl font-bold text-muted/20 select-none">
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
                    <li
                      key={detail}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
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
