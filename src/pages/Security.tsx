import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock, Mail, Shield } from "lucide-react";
import { Footer } from "@/components/landing/Footer";
import { PageSEO } from "@/components/seo/PageSEO";

export default function Security() {
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Security | How Ledger Stash Protects Your Data"
        description="Learn about Ledger Stash's security practices including data encryption, access controls, backups, and incident response. Your documents are protected by industry-standard safeguards."
        keywords="ledgerstash security, client vault security, data protection, accounting portal encryption"
        canonical="/security"
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
              <Lock className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-3">Security</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              At Ledger Stash, security is built into how we design and operate the product. This page outlines our current security practices in clear, practical terms.
            </p>
          </div>

          <div className="card-elevated p-8 space-y-8">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Infrastructure</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Hosted on enterprise-grade cloud infrastructure with 99.9% uptime SLA</li>
                <li>Data centers located in the United States</li>
                <li>Access is restricted to authorized personnel only</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Data Protection</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>AES-256 encryption at rest for all stored data</li>
                <li>TLS 1.2+ encryption in transit for all connections</li>
                <li>Customer data is logically isolated by account</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Access Controls</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Authentication is required for all accounts</li>
                <li>Role-based access limits exposure to sensitive information</li>
                <li>Internal access follows least-privilege principles</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Backups & Reliability</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Regular backups are performed to protect against data loss</li>
                <li>Monitoring is in place to detect service issues</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Incident Response</h2>
              <p className="text-muted-foreground">If a security incident affecting customer data were to occur, we would:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Investigate promptly</li>
                <li>Take appropriate remediation steps</li>
                <li>Notify affected customers as required by law</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Regulatory Compliance</h2>
              <p className="text-muted-foreground">Ledger Stash is designed to help accounting and tax firms meet key regulatory requirements:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>IRS Publication 4557</strong> — Safeguarding Taxpayer Data: encrypted storage, access controls, and secure document transmission</li>
                <li><strong>FTC Safeguards Rule</strong> — Required safeguards for customer financial information under GLBA</li>
                <li><strong>Gramm-Leach-Bliley Act (GLBA)</strong> — Privacy and security of consumer financial data</li>
                <li><strong>WISP Support</strong> — Ledger Stash can serve as a core component of your firm's Written Information Security Plan</li>
              </ul>
              <p className="text-muted-foreground text-sm">Our infrastructure provider maintains SOC 2 Type II certification. While compliance ultimately depends on your firm's overall security program, LedgerStash provides the technical safeguards these regulations require.</p>
            </section>

            <section className="space-y-4 pt-4 border-t border-border">
              <h2 className="text-xl font-semibold text-foreground">Responsible Disclosure</h2>
              <p className="text-muted-foreground">If you believe you've found a security vulnerability, please report it responsibly to:</p>
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
