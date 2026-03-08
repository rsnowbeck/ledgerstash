import { FileText, Receipt, Briefcase } from "lucide-react";

const useCases = [
  {
    icon: Receipt,
    title: "Busy Season Document Collection",
    description:
      "Create per-client PBC checklists for W-2s, 1099s, K-1s, and receipts. Clients upload to organized folders via a secure link — no email chains, no missing files, no excuses.",
  },
  {
    icon: FileText,
    title: "Engagement Letters & Fee Agreements",
    description:
      "Send engagement letters through the vault with ESIGN-compliant tracking. See who signed, who hasn't, and auto-remind the rest — with a PDF audit trail for every signature.",
  },
  {
    icon: Briefcase,
    title: "Year-Round Client Onboarding",
    description:
      "New client? Send them a branded portal link with a checklist of everything you need — EIN letters, prior returns, bank access. They complete it at their pace. You track it in real time.",
  },
];

export function UseCases() {
  return (
    <section className="pt-24 pb-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-[2.25rem] sm:text-[2.5rem] font-bold text-foreground leading-[1.2] mb-4">
            Built for the Way Accountants Actually Work
          </h2>
          <p className="mx-auto max-w-[50rem] text-lg text-muted-foreground font-normal leading-relaxed">
            Whether it's January or July, Ledger Stash keeps your document
            collection organized, automated, and audit-ready.
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
