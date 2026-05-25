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
      headline: "How to Stop Chasing Clients for Documents: The 3-Step System for CPAs",
      description:
        "Are you spending 25% of your week playing Document Police? Here is the 3-step system solo CPAs use to automate document collection and stop chasing clients.",
      author: { "@type": "Organization", name: "Ledger Stash" },
      publisher: { "@type": "Organization", name: "Ledger Stash", url: "https://ledgerstash.com" },
      datePublished: "2026-01-15",
      mainEntityOfPage: "https://ledgerstash.com/blog/how-to-stop-chasing-clients-for-documents",
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-blog-schema", "true");
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    return () => {
      const el = document.querySelector("script[data-blog-schema]");
      if (el) el.remove();
    };
  }, []);
}

export default function StopChasingDocuments() {
  useBlogSchema();
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="How to Stop Chasing Clients for Documents | Ledger Stash"
        description="Are you spending 25% of your week playing Document Police? Here is the 3-step system solo CPAs use to automate document collection and stop chasing clients for good."
        keywords="stop chasing clients for documents, automate document collection CPA, client document reminders accounting, PBC checklist automation, magic link client portal"
        canonical="/blog/how-to-stop-chasing-clients-for-documents"
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
                How to Stop Chasing Clients for Documents: The 3-Step System for CPAs
              </h1>
              <p className="text-muted-foreground text-sm">Published January 15, 2026 · 6 min read</p>
            </div>
          </div>
        </section>

        {/* Article Body */}
        <section className="py-12">
          <div className="container">
            <div className="max-w-3xl mx-auto prose prose-neutral max-w-none space-y-6 text-muted-foreground leading-relaxed">

              <p className="text-base">
                Every January, accounting firms make the same resolution: <em>This year will be different. We are going to collect all our documents early.</em>
              </p>
              <p className="text-base">
                And every March, the reality sets in. You are sending your third follow-up email to a client who still hasn't uploaded their K-1. You are texting a business owner to ask for a clear photo of a receipt. You are spending 25% of your week playing "Document Police" instead of doing the actual tax work you are trained to do.
              </p>
              <p className="text-base">
                The problem isn't that your clients are lazy. The problem is that the system you are using to collect documents is full of friction. If you want to stop chasing clients for documents, you have to fix the system. Here is the 3-step framework that boutique firms and solo CPAs use to automate document collection and reclaim their billable hours.
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">Step 1: Eliminate the Password</h2>
              <p className="text-base">
                Friction is the enemy of compliance. Every time you ask a client to do something difficult, the chances of them doing it drop exponentially.
              </p>
              <p className="text-base">
                For the last decade, the standard way to collect documents has been the "secure client portal." The CPA sends an email with a link. The client clicks the link and is asked to create an account, verify their email, and create a password with a capital letter, a number, and a special character.
              </p>
              <p className="text-base">
                Six months later, they need to upload another document. They have forgotten the password. They click "Forgot Password," wait for the reset email, and get frustrated. Ultimately, they give up and just email you the document directly, completely defeating the purpose of the secure portal.
              </p>
              <h3 className="text-lg font-bold text-foreground mt-6 mb-3">The Fix: Use Magic Links</h3>
              <p className="text-base">
                You don't need clients to create accounts to securely collect documents. You need Magic Links. A Magic Link is a unique, encrypted URL sent directly to the client's email. When they click it, the system authenticates them instantly and drops them right into their secure vault. No account creation. No passwords to forget. No friction.
              </p>
              <p className="text-base">
                When you remove the password, you remove the primary reason clients procrastinate on uploading their documents.
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">Step 2: Stop Sending Generic Requests</h2>
              <p className="text-base">
                When a client receives an email that says, <em>"Please upload your tax documents for 2026,"</em> they don't know what that actually means.
              </p>
              <p className="text-base">
                To a CPA, "tax documents" means W-2s, 1099s, K-1s, 1098s, and bank statements. To a client, it means a pile of mail they haven't opened yet. If they aren't sure exactly what you need, they will wait until the last minute to figure it out.
              </p>
              <h3 className="text-lg font-bold text-foreground mt-6 mb-3">The Fix: Use Specific PBC Checklists</h3>
              <p className="text-base">
                A PBC (Provided by Client) checklist is a specific, itemized list of exactly what you need from that specific client. Instead of asking for "tax documents," your request should look like this:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-base">
                <li>W-2 from Acme Corp</li>
                <li>1099-INT from Chase Bank</li>
                <li>Schedule K-1 from 123 Main St LLC</li>
                <li>Form 1098 for primary residence</li>
              </ul>
              <p className="text-base">
                When the client sees a specific list, the task goes from an overwhelming, ambiguous project to a simple checklist they can cross off one by one. The best modern document vaults allow you to scan a client's prior-year return using AI to automatically generate this personalized checklist for the current year.
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">Step 3: Automate the Follow-Up</h2>
              <p className="text-base">
                Even with Magic Links and specific checklists, some clients will still forget. That is human nature. The mistake CPAs make is taking on the burden of reminding them manually. You did not get your CPA license to send reminder emails.
              </p>
              <h3 className="text-lg font-bold text-foreground mt-6 mb-3">The Fix: Let the Software Do the Chasing</h3>
              <p className="text-base">
                Your document collection system should have automated follow-ups built in. When you send the initial checklist, you should be able to set a schedule: <em>Remind this client every 7 days until the checklist is 100% complete.</em>
              </p>
              <p className="text-base">
                The software sends the email. The software tracks the uploads. The software stops the reminders when the job is done. If a client replies to the reminder email and asks, <em>"What do I still owe you?"</em>, you shouldn't have to answer that either. Context-aware AI assistants can read the client's specific checklist, see what they have uploaded, and reply instantly with the exact outstanding items.
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">The Bottom Line</h2>
              <p className="text-base">
                You cannot control your clients' behavior, but you can control the system they interact with. If you are tired of playing Document Police, you need to remove the friction of passwords, provide specific checklists, and automate the follow-ups. When you do that, the documents arrive on time, and you get your billable hours back.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-muted/30 border-t border-border">
          <div className="container">
            <div className="max-w-3xl mx-auto rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
              <h3 className="text-xl font-bold text-foreground mb-3">
                Ready to Stop Chasing?
              </h3>
              <p className="text-muted-foreground mb-6">
                Ledger Stash uses Magic Links, automated reminders, and Scout AI to collect your documents on time. 14-day free trial, no credit card required.
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
