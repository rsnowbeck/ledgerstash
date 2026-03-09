import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Shield, Clock, Lock, CheckCircle2 } from "lucide-react";

const featureCards = [
  {
    icon: Shield,
    title: "Clients Upload in Seconds",
    description:
      "Send a secure link. Clients upload W-2s, K-1s, and receipts without creating an account or remembering a password.",
  },
  {
    icon: Clock,
    title: "Your Whole Team — One Price",
    description:
      "Add every staff member, every intern, every partner. Zero per-user fees. You only pay based on active clients.",
  },
  {
    icon: ShieldCheck,
    title: "Stop Chasing Documents",
    description:
      "PBC checklists tell clients exactly what's missing. Automated reminders follow up so you don't have to.",
  },
];

const trustItems = [
  "IRS 4557 · FTC Safeguards · GLBA Ready",
  "No client accounts or passwords",
  "Unlimited team members on every plan",
];

export function Hero() {
  return (
    <section className="section-hero pt-20 lg:pt-28 pb-16 lg:pb-24">
      <div className="container">
        <div className="mx-auto max-w-5xl text-center">
          {/* Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2 text-sm text-muted-foreground mb-8 shadow-sm animate-slide-up uppercase tracking-wider font-medium">
            <Lock className="h-3.5 w-3.5 text-accent" />
            Secure Client Vault &amp; PBC Tracker
          </div>

          {/* Headline */}
          <h1 className="text-[2.1rem] font-extrabold tracking-tight leading-[1.12] text-foreground sm:text-[3.2rem] lg:text-[3.8rem] mb-5 animate-slide-up" style={{ animationDelay: "0.06s" }}>
            Stop Paying a{" "}
            <span className="text-accent">"Success Tax"</span>
            <br />
            on Your Staff.
          </h1>

          {/* Subheader */}
          <p className="mx-auto max-w-[44rem] text-base text-muted-foreground mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            The only document portal for boutique firms with{" "}
            <strong className="text-foreground font-semibold">Unlimited User Seats</strong>.
            Stop paying $1,000/year per user just to collect files from your clients.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4 animate-slide-up" style={{ animationDelay: "0.16s" }}>
            <Button variant="hero" size="xl" asChild>
              <Link to="/signup" className="gap-2">
                Start Your 14-Day Free Trial
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <a href="#how-it-works" className="gap-2">
                See How It Works
              </a>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mb-12 animate-slide-up" style={{ animationDelay: "0.18s" }}>
            No Credit Card Required | IRS Pub 4557 Compliant
          </p>

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
