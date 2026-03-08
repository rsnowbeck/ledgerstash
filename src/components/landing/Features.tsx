import { Users, FileText, Send, BarChart3, Download, Shield, Clock, Bell } from "lucide-react";

interface Feature {
  icon: any;
  title: string;
  description: string;
}

const features: Feature[] = [{
  icon: Users,
  title: "Secure PBC List Management",
  description: "Create and track 'Provided By Client' task lists using the specific language accountants use. Clients see exactly what to upload and when."
}, {
  icon: Shield,
  title: "Bank-Grade Compliance Vault",
  description: "Encrypted document storage with per-client folders, version tracking, and full audit trails. Your clients' data is safe at rest and in transit."
}, {
  icon: Clock,
  title: "Busy Season Auto-Pilot",
  description: "Automated reminders chase missing documents for you during busy season. Set it and forget it — your clients stay on track."
}, {
  icon: Send,
  title: "Frictionless Client Experience",
  description: "High-net-worth clients hate creating accounts. Ledger Stash makes it effortless — simple invites, no passwords to remember, instant access."
}, {
  icon: BarChart3,
  title: "Real-Time Firm Dashboard",
  description: "See every client's completion status at a glance. Track who's uploaded, who hasn't, and what's overdue across your entire book."
}, {
  icon: Bell,
  title: "White-Label Client Portal",
  description: "Your logo, your colors, your brand. Clients see your firm's identity — not ours. Build trust with a professional, branded experience."
}, {
  icon: Download,
  title: "Audit-Ready Export & Compliance",
  description: "Download organized document packages with timestamps, IP tracking, and full audit trails. Every acknowledgment is ESIGN & UETA compliant with downloadable PDF certificates."
}, {
  icon: FileText,
  title: "Engagement Letter Tracking",
  description: "Send engagement letters, fee agreements, and authorization forms. Track who has signed and automate follow-ups for the rest."
}];

export function Features() {
  return <section id="features" className="pt-24 pb-24 bg-card">
      <div className="container">
        <div className="text-center">
          <h2 className="text-[2.25rem] sm:text-[2.5rem] font-bold text-foreground leading-[1.2] mb-4">
            Everything Your Firm Needs to Look Professional
          </h2>
          <p className="mx-auto max-w-[50rem] text-lg text-muted-foreground font-normal leading-relaxed mb-12">
            From PBC list management and secure document exchange to white-label branding, Ledger Stash replaces scattered emails with one organized, encrypted vault.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
          {features.map(feature => <div key={feature.title} className="group p-7 rounded-xl bg-background border border-border hover:border-accent/50 transition-all duration-300">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>)}
        </div>
      </div>
    </section>;
}