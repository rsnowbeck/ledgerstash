import { CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Add Your Clients",
    description: "Import your client list or add them one by one. Each client gets their own secure, organized vault.",
    details: ["Add clients manually or bulk import via CSV", "Each client gets private folders", "No client limits on Enterprise plan"]
  },
  {
    number: "02",
    title: "Create PBC Task Lists",
    description: "Define exactly what documents each client needs to provide — W-2s, K-1s, receipts, engagement letters.",
    details: ["Use accounting-specific task templates", "Set due dates and priorities", "Attach reference documents", "Clients see clear action items"]
  },
  {
    number: "03",
    title: "Invite & Exchange",
    description: "Send branded invitations. Clients upload documents directly to their vault — no email attachments.",
    details: ["White-labeled client portal", "Drag-and-drop file uploads", "Automatic email notifications", "Frictionless client experience"]
  },
  {
    number: "04",
    title: "Track & Close",
    description: "Monitor completion across your entire book. Auto-remind stragglers. Export audit-ready packages.",
    details: ["Real-time firm dashboard", "Busy Season auto-reminders", "Download organized document packages", "Full audit trail with timestamps"]
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="pt-24 pb-24">
      <div className="container">
        <div className="text-center">
          <h2 className="text-[2.25rem] sm:text-[2.5rem] font-bold text-foreground leading-[1.2] mb-4">
            How Ledger Stash Works
          </h2>
          <p className="mx-auto max-w-[50rem] text-lg text-muted-foreground font-normal leading-relaxed mb-12">
            Get started in minutes. No complex setup. No training required.
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