import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageSEO } from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Shield, Users, Clock, FileText } from "lucide-react";

export default function DigitalPolicySignature() {
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Digital Policy Signature Software | VaultLedger"
        description="Collect digital policy signatures from employees, contractors, and vendors without accounts or passwords. Secure, audit-ready compliance tracking for internal use."
        keywords="digital policy signature, employee signature tracking, internal e-signature software, no-login e-signature, policy signature software, digital signature compliance"
        canonical="/digital-policy-signature-software"
      />
      <Header />
      <main>
        <section className="pt-28 lg:pt-40 pb-16 lg:pb-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-6">
                Digital Policy <span className="text-accent">Signature Software</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                VaultLedger is digital policy signature software for internal compliance use. Collect legally defensible signatures from employees, contractors, and vendors — without requiring them to create accounts, remember passwords, or download apps.
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
              <h2 className="text-2xl font-bold text-foreground mb-6">How digital policy signatures work</h2>
              <p className="text-muted-foreground mb-8">
                Send secure, single-use signing links via email. Recipients click the link, review the policy or complete required fields, type their name to sign, and submit. Every signature captures a timestamp, IP address, and browser metadata for a defensible audit trail.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: Users, title: "No accounts required", desc: "Recipients sign via a secure link. No passwords, no app downloads, no friction." },
                  { icon: Shield, title: "Legally defensible", desc: "Compliant with ESIGN Act and UETA. Full audit trail with timestamps and IP tracking." },
                  { icon: Clock, title: "Automated follow-ups", desc: "Set automatic reminders for recipients who haven't signed yet." },
                  { icon: FileText, title: "Flexible formats", desc: "Simple read-and-acknowledge or fillable PDF forms with required fields and signatures." },
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
              <h2 className="text-2xl font-bold text-foreground mb-6">Who uses digital policy signatures?</h2>
              <ul className="space-y-3">
                {[
                  "HR teams distributing employee handbooks and workplace policies",
                  "Compliance officers tracking regulatory acknowledgments",
                  "Operations teams onboarding contractors and vendors",
                  "Safety managers distributing protocol acknowledgments",
                  "IT departments collecting acceptable use policy sign-offs",
                  "Legal teams managing NDA and confidentiality agreements",
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
            <h2 className="text-2xl font-bold text-foreground mb-4">Start collecting digital signatures today</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              No credit card required. Send your first policy for signature in under 5 minutes.
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
