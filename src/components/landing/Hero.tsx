import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Shield, Clock, Lock, CheckCircle2 } from "lucide-react";

const featureCards = [
  {
    icon: Shield,
    title: "No-Login Client Vault",
    description:
      "Clients upload in seconds via secure upload links. No accounts to create, no passwords to reset.",
  },
  {
    icon: Clock,
    title: "No Per-User Fees",
    description:
      "Pricing scales by active clients — not seats — so your whole team is included at no extra cost.",
  },
  {
    icon: ShieldCheck,
    title: "Secure PBC Management",
    description:
      "Track \"Provided By Client\" checklists so clients know exactly what to upload and you always see what's missing.",
  },
];

const trustItems = [
  "IRS 4557 · FTC Safeguards · GLBA Ready",
  "No client accounts required",
  "Priced by clients, not users (unlimited team members)",
];

export function Hero() {
  return (
    <section className="section-hero pt-20 lg:pt-28 pb-16 lg:pb-24">
      <div className="container">
        <div className="mx-auto max-w-5xl text-center">
          {/* Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2 text-sm text-muted-foreground mb-8 shadow-sm animate-slide-up">
            <Lock className="h-3.5 w-3.5 text-accent" />
            Built for accounting firms, CPAs &amp; controllers — simple, secure, priced by clients
          </div>

          {/* Headline */}
          <h1 className="text-[2.1rem] font-extrabold tracking-tight leading-[1.12] text-foreground sm:text-[3.2rem] lg:text-[3.8rem] mb-5 animate-slide-up" style={{ animationDelay: "0.06s" }}>
            The Private Vault for Your
            <br />
            <span className="text-accent">Accounting Firm</span>
          </h1>

          {/* Subheader */}
          <p className="mx-auto max-w-[40rem] text-base text-muted-foreground mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Give clients a secure upload link — no logins. Collect sensitive documents, track PBC lists, and keep everything organized with pricing based on active clients, not seats.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 animate-slide-up" style={{ animationDelay: "0.16s" }}>
            <Button variant="hero" size="xl" asChild>
              <Link to="/signup" className="gap-2">
                Start 14-Day Free Trial
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <a href="#how-it-works" className="gap-2">
                See How It Works
              </a>
            </Button>
          </div>

          {/* Trust Row */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center text-sm text-muted-foreground mb-16 animate-slide-up" style={{ animationDelay: "0.22s" }}>
            {trustItems.map((item) => (
              <div key={item} className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: "0.28s" }}>
            {featureCards.map((card) => (
              <div
                key={card.title}
                className="group p-8 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md hover:border-accent/30 transition-all duration-300 text-center"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent mb-5">
                  <card.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
