import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Bot, BarChart3, ShieldCheck } from "lucide-react";

const aiCards = [
  {
    icon: Bot,
    title: 'Your Clients Stop Asking "What Do I Still Need to Send?"',
    description:
      'When a client asks the AI "what do I still need to upload?" at 10pm — it answers with their actual list. Not a generic response. Their specific checklist, based on what they\'ve already uploaded and what\'s still missing. Tax advice is explicitly blocked. Every conversation is logged and reviewable by you.',
  },
  {
    icon: BarChart3,
    title: "Your Practice Intelligence Bot",
    description:
      'Ask your dashboard "which clients haven\'t uploaded anything in 7 days?" or "who\'s missing a W-2 across my entire book?" and get real answers based on live data. It can take action — sending reminders directly from the conversation. No more manually scanning your dashboard during busy season.',
  },
  {
    icon: ShieldCheck,
    title: "Every AI Conversation Logged",
    description:
      "Every client interaction with the AI is timestamped, stored, and linked to that client's record. Review exactly what your clients asked and what they were told — directly from the client detail page. Full compliance coverage on every exchange.",
  },
];

export function AISection() {
  return (
    <section className="py-24 bg-card">
      <div className="container">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-14">
            <h2 className="text-[2.25rem] sm:text-[2.5rem] font-bold text-foreground leading-[1.2] mb-4">
              The AI That Works While You Sleep
            </h2>
            <p className="mx-auto max-w-[50rem] text-lg text-muted-foreground font-normal leading-relaxed">
              No competitor offers this. Every Ledger Stash plan includes two purpose-built AI assistants — one for your clients, one for your practice.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {aiCards.map((card) => (
              <div
                key={card.title}
                className="group p-8 rounded-2xl bg-background border border-border shadow-sm hover:shadow-md hover:border-accent/30 transition-all duration-300"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent mb-5">
                  <card.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>

          {/* Bottom statement */}
          <div className="rounded-xl border border-accent/20 bg-accent/5 p-6 text-center mb-8">
            <p className="text-sm font-medium text-foreground">
              SmartVault, TaxDome, and Liscio don&rsquo;t have this. Context-aware AI that knows each client&rsquo;s specific checklist is a Ledger Stash exclusive.
            </p>
          </div>

          <div className="text-center">
            <Button variant="hero" size="xl" asChild>
              <Link to="/signup" className="gap-2">
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
