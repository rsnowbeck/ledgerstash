import { Users, FileText, Send, BarChart3, Download, Shield, Clock, Bell } from "lucide-react";

interface Feature {
  icon: any;
  title: string;
  description: string;
}

const collectionFeatures: Feature[] = [
  {
    icon: Users,
    title: "Stop Explaining What a W-2 Is",
    description:
      "Create task lists using the exact terminology your clients understand—W-2s, K-1s, bank statements, receipts. No more \"what do you need again?\" emails.",
  },
  {
    icon: Shield,
    title: "IRS-Compliant, Stress-Free Storage",
    description:
      "Bank-grade AES-256 encryption at rest and TLS 1.3 in transit. We meet IRS Pub 4557 and FTC Safeguards standards so you can sleep at night.",
  },
  {
    icon: Clock,
    title: "The Assistant That Never Sleeps",
    description:
      "Set it once: automated reminders chase missing documents on your schedule. Clients who haven't uploaded get nudged—you don't lift a finger.",
  },
  {
    icon: Send,
    title: "No More Password Support Calls",
    description:
      "Clients click a secure link, see exactly what's needed, drag-and-drop, and they're done. No accounts to create. No passwords to reset. No app to download.",
  },
];

const firmFeatures: Feature[] = [
  {
    icon: BarChart3,
    title: "See Your Entire Firm at a Glance",
    description:
      "One dashboard to see who's uploaded, who's overdue, and what's missing across your entire book of business. Prioritize follow-ups in seconds, not hours.",
  },
  {
    icon: Bell,
    title: "Look Like a 50-Person Firm",
    description:
      "Add your logo, brand colors, and custom sender name. Clients see a professional portal from your firm—they'll never know we exist.",
  },
  {
    icon: Download,
    title: "One-Click Compliance Exports",
    description:
      "Export organized document packages with timestamps, IP addresses, and full activity logs. Every folder includes a downloadable, audit-ready PDF certificate.",
  },
  {
    icon: FileText,
    title: "Sign, Track, and Start Working",
    description:
      "Send engagement letters and fee agreements through the vault. See who signed, when, and from where—then auto-remind anyone who hasn't.",
  },
];

const FeatureCard = ({ feature }: { feature: Feature }) => (
  <div className="group p-7 rounded-xl bg-background border border-border hover:border-accent/50 transition-all duration-300">
    <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300">
      <feature.icon className="h-5 w-5" />
    </div>
    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
  </div>
);

export function Features() {
  return (
    <section id="features" className="pt-24 pb-24 bg-card">
      <div className="container">
        {/* Super-Header */}
        <div className="text-center mb-6">
          <h2 className="text-[2.25rem] sm:text-[2.5rem] font-bold text-foreground leading-[1.2]">
            Replace Chaos With a Real System
          </h2>
        </div>

        {/* Section Sub-headline */}
        <p className="mx-auto max-w-[50rem] text-lg text-muted-foreground font-normal leading-relaxed text-center mb-16">
          Everything a boutique firm needs to collect, organize, and safeguard client documents — without the enterprise price tag or a 6-week setup headache.
        </p>

        {/* Row 1 Category Header */}
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] text-center mb-8">
          The Collection Workflow
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 mb-16">
          {collectionFeatures.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-border mx-auto max-w-xs mb-16" />

        {/* Row 2 Category Header */}
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] text-center mb-8">
          The Firm Management
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
          {firmFeatures.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
