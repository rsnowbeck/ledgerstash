import { Users, FileText, Send, BarChart3, Download, Shield, Clock, Bell } from "lucide-react";

interface Feature {
  icon: any;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Users,
    title: "PBC Lists That Speak CPA",
    description:
      "Create task lists using the exact terminology your clients understand — W-2s, K-1s, bank statements, receipts. No generic 'file requests.'",
  },
  {
    icon: Shield,
    title: "Encrypted Vault, Not a Shared Drive",
    description:
      "AES-256 encryption at rest, TLS 1.3 in transit, per-client folders, and version tracking. Meets IRS 4557 and FTC Safeguards without extra work.",
  },
  {
    icon: Clock,
    title: "Busy Season on Auto-Pilot",
    description:
      "Set it once: automated reminders chase missing documents on your schedule. Clients who haven't uploaded get nudged — you don't lift a finger.",
  },
  {
    icon: Send,
    title: "Zero Friction for Clients",
    description:
      "Clients click a secure link, see exactly what's needed, drag-and-drop files, done. No accounts to create. No passwords to reset. No app to download.",
  },
  {
    icon: BarChart3,
    title: "One Dashboard, Every Client",
    description:
      "See who's uploaded, who's overdue, and what's missing — across your entire book of business. Prioritize follow-ups in seconds, not hours.",
  },
  {
    icon: Bell,
    title: "Your Brand, Not Ours",
    description:
      "Add your firm logo, brand colors, and sender name. Clients see a professional portal from your firm — they'll never know we exist.",
  },
  {
    icon: Download,
    title: "Audit-Ready in One Click",
    description:
      "Export organized document packages with timestamps, IP addresses, and full activity logs. Every acknowledgment includes a downloadable ESIGN-compliant PDF certificate.",
  },
  {
    icon: FileText,
    title: "Engagement Letters, Tracked",
    description:
      "Send engagement letters and fee agreements through the vault. See who signed, when, and from where — then auto-remind anyone who hasn't.",
  },
];

export function Features() {
  return (
    <section id="features" className="pt-24 pb-24 bg-card">
      <div className="container">
        <div className="text-center">
          <h2 className="text-[2.25rem] sm:text-[2.5rem] font-bold text-foreground leading-[1.2] mb-4">
            Replace Email Attachments With a Real System
          </h2>
          <p className="mx-auto max-w-[50rem] text-lg text-muted-foreground font-normal leading-relaxed mb-12">
            Everything a solo CPA or boutique firm needs to collect, organize, and safeguard client documents — without the enterprise price tag or setup headache.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-7 rounded-xl bg-background border border-border hover:border-accent/50 transition-all duration-300"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
