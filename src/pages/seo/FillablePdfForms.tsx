import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageSEO } from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Wand2, FileText, Download, Shield } from "lucide-react";

export default function FillablePdfForms() {
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Fillable PDF Compliance Forms | Ledger Stash"
        description="Convert PDFs into fillable compliance forms with AI-powered field detection. Collect structured responses, signatures, and audit-ready records. No signer accounts needed."
        keywords="fillable compliance forms, compliance form software, PDF compliance forms online, fillable PDF forms, digital compliance forms, form field detection"
        canonical="/fillable-pdf-compliance-forms"
      />
      <Header />
      <main>
        <section className="pt-28 lg:pt-40 pb-16 lg:pb-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-6">
                Fillable PDF <span className="text-accent">Compliance Forms</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Upload any PDF and convert it into a fillable compliance form with AI-powered field detection. Collect structured responses, required signatures, and maintain audit-ready records — all without requiring signers to create accounts.
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
              <h2 className="text-2xl font-bold text-foreground mb-6">How fillable PDF forms work</h2>
              <div className="space-y-8">
                {[
                  { step: "1", icon: FileText, title: "Upload your PDF", desc: "Upload any existing PDF document — employee handbooks, onboarding forms, safety checklists, or compliance questionnaires." },
                  { step: "2", icon: Wand2, title: "AI detects fields", desc: "Ledger Stash uses AI to automatically detect fillable fields including text inputs, checkboxes, date fields, and signature areas. Review and adjust as needed." },
                  { step: "3", icon: Download, title: "Collect & export", desc: "Recipients complete the form via a secure link. Structured responses are stored securely and exportable via CSV or as completed PDF snapshots." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-6">Supported field types</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {["Text inputs", "Checkboxes", "Date fields", "Dropdowns", "Signature areas", "Initials"].map((field) => (
                  <div key={field} className="flex items-center gap-2 p-3 rounded-lg border border-border">
                    <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                    <span className="text-sm text-foreground">{field}</span>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-6 mt-12">Why use fillable compliance forms?</h2>
              <ul className="space-y-3">
                {[
                  "Eliminate paper forms and manual data entry",
                  "Ensure every required field is completed before submission",
                  "Store structured response data for easy reporting",
                  "Maintain audit-ready records with timestamps and IP tracking",
                  "No signer accounts required — just click and complete",
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
            <h2 className="text-2xl font-bold text-foreground mb-4">Turn your PDFs into fillable forms</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Upload a PDF, detect fields with AI, and start collecting structured compliance data in minutes.
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
