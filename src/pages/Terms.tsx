import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Mail, Shield } from "lucide-react";
import { Footer } from "@/components/landing/Footer";
import { PageSEO } from "@/components/seo/PageSEO";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Terms of Service | Ledger Stash Usage Agreement"
        description="Read Ledger Stash's Terms of Service covering acceptable use, customer data ownership, service availability, and liability limitations."
        keywords="ledgerstash terms of service, client vault terms, accounting portal agreement"
        canonical="/terms"
      />
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background border-2 border-primary">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">LedgerStash</span>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/"><ArrowLeft className="h-4 w-4 mr-2" />Back</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <FileText className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-3">Terms of Service</h1>
            <p className="text-muted-foreground">Effective Date: January 31, 2026</p>
          </div>

          <div className="card-elevated p-8 space-y-8">
            <p className="text-muted-foreground">
              These Terms of Service ("Terms") govern your use of Ledger Stash's website and web application (the "Service"). By using the Service, you agree to these Terms.
            </p>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Use of the Service</h2>
              <p className="text-muted-foreground">You may use the Service only if you are legally able to enter into a binding agreement and are using it for lawful purposes.</p>
              <p className="text-muted-foreground">You are responsible for:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activity that occurs under your account</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Acceptable Use</h2>
              <p className="text-muted-foreground">You agree not to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Use the Service for unlawful or fraudulent purposes</li>
                <li>Interfere with or disrupt the Service</li>
                <li>Attempt to gain unauthorized access to systems or data</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Customer Data</h2>
              <p className="text-muted-foreground">You retain ownership of all data you submit to the Service ("Customer Data").</p>
              <p className="text-muted-foreground">By using the Service, you grant Ledger Stash permission to process Customer Data solely to provide and operate the Service.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Service Availability</h2>
              <p className="text-muted-foreground">The Service is provided on an "as-is" and "as-available" basis. We strive for reliability but do not guarantee uninterrupted availability.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Termination</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>You may stop using the Service at any time.</li>
                <li>We may suspend or terminate access if these Terms are violated or if required by law.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Limitation of Liability</h2>
              <p className="text-muted-foreground">To the maximum extent permitted by law, Ledger Stash will not be liable for indirect, incidental, or consequential damages resulting from use of the Service.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Changes to These Terms</h2>
              <p className="text-muted-foreground">We may update these Terms from time to time. Continued use of the Service after changes constitutes acceptance of the updated Terms.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Governing Law</h2>
              <p className="text-muted-foreground">These Terms are governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.</p>
            </section>

            <section className="space-y-4 pt-4 border-t border-border">
              <h2 className="text-xl font-semibold text-foreground">Contact</h2>
              <p className="text-muted-foreground">Questions about these Terms?</p>
              <a href="mailto:hello@ledgerstash.com" className="text-primary hover:underline inline-flex items-center gap-2">
                <Mail className="h-4 w-4" />
                hello@ledgerstash.com
              </a>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
