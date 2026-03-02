import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Mail } from "lucide-react";
import { Footer } from "@/components/landing/Footer";
import { PageSEO } from "@/components/seo/PageSEO";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Privacy Policy | How VaultLedger Handles Your Data"
        description="Read VaultLedger's Privacy Policy to understand how we collect, use, and protect your information. We never sell your data and use industry-standard security practices."
        keywords="vaultledger privacy policy, client vault privacy, data protection policy, accounting portal data handling"
        canonical="/privacy"
      />
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">VaultLedger</span>
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
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-3">Privacy Policy</h1>
            <p className="text-muted-foreground">Effective Date: January 31, 2026</p>
          </div>

          <div className="card-elevated p-8 space-y-8">
            <p className="text-muted-foreground">
              VaultLedger ("we," "our," or "us") respects your privacy. This Privacy Policy explains how we collect, use, and protect information when you use our website and web application (the "Service").
            </p>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Information We Collect</h2>
              <p className="text-muted-foreground">We collect only the information necessary to operate and improve the Service, including:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong className="text-foreground">Account information:</strong> name, email address, and login credentials</li>
                <li><strong className="text-foreground">Usage data:</strong> actions taken within the app (e.g., documents uploaded or tasks completed)</li>
                <li><strong className="text-foreground">Technical data:</strong> IP address, browser type, and device information</li>
                <li><strong className="text-foreground">Communications:</strong> messages you send us via forms or email</li>
              </ul>
              <p className="text-muted-foreground">We do not collect sensitive personal information unless you choose to provide it as part of your use of the Service.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">How We Use Information</h2>
              <p className="text-muted-foreground">We use collected information to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Provide and operate the Service</li>
                <li>Authenticate users and manage accounts</li>
                <li>Communicate with you about your account or support requests</li>
                <li>Improve product functionality and performance</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Data Sharing</h2>
              <p className="text-muted-foreground">We do not sell your data.</p>
              <p className="text-muted-foreground">We may share information only with:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Trusted service providers (hosting, email delivery, analytics) necessary to operate the Service</li>
                <li>Legal authorities if required by law</li>
              </ul>
              <p className="text-muted-foreground">All service providers are required to protect your data.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Data Retention</h2>
              <p className="text-muted-foreground">We retain account and usage data for as long as your account is active or as needed to provide the Service. You may request deletion of your account and associated data by contacting us.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Security</h2>
              <p className="text-muted-foreground">We use reasonable administrative, technical, and organizational safeguards to protect your information. No system is 100% secure, but we take data protection seriously.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Your Rights</h2>
              <p className="text-muted-foreground">Depending on your location, you may have rights to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Access your data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
              </ul>
              <p className="text-muted-foreground">You can exercise these rights by contacting us.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Changes to This Policy</h2>
              <p className="text-muted-foreground">We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.</p>
            </section>

            <section className="space-y-4 pt-4 border-t border-border">
              <h2 className="text-xl font-semibold text-foreground">Contact</h2>
              <p className="text-muted-foreground">Questions about privacy?</p>
              <a href="mailto:hello@vaultledger.com" className="text-primary hover:underline inline-flex items-center gap-2">
                <Mail className="h-4 w-4" />
                hello@vaultledger.com
              </a>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}