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
  description: "Import employees, contractors, or vendors in seconds. Add recipients manually or upload via CSV to keep your compliance list organized and up to date."
}, {
  icon: FileText,
  title: "Flexible Requirements",
  description: "Create one-time or recurring compliance requirements. Attach policies for read-and-acknowledge workflows or upload a PDF and turn it into a fillable form with required fields, dates, and signatures — all in one streamlined process."
}, {
  icon: Send,
  title: "Secure Signing Links",
  description: "Generate unique, single-use signing links and send them instantly. Links are secure, trackable, and automatically expire after completion."
}, {
  icon: Clock,
  title: "No-Login Completion",
  description: "Recipients review policies, complete required fields when needed, and sign — no accounts, no passwords, no friction."
}, {
  icon: BarChart3,
  title: "Real-Time Dashboard",
  description: "See compliance status at a glance. Track pending, completed, and overdue forms and acknowledgments in real time."
}, {
  icon: Bell,
  title: "Automated Reminders",
  description: "Automatically follow up with recipients who haven't completed required forms or acknowledgments so nothing slips through the cracks."
}, {
  icon: Download,
  title: "Structured Exports & Audit Proof",
  description: "Download completed PDF copies and export structured response data via CSV — complete with timestamps, IP tracking, and full audit metadata."
}, {
  icon: Shield,
  title: "Enterprise-Grade Security",
  description: "HTTPS everywhere. Secure tokens, encrypted storage, and system safeguards protect your compliance data at every step."
}];

export function Features() {
  return <section id="features" className="pt-12 lg:pt-20 pb-20 lg:pb-32 bg-card">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-[2.75rem] mb-6">
            Everything You Need for Compliance
          </h2>
          <p className="mx-auto max-w-[47rem] text-lg text-muted-foreground leading-relaxed">
            From read-and-acknowledge policies to structured compliance forms and audit-ready exports, Attestly keeps your documentation organized, trackable, and defensible — without enterprise complexity.
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