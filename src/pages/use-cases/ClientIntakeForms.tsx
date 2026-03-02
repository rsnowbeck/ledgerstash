import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageSEO } from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, AlertTriangle, Shield, Clock, FileCheck, Download } from "lucide-react";

export default function ClientIntakeForms() {
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Client Intake Form & Consent Signature Software"
        description="Send, track, and manage client intake forms and consent documents online with secure signing, structured records, and audit logs."
        keywords="client intake form software, consent form signature online, intake form tracking, online waiver tracking, client onboarding forms, consent document software"
        canonical="/client-intake-form-tracking"
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-28 lg:pt-40 pb-16 lg:pb-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-6">
                Simplify Client Intake Forms <span className="text-accent">with Built-In Signature Proof</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Collecting intake forms and consent documents shouldn't require printing, scanning, or chasing clients. VaultLedger lets you send structured forms and track completion securely — all before appointments.
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

        {/* The Challenge */}
        <section className="py-16 bg-card">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-6">The Challenge</h2>
              <p className="text-muted-foreground mb-6">
                Client intake often involves:
              </p>
              <ul className="space-y-3">
                {[
                  "Emailing PDF attachments",
                  "Incomplete forms",
                  "Missing signatures",
                  "Manual follow-ups",
                  "No centralized tracking",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground mt-6 font-medium">
                This creates delays and administrative overhead.
              </p>
            </div>
          </div>
        </section>

        {/* How VaultLedger Helps */}
        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-4">How VaultLedger Helps</h2>
              <p className="text-muted-foreground mb-6">With VaultLedger, you can:</p>
              <ul className="space-y-3">
                {[
                  "Upload intake PDFs",
                  "Auto-detect fillable form fields",
                  "Add required signatures and dates",
                  "Send secure signing links",
                  "Track completion in real time",
                  "Automatically remind incomplete recipients",
                  "Archive recipients once no longer active",
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

        {/* Example Workflow */}
        <section className="py-16 bg-card">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-6">Example Workflow</h2>
              <div className="space-y-4">
                {[
                  "Upload intake form",
                  "Auto-detect form fields",
                  "Send secure link before appointment",
                  "Client completes and signs",
                  "Archive recipient after processing",
                ].map((step, idx) => (
                  <div key={step} className="flex items-start gap-4">
                    <span className="flex-shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground text-sm font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-muted-foreground pt-1">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Designed for Structured Tracking */}
        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-6">Designed for Structured Tracking</h2>
              <p className="text-muted-foreground mb-6">
                Unlike basic form builders, VaultLedger ties each completed form to:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: Clock, title: "Timestamped Activity Logs", desc: "Every action is logged with precise timestamps." },
                  { icon: Shield, title: "IP Tracking", desc: "Capture IP address for every completion." },
                  { icon: FileCheck, title: "Secure Storage", desc: "All forms stored securely and accessible anytime." },
                  { icon: Download, title: "Exportable Records", desc: "Download and export structured completion data." },
                ].map((feature) => (
                  <div key={feature.title} className="card-elevated p-6">
                    <feature.icon className="h-6 w-6 text-accent mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground mt-6">
                So you always have structured documentation.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-card">
          <div className="container text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Make Client Intake Simple</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Start sending and tracking intake forms with confidence.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/signup" className="gap-2">
                Start Your 14-Day Free Trial
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
