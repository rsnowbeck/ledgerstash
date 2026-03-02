import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageSEO } from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Shield, FileCheck, BarChart3, Clock } from "lucide-react";

export default function ComplianceSoftware() {
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Compliance Software for Small Businesses | VaultLedger"
        description="Affordable compliance software for small businesses. Distribute policies, collect acknowledgments, and maintain audit-ready records without enterprise complexity. Start free."
        keywords="compliance software small business, affordable compliance software, simple compliance software, compliance management software, small business compliance tools"
        canonical="/compliance-software-small-business"
      />
      <Header />
      <main>
        <section className="pt-28 lg:pt-40 pb-16 lg:pb-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-6">
                Compliance Software for <span className="text-accent">Small Businesses</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                VaultLedger is compliance software designed for small and mid-sized businesses. Distribute policies, collect legally defensible acknowledgments or fillable form data, and maintain audit-ready records — without enterprise complexity or pricing.
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

        <section className="py-16 bg-card">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-6">What is compliance software?</h2>
              <p className="text-muted-foreground mb-4">
                Compliance software helps organizations manage the distribution, acknowledgment, and tracking of policies, training materials, and regulatory documents. For small businesses, it replaces manual processes like printing documents, chasing email confirmations, and maintaining spreadsheets.
              </p>
              <p className="text-muted-foreground mb-8">
                VaultLedger simplifies this by combining policy acknowledgments, fillable compliance forms, automated reminders, and audit-ready exports in one platform — without the cost or complexity of enterprise solutions like DocuSign or Adobe Sign.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: FileCheck, title: "Forms & Signatures", desc: "Upload PDFs and convert them into fillable forms, or use simple read-and-acknowledge workflows." },
                  { icon: Shield, title: "Audit-Ready Proof", desc: "Every signature includes timestamps, IP addresses, and browser metadata for defensible compliance records." },
                  { icon: Clock, title: "Automated Reminders", desc: "Set up automatic follow-ups so nothing falls through the cracks." },
                  { icon: BarChart3, title: "Real-Time Tracking", desc: "Monitor completion status across your entire organization from a single dashboard." },
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
              <h2 className="text-2xl font-bold text-foreground mb-6">Why small businesses choose VaultLedger</h2>
              <ul className="space-y-4">
                {[
                  "No enterprise contracts or complex onboarding — start collecting signatures in minutes",
                  "Recipients sign without creating accounts or remembering passwords",
                  "Affordable pricing starting at $29/month with a 14-day free trial",
                  "Works for employees, contractors, and vendors — even if they're not in your HR system",
                  "Export audit-ready records as PDF proof or structured CSV data",
                  "Purpose-built for compliance, not contract negotiation",
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
            <h2 className="text-2xl font-bold text-foreground mb-4">Ready to simplify compliance?</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Start your free trial today. No credit card required. Be up and running in under 5 minutes.
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
