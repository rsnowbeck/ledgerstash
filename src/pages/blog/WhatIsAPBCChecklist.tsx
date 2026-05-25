import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageSEO } from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";

function useBlogSchema() {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "What is a PBC Checklist? (And Why Your Firm Needs One)",
      description:
        "A PBC (Provided by Client) checklist is the foundation of an efficient tax season. Learn what it is, why it matters, and how to automate it.",
      author: { "@type": "Organization", name: "Ledger Stash" },
      publisher: { "@type": "Organization", name: "Ledger Stash", url: "https://ledgerstash.com" },
      datePublished: "2026-01-08",
      mainEntityOfPage: "https://ledgerstash.com/blog/what-is-a-pbc-checklist",
    };
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What does PBC stand for in accounting?",
          acceptedAnswer: { "@type": "Answer", text: "PBC stands for Provided by Client. A PBC checklist is an itemized list of documents, schedules, and information that the accounting firm requires the client to provide before work can begin." },
        },
        {
          "@type": "Question",
          name: "What should be on a PBC checklist?",
          acceptedAnswer: { "@type": "Answer", text: "A PBC checklist should include specific document names (W-2, 1099-INT, Schedule K-1), the source of each document (e.g., W-2 from Acme Corp), clear due dates, and a way for the client to mark each item as complete." },
        },
        {
          "@type": "Question",
          name: "How do you automate a PBC checklist?",
          acceptedAnswer: { "@type": "Answer", text: "Modern document vaults like Ledger Stash allow you to use pre-built templates, scan prior-year returns with AI to auto-generate personalized checklists, and automate follow-up reminders until the checklist is 100% complete." },
        },
      ],
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-blog-schema", "true");
    script.textContent = JSON.stringify([schema, faqSchema]);
    document.head.appendChild(script);
    return () => {
      const el = document.querySelector("script[data-blog-schema]");
      if (el) el.remove();
    };
  }, []);
}

export default function WhatIsAPBCChecklist() {
  useBlogSchema();
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="What is a PBC Checklist? Guide for Accounting Firms | Ledger Stash"
        description="A PBC (Provided by Client) checklist is the foundation of an efficient tax season. Learn what it is, why generic document requests fail, and how to automate your PBC process."
        keywords="what is a PBC checklist, PBC checklist accounting, provided by client checklist, PBC list CPA, automate PBC checklist, document collection accounting"
        canonical="/blog/what-is-a-pbc-checklist"
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="py-16 bg-gradient-to-b from-muted/40 to-background">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-4">
                Practice Management
              </p>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-6 leading-tight">
                What is a PBC Checklist? (And Why Your Firm Needs One)
              </h1>
              <p className="text-muted-foreground text-sm">Published January 8, 2026 · 5 min read</p>
            </div>
          </div>
        </section>

        {/* Article Body */}
        <section className="py-12">
          <div className="container">
            <div className="max-w-3xl mx-auto space-y-6 text-muted-foreground leading-relaxed">

              <p className="text-base">
                If you ask any experienced CPA what the biggest bottleneck in their firm is, the answer is rarely the tax code. The answer is almost always "waiting on the client." You cannot prepare a return, reconcile a month of books, or conduct an audit if you do not have the source documents. And clients, generally speaking, are terrible at providing those documents on time and in an organized manner.
              </p>
              <p className="text-base">
                The solution to this bottleneck is the PBC checklist.
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">What Does PBC Stand For?</h2>
              <p className="text-base">
                PBC stands for <strong className="text-foreground">Provided by Client</strong>. A PBC checklist is an itemized, specific list of documents, schedules, and information that the accounting firm requires the client to provide before work can begin.
              </p>
              <p className="text-base">
                While the term originated in the auditing world — where auditors would give management a list of schedules they needed to prepare — it has become standard terminology across tax preparation, bookkeeping, and fractional CFO services.
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">Why "Please Send Your Tax Documents" Fails</h2>
              <p className="text-base">
                Many solo CPAs and newer firms make the mistake of sending generic requests. They email the client in February and say, <em>"Please upload all your tax documents to the portal so we can get started."</em> This approach fails for three reasons:
              </p>
              <ol className="list-decimal pl-6 space-y-3 text-base">
                <li><strong className="text-foreground">Ambiguity breeds procrastination.</strong> When a client doesn't know exactly what you need, the task feels overwhelming. Overwhelming tasks get pushed to the bottom of the to-do list.</li>
                <li><strong className="text-foreground">You get incomplete files.</strong> The client uploads their W-2 and a few receipts, assumes they are done, and stops looking. You start the return, realize you are missing a 1099-B, and have to stop working to email them again.</li>
                <li><strong className="text-foreground">You get the "shoebox" treatment.</strong> Without a structured list, clients will dump every piece of financial mail they received all year into your portal, forcing you to sort through the noise to find the signal.</li>
              </ol>

              <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">The Anatomy of a Great PBC Checklist</h2>
              <p className="text-base">
                A great PBC checklist removes ambiguity. It tells the client exactly what they need to find, using terminology they understand.
              </p>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm my-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-destructive uppercase tracking-wide mb-2">Poor Request</p>
                    <p className="text-sm text-muted-foreground italic">"Investment Income Documents"</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">Great PBC Item</p>
                    <p className="text-sm text-foreground">"Form 1099-B from Charles Schwab (showing your stock sales for the year)"</p>
                  </div>
                </div>
              </div>
              <p className="text-base">
                A well-structured PBC checklist should include specific document names, the source of the document, clear due dates, and a way for the client to mark each item as complete.
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">How to Automate Your PBC Checklists</h2>
              <p className="text-base">
                Creating a custom checklist from scratch for every single client is incredibly time-consuming. Modern accounting firms automate this process using specialized document vaults. Here is how the automation workflow looks in a platform like Ledger Stash:
              </p>
              <ol className="list-decimal pl-6 space-y-4 text-base">
                <li>
                  <strong className="text-foreground">Use Pre-Built Templates.</strong> Instead of starting from a blank page, you start with a template. Ledger Stash includes pre-built templates for common engagements (1040, 1120-S, 1065, Monthly Bookkeeping). You apply the template and tweak it for the specific client.
                </li>
                <li>
                  <strong className="text-foreground">Leverage Prior-Year Return Scanning.</strong> The most advanced way to build a PBC checklist is to let AI do it. Upload a client's prior-year 1040 and the AI scans the return, identifies all income sources, and automatically generates a personalized PBC checklist for the current year.
                </li>
                <li>
                  <strong className="text-foreground">Automate the Follow-Up.</strong> Once the checklist is sent, the software takes over. If the client has only uploaded 3 of their 5 required documents, the system automatically sends them a reminder email every 7 days until the list is complete.
                </li>
                <li>
                  <strong className="text-foreground">Deploy AI Assistants.</strong> When clients ask "what do I still owe you?", Ledger Stash's built-in AI assistant (Scout) reads their specific PBC checklist and replies instantly with the outstanding items.
                </li>
              </ol>

              <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">The Bottom Line</h2>
              <p className="text-base">
                A PBC checklist is not just an administrative formality. It is the boundary line that protects your billable hours. When you give clients a specific, itemized list of exactly what you need, and you use software to automatically chase them until they provide it, you stop playing Document Police and get back to being an accountant.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-muted/30 border-t border-border">
          <div className="container">
            <div className="max-w-3xl mx-auto rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
              <h3 className="text-xl font-bold text-foreground mb-3">
                Ready to Automate Your PBC Checklists?
              </h3>
              <p className="text-muted-foreground mb-6">
                Ledger Stash is the secure document vault with Magic Links, automated reminders, and AI assistants built in. 14-day free trial, no credit card required.
              </p>
              <Button variant="hero" size="lg" asChild>
                <Link to="/signup" className="gap-2">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
