import { Building2, Handshake, FileText, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const useCases = [
  {
    icon: Building2,
    title: "Track Employee Acknowledgments",
    description:
      "Track employee acknowledgments, recurring policy updates, and proof of completion — without chasing signatures or managing spreadsheets.",
    link: "/signup",
  },
  {
    icon: Handshake,
    title: "Manage Contractor & Vendor Agreements",
    description:
      "Collect agreements, certifications, and confirmations from contractors and vendors in one organized, trackable system.",
    link: "/signup",
  },
  {
    icon: FileText,
    title: "Simplify Client Intake Forms",
    description:
      "Send intake forms, waivers, and agreements before appointments — and keep structured records with built-in signature proof.",
    link: "/signup",
  },
];

export function UseCases() {
  return (
    <section className="pt-24 pb-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-[2.25rem] sm:text-[2.5rem] font-bold text-foreground leading-[1.2] mb-4">
            Built for How You Work
          </h2>
          <p className="mx-auto max-w-[50rem] text-lg text-muted-foreground font-normal leading-relaxed">
            Attestly adapts to your workflow — whether you're managing employee
            policies, contractor documentation, or client forms.
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
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                {useCase.description}
              </p>
              <Link
                to={useCase.link}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
              >
                Learn More
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
