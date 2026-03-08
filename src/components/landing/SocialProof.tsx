import { Shield, Star, Award } from "lucide-react";

const testimonials = [
  {
    quote: "Ledger Stash replaced our messy email chains with a professional client vault. Our clients love how simple it is — no accounts, no passwords.",
    name: "Sarah M.",
    title: "Solo CPA, Denver",
    initials: "SM",
  },
  {
    quote: "During busy season, the automated reminders saved us hours every week. Clients actually submitted documents on time for the first time.",
    name: "David R.",
    title: "Tax Partner, Boutique Firm",
    initials: "DR",
  },
  {
    quote: "We evaluated SmartVault and TaxDome but the per-user pricing was a dealbreaker. Ledger Stash gives us everything we need at a fraction of the cost.",
    name: "Jennifer L.",
    title: "Managing Partner, Growing Practice",
    initials: "JL",
  },
];

const trustBadges = [
  { icon: Shield, label: "AES-256 Encryption" },
  { icon: Award, label: "IRS 4557 Compliant" },
  { icon: Star, label: "Built for Tax Season 2026" },
];

export function SocialProof() {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-[2.25rem] sm:text-[2.5rem] font-bold text-foreground leading-[1.2] mb-4">
            Trusted by Accounting Professionals
          </h2>
          <p className="mx-auto max-w-[50rem] text-lg text-muted-foreground font-normal leading-relaxed">
            See why CPAs and tax professionals choose Ledger Stash for secure client document management.
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
              <span className="text-sm font-medium text-foreground">{badge.label}</span>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="p-6 rounded-xl border border-border bg-card"
            >
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-5 italic">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{t.initials}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
