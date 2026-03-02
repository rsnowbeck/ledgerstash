import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageSEO } from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, FileText, Send, BarChart3, Download } from "lucide-react";

export default function PolicyAcknowledgment() {
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Policy Acknowledgment Software | VaultLedger"
        description="Track employee and contractor policy acknowledgments with legally defensible digital signatures. Automated reminders, audit-ready exports, no signer accounts required."
        keywords="policy acknowledgment software, employee acknowledgment tracking, handbook acknowledgment tracking, policy sign-off software, digital policy acknowledgment"
        canonical="/policy-acknowledgment-software"
      />
      <Header />
      <main>
        <section className="pt-28 lg:pt-40 pb-16 lg:pb-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-6">
                Policy Acknowledgment <span className="text-accent">Software</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                VaultLedger is policy acknowledgment software that allows businesses to send digital policies to employees or contractors and track legally defensible acknowledgment. Eliminate manual tracking and get timestamped proof with exportable records.
              </p>
              <Button variant="hero" size="xl" asChild>
                <Link to="/signup" className="gap-2">
                  Start 14-Day Free Trial
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 bg-card">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-6">What is policy acknowledgment software?</h2>
              <p className="text-muted-foreground mb-4">
                Policy acknowledgment software digitizes the process of distributing policies and collecting confirmations from employees, contractors, and vendors. Instead of paper sign-off sheets or email chains, organizations send secure digital links and track completion in real time.
              </p>
              <p className="text-muted-foreground mb-8">
                VaultLedger makes this effortless with one-click signing links, automated reminders, and audit-ready exports — all without requiring recipients to create accounts.
              </p>

              <h2 className="text-2xl font-bold text-foreground mb-6">How VaultLedger tracks acknowledgments</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: Send, title: "Send secure links", desc: "Generate unique, single-use signing links delivered via email. Recipients click, review, and acknowledge." },
                  { icon: FileText, title: "Attach policies", desc: "Upload employee handbooks, code of conduct, NDAs, safety policies, or any document requiring acknowledgment." },
                  { icon: BarChart3, title: "Track in real time", desc: "Monitor who has signed, who hasn't, and who is overdue — all from a single dashboard." },
                  { icon: Download, title: "Export for audits", desc: "Download timestamped PDF proof or export structured data via CSV for regulatory compliance." },
                ].map((feature) => (
                  <div key={feature.title} className="card-elevated p-6">
                    <feature.icon className="h-6 w-6 text-accent mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-6">Common use cases</h2>
              <ul className="space-y-3">
                {[
                  "Employee handbook acknowledgments",
                  "Code of conduct sign-offs",
                  "NDA and confidentiality agreements",
                  "Safety protocol acknowledgments",
                  "Training completion confirmations",
                  "Vendor and contractor compliance",
                  "Annual policy re-acknowledgments",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="py-16 bg-card">
          <div className="container text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Start tracking policy acknowledgments today</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Free 14-day trial. No credit card required. Send your first policy in minutes.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/signup" className="gap-2">
                Start Free Trial
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
