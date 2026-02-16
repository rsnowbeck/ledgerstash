import { Users, FileText, Send, BarChart3, Download, Shield, Clock, Bell } from "lucide-react";

interface Feature {
  icon: any;
  title: string;
  description: string;
  bullets?: string[];
}

const features: Feature[] = [{
  icon: Users,
  title: "Recipient Management",
  description: "Import employees, clients, contractors, or vendors in seconds. Add recipients manually or upload a CSV to keep your document lists organized."
}, {
  icon: FileText,
  title: "Flexible Workflows",
  description: "Create one-time or recurring document requests. Turn policies or PDFs into structured workflows in minutes."
}, {
  icon: Send,
  title: "Secure Signing Links",
  description: "Generate secure, single-use signing links that automatically track completion and expire when needed."
}, {
  icon: Clock,
  title: "No-Login Completion",
  description: "Recipients review documents, complete required fields, and sign — no accounts, passwords, or friction required."
}, {
  icon: BarChart3,
  title: "Real-Time Dashboard",
  description: "See completion status at a glance. Track who's signed, who hasn't, and what's overdue in one view."
}, {
  icon: Bell,
  title: "Automated Reminders",
  description: "Automatically follow up on incomplete documents so nothing gets missed."
}, {
  icon: Download,
  title: "Completion Reports & Audit Logs",
  description: "Download completed documents with timestamps, IP tracking, and full activity history anytime."
}, {
  icon: Shield,
  title: "Enterprise-Grade Security",
  description: "Encrypted data storage and secure infrastructure protect your documents at every step."
}];

export function Features() {
  return <section id="features" className="pt-24 pb-24 bg-card">
      <div className="container">
        <div className="text-center">
          <h2 className="text-[2.25rem] sm:text-[2.5rem] font-bold text-foreground leading-[1.2] mb-4">
            Everything You Need to Send, Track & Prove Documents
          </h2>
          <p className="mx-auto max-w-[50rem] text-lg text-muted-foreground font-normal leading-relaxed mb-12">
            From internal policies and contractor agreements to structured form workflows, Attestly keeps your documents organized, trackable, and easy to prove — without enterprise complexity.
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
              {feature.bullets && (
                <ul className="mt-3 space-y-1">
                  {feature.bullets.map((bullet, idx) => (
                    <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <span className="text-accent mt-0.5">•</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>)}
        </div>
      </div>
    </section>;
}