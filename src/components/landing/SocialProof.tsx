import { Shield, Star, Award, Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "I used to spend 10+ hours a week chasing clients for documents over email. Now I send a link, and everything shows up in the vault — organized and on time.",
    name: "Sarah Mitchell, CPA",
    title: "Solo Practitioner · Denver, CO",
    initials: "SM",
    metric: "10+ hrs/week saved",
  },
  {
    quote:
      "Our clients are executives who refuse to create accounts for anything. Ledger Stash's no-login portal was the only solution they'd actually use.",
    name: "David Reyes, CPA",
    title: "Tax Partner · 6-person firm · Austin, TX",
    initials: "DR",
    metric: "100% client adoption",
  },
  {
    quote:
      "We compared SmartVault ($210/mo) and TaxDome ($800/yr per seat). Ledger Stash gave us everything we needed for $29/mo — with unlimited team members.",
    name: "Jennifer Lin, EA",
    title: "Managing Partner · Growing Practice · Seattle, WA",
    initials: "JL",
    metric: "85% cost savings",
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
            CPAs Who Stopped Chasing Documents
          </h2>
          <p className="mx-auto max-w-[50rem] text-lg text-muted-foreground font-normal leading-relaxed">
            Hear from firms that replaced email attachments, shared drives, and expensive portals with Ledger Stash.
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

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="p-6 rounded-xl border border-border bg-card flex flex-col"
            >
              {/* Metric callout */}
              <div className="inline-flex self-start items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent mb-4">
                {t.metric}
              </div>

              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className="h-4 w-4 fill-accent text-accent"
                  />
                ))}
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-5 italic flex-1">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {t.initials}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {t.name}
                  </p>
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
