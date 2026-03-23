import { Clock, Zap, DollarSign, Shield, Award } from "lucide-react";

const cards = [
  {
    icon: Clock,
    metric: "10+ Hours Recovered",
    copy: "The average boutique firm spends 25% of their week chasing documents via email. We automated the nudge so you can focus on the advisory.",
  },
  {
    icon: Zap,
    metric: "100% Barrier-Free",
    copy: "Clients don't want another app or a 'secure' password they'll forget. Magic Links remove the friction that causes late filings.",
  },
  {
    icon: DollarSign,
    metric: "$7,836 Saved Over 3 Years",
    copy: "A solo CPA with 3 seasonal staff pays $9,600 to TaxDome over 3 years — $800/seat, paid upfront annually. The same firm on Ledger Stash pays $1,764. The math isn't subtle.",
  },
];

const trustBadges = [
  { icon: Shield, label: "AES-256 Encrypted" },
  { icon: Award, label: "IRS 4557 Compliant" },
  { icon: Shield, label: "FTC Safeguards Ready" },
];

export function SocialProof() {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-[2.25rem] sm:text-[2.5rem] font-bold text-foreground leading-[1.2] mb-4">
            The Cost of Doing Business as Usual
          </h2>
          <p className="mx-auto max-w-[50rem] text-lg text-muted-foreground font-normal leading-relaxed">
            Your clients aren't difficult — your workflow is. Here's what changes when you stop duct-taping it together.
          </p>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-6 mb-14">
          {trustBadges.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2 px-5 py-3 rounded-full border border-border bg-card shadow-sm"
            >
              <badge.icon className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-foreground">
                {badge.label}
              </span>
            </div>
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {cards.map((card) => (
            <div
              key={card.metric}
              className="p-6 rounded-xl border border-border bg-card flex flex-col"
            >
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <card.icon className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {card.metric}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {card.copy}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
