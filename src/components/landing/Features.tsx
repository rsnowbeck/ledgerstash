import { 
  Users, 
  FileText, 
  Send, 
  BarChart3, 
  Download, 
  Shield,
  Clock,
  Bell
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Recipient Management",
    description: "Add employees, contractors, and vendors. Organize by department or group. Track everyone in one place."
  },
  {
    icon: FileText,
    title: "Flexible Requirements",
    description: "Create one-time or annual compliance items. Attach PDFs. Set due dates. Draft before publishing."
  },
  {
    icon: Send,
    title: "Secure Signing Links",
    description: "Generate unique, single-use tokens. Send via email. Links expire automatically after completion."
  },
  {
    icon: Clock,
    title: "No-Login Signing",
    description: "Recipients click, review, and acknowledge in seconds. No passwords. No accounts. No friction."
  },
  {
    icon: BarChart3,
    title: "Real-Time Dashboard",
    description: "See compliance rates at a glance. Track pending, completed, and overdue acknowledgments."
  },
  {
    icon: Bell,
    title: "Automated Reminders",
    description: "Send bulk reminders to pending recipients. Keep compliance on track without manual follow-ups."
  },
  {
    icon: Download,
    title: "Export & Audit Proof",
    description: "Generate PDF proof documents and CSV exports. Timestamped records with full metadata."
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "HTTPS everywhere. Hashed tokens. Rate limiting. Database backups. Your data is protected."
  }
];

export function Features() {
  return (
    <section id="features" className="py-20 lg:py-32 bg-card">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            Everything you need for compliance
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            From policy acknowledgments to audit exports, Attestly handles it all so you can focus on your business. Works for employees, contractors, and vendors — even if they're not in HR.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-xl bg-background border border-border hover:border-accent/50 transition-all duration-300"
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
