import { FileText, Receipt, Briefcase } from "lucide-react";

const useCases = [
  {
    icon: Receipt,
    title: "Tax Document Collection",
    description:
      "Collect W-2s, 1099s, K-1s, receipts, and supporting documents from clients in organized folders. No more chasing email attachments during busy season.",
  },
  {
    icon: FileText,
    title: "Engagement Letters & Agreements",
    description:
      "Send engagement letters, fee agreements, and authorization forms. Track who has signed and automate follow-ups for the rest.",
  },
  {
    icon: Briefcase,
    title: "Client Onboarding",
    description:
      "Streamline new client setup with PBC task lists, document requests, and a branded portal experience that builds trust from day one.",
  },
];

export function UseCases() {
  return (
    <section className="pt-24 pb-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-[2.25rem] sm:text-[2.5rem] font-bold text-foreground leading-[1.2] mb-4">
            Built for Accounting Workflows
          </h2>
          <p className="mx-auto max-w-[50rem] text-lg text-muted-foreground font-normal leading-relaxed">
            VaultLedger adapts to how your firm works — from busy season document 
            collection to year-round client management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {useCases.map((useCase) => (
            <div
              key={useCase.title}
              className="group p-8 rounded-xl bg-card border border-border hover:border-accent/50 transition-all duration-300"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent mb-5 group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300">
                <useCase.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground text-lg mb-3">
                {useCase.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
