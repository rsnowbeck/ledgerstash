import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageSEO } from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, AlertTriangle, Shield, Clock, FileCheck, Download } from "lucide-react";

export default function ContractorAgreements() {
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Contractor Agreement & Vendor Document Tracking Software"
        description="Send, track, and manage contractor agreements and vendor documentation with secure signing links, reminders, and audit-ready logs."
        keywords="contractor agreement tracking, vendor document management, contractor signature software, vendor compliance tracking, contractor documentation software"
        canonical="/contractor-vendor-agreement-tracking"
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-28 lg:pt-40 pb-16 lg:pb-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-6">
                Manage Contractor & Vendor Agreements <span className="text-accent">in One Organized System</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Keeping track of contractor agreements, vendor documentation, and required confirmations can quickly become messy. VaultLedger centralizes your external documentation and gives you structured visibility — without chasing signatures.
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
                Managing contractor and vendor documentation often involves:
              </p>
              <ul className="space-y-3">
                {[
                  "Emailing agreements back and forth",
                  "Manually tracking insurance certificates",
                  "Missing renewals",
                  "No central dashboard",
                  "Difficulty proving completion",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground mt-6 font-medium">
                When documentation is scattered, risk increases.
              </p>
            </div>
          </div>
        </section>

        {/* How VaultLedger Helps */}
        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-4">How VaultLedger Helps</h2>
              <p className="text-muted-foreground mb-6">
                VaultLedger provides a structured workflow for managing external partners. You can:
              </p>
              <ul className="space-y-3">
                {[
                  "Upload contractor agreements or compliance forms",
                  "Send secure, single-use signing links",
                  "Require signatures and required fields",
                  "Track who has completed and who hasn't",
                  "Set recurring renewal reminders",
                  "Export full activity logs and completed documents",
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
                  "Upload contractor agreement",
                  "Send secure signing link",
                  "Contractor reviews and signs",
                  "Set annual renewal reminder",
                  "Monitor everything from one dashboard",
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

        {/* Why It Works */}
        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-4">Why It Works for Growing Businesses</h2>
              <p className="text-muted-foreground">
                Unlike contract lifecycle platforms built for legal teams, VaultLedger is designed for simple, ongoing document tracking — perfect for operations teams managing external relationships.
              </p>
            </div>
          </div>
        </section>

        {/* Secure Documentation */}
        <section className="py-16 bg-card">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-6">Secure & Structured Documentation</h2>
              <p className="text-muted-foreground mb-6">All documents include:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: Clock, title: "Timestamped Activity Logs", desc: "Every action is logged with precise timestamps." },
                  { icon: Shield, title: "IP Tracking", desc: "Capture IP address for every completion." },
                  { icon: FileCheck, title: "Downloadable PDF Copies", desc: "Download signed documents anytime." },
                  { icon: Download, title: "Structured Exports", desc: "Export completion data in organized formats." },
                ].map((feature) => (
                  <div key={feature.title} className="card-elevated p-6">
                    <feature.icon className="h-6 w-6 text-accent mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground mt-6">
                So you can prove completion anytime.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Simplify Contractor & Vendor Management</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Start managing agreements and confirmations in one organized system.
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
