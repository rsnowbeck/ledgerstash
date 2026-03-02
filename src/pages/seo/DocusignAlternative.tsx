import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageSEO } from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, X, Check } from "lucide-react";

export default function DocusignAlternative() {
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="DocuSign Alternative for Small Business Compliance | VaultLedger"
        description="Looking for a cheaper DocuSign alternative? VaultLedger is purpose-built for internal compliance — policy acknowledgments, fillable forms, and audit-ready tracking at a fraction of the cost."
        keywords="DocuSign alternative small business, cheaper alternative to DocuSign, internal signature alternative, DocuSign competitor, DocuSign alternative compliance, affordable e-signature"
        canonical="/docusign-alternative-compliance"
      />
      <Header />
      <main>
        <section className="pt-28 lg:pt-40 pb-16 lg:pb-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-6">
                The <span className="text-accent">DocuSign Alternative</span> Built for Compliance
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                DocuSign is built for contract negotiation. VaultLedger is built for internal compliance. If you need policy acknowledgments, onboarding forms, and audit documentation — not multi-party legal agreements — VaultLedger does the job at a fraction of the cost.
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
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">VaultLedger vs DocuSign for compliance</h2>
              <div className="card-elevated overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 text-sm font-semibold text-foreground">Feature</th>
                      <th className="text-center p-4 text-sm font-semibold text-accent">VaultLedger</th>
                      <th className="text-center p-4 text-sm font-semibold text-muted-foreground">DocuSign</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: "Purpose-built for compliance", vaultledger: true, docusign: false },
                      { feature: "No signer accounts required", vaultledger: true, docusign: false },
                      { feature: "Fillable PDF compliance forms", vaultledger: true, docusign: true },
                      { feature: "AI field detection", vaultledger: true, docusign: true },
                      { feature: "Automated compliance reminders", vaultledger: true, docusign: true },
                      { feature: "Audit-ready exports (CSV + PDF)", vaultledger: true, docusign: true },
                      { feature: "Starts at $29/month", vaultledger: true, docusign: false },
                      { feature: "No per-envelope pricing", vaultledger: true, docusign: false },
                      { feature: "Multi-party contract negotiation", vaultledger: false, docusign: true },
                      { feature: "Legal workflow management", vaultledger: false, docusign: true },
                    ].map((row) => (
                      <tr key={row.feature} className="border-b border-border last:border-0">
                        <td className="p-4 text-sm text-foreground">{row.feature}</td>
                        <td className="p-4 text-center">
                          {row.vaultledger ? (
                            <Check className="h-5 w-5 text-accent mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground/40 mx-auto" />
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {row.docusign ? (
                            <Check className="h-5 w-5 text-muted-foreground mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground/40 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-6">Why switch from DocuSign?</h2>
              <ul className="space-y-4">
                {[
                  "DocuSign charges per envelope — VaultLedger offers unlimited signatures within your plan",
                  "DocuSign requires signers to create accounts — VaultLedger uses secure one-click links",
                  "DocuSign is designed for legal contracts — VaultLedger is designed for compliance workflows",
                  "DocuSign's complexity is overkill for policy acknowledgments and training sign-offs",
                  "VaultLedger starts at $29/month vs DocuSign's $10/month per user minimum",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              <h2 className="text-2xl font-bold text-foreground mb-6 mt-12">When DocuSign is the better choice</h2>
              <p className="text-muted-foreground">
                If you need multi-party contract negotiation, legal workflows, or advanced document routing with multiple signers in sequence — DocuSign is the right tool. VaultLedger is not a contract management platform. It's purpose-built for internal compliance: policy acknowledgments, onboarding forms, training confirmations, and audit documentation.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-card">
          <div className="container text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Try the smarter alternative</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Purpose-built for compliance. A fraction of the cost. Start your free trial today.
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
