import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageSEO } from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, AlertTriangle, Shield, Clock, FileCheck, Download, Users } from "lucide-react";

export default function EmployeeAcknowledgments() {
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Employee Policy Acknowledgment Software for SMBs"
        description="Track employee policy acknowledgments, recurring requirements, and signed documents with built-in audit logs and reminders. Simple internal document tracking for growing businesses."
        keywords="employee acknowledgment software, policy acknowledgment tracking, internal document tracking, employee signature tracking, employee handbook software, policy tracking software"
        canonical="/employee-acknowledgment-tracking"
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-28 lg:pt-40 pb-16 lg:pb-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-6">
                Employee Policy & Acknowledgment Tracking <span className="text-accent">for SMBs</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Manage employee policy acknowledgments, recurring document requirements, and signed confirmations in one organized system. Attestly makes it easy to send, track, and prove completion — without spreadsheets or manual follow-ups.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/signup" className="gap-2">
                    Start 14-Day Free Trial
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="heroOutline" size="xl" asChild>
                  <Link to="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Who This Is For */}
        <section className="py-16 bg-card">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-4">Who This Is For</h2>
              <p className="text-muted-foreground mb-6">
                Attestly is built for growing businesses that need structured internal document tracking without enterprise software complexity. This is especially useful for:
              </p>
              <ul className="space-y-3">
                {[
                  "HR managers at small and mid-sized businesses",
                  "Operations leaders managing compliance documentation",
                  "Founders overseeing internal policy distribution",
                  "Franchise operators tracking acknowledgments across locations",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground mt-6">
                If you need to prove that employees received and acknowledged important documents, Attestly gives you visibility and defensible proof.
              </p>
            </div>
          </div>
        </section>

        {/* The Challenge */}
        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-4">The Challenge</h2>
              <p className="text-muted-foreground mb-6">
                Internal document tracking often breaks down because it relies on email, spreadsheets, and manual follow-ups. Common issues include:
              </p>
              <ul className="space-y-3">
                {[
                  "Employees forget to acknowledge updated policies",
                  "Acknowledgments get buried in inboxes",
                  "Spreadsheets become outdated or incomplete",
                  "There's no centralized visibility",
                  "Producing proof during audits is stressful",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground mt-6 font-medium">
                Manual systems create operational risk.
              </p>
            </div>
          </div>
        </section>

        {/* How Attestly Helps */}
        <section className="py-16 bg-card">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-4">How Attestly Helps</h2>
              <p className="text-muted-foreground mb-6">
                Attestly replaces scattered tracking systems with a structured workflow designed specifically for internal document management. With Attestly, you can:
              </p>
              <ul className="space-y-3">
                {[
                  "Upload employee handbooks and policy documents",
                  "Require signatures and required fields",
                  "Assign documents to individuals or groups",
                  "Set one-time or recurring acknowledgment cycles",
                  "Automatically remind employees who haven't completed",
                  "Monitor completion in real time",
                  "Export full activity logs and signed documents anytime",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground mt-6">
                Everything stays organized in one dashboard.
              </p>
            </div>
          </div>
        </section>

        {/* Recurring Acknowledgments */}
        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-4">Manage Recurring Policy Acknowledgments</h2>
              <p className="text-muted-foreground mb-6">
                Many internal documents require annual or periodic acknowledgment — such as security policies, codes of conduct, or handbook updates. Attestly allows you to:
              </p>
              <ul className="space-y-3">
                {[
                  "Schedule recurring acknowledgment cycles",
                  "Automatically notify employees when renewal is due",
                  "Track completion for each cycle",
                  "Maintain historical records over time",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground mt-6">
                No manual resets. No separate tracking spreadsheets.
              </p>
            </div>
          </div>
        </section>

        {/* Common Use Cases */}
        <section className="py-16 bg-card">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-4">Common Internal Document Use Cases</h2>
              <p className="text-muted-foreground mb-6">Businesses use Attestly to manage:</p>
              <ul className="space-y-3">
                {[
                  "Employee handbook acknowledgments",
                  "Code of conduct confirmations",
                  "Security policy updates",
                  "IT access agreements",
                  "Confidentiality acknowledgments",
                  "Workplace safety confirmations",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <FileCheck className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground mt-6">
                If it requires a signature and proof of completion, Attestly keeps it structured and trackable.
              </p>
            </div>
          </div>
        </section>

        {/* Why It's Different */}
        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-4">Why It's Different from Basic E-Signature Tools</h2>
              <p className="text-muted-foreground mb-4">
                Most e-signature platforms are built for one-off contracts. Attestly is designed for ongoing internal document tracking — giving you recurring workflows, structured visibility, automated reminders, and organized proof in one system.
              </p>
              <p className="text-muted-foreground">
                You can see who has completed what at a glance — without digging through email threads or shared drives.
              </p>
            </div>
          </div>
        </section>

        {/* Built-In Proof */}
        <section className="py-16 bg-card">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-6">Built-In Proof & Audit Logs</h2>
              <p className="text-muted-foreground mb-6">Every completed document includes:</p>
              <ul className="space-y-3">
                {[
                  { icon: Clock, text: "Timestamped activity history" },
                  { icon: Shield, text: "IP tracking" },
                  { icon: FileCheck, text: "Secure document storage" },
                  { icon: Download, text: "Downloadable PDF copies" },
                  { icon: Download, text: "Exportable completion data" },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-3">
                    <item.icon className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item.text}</span>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground mt-6">
                So you always have documentation when you need it.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Start Tracking Employee Acknowledgments in Minutes</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              No complex setup. No training required.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/signup" className="gap-2">
                Start 14-Day Free Trial
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
