import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageSEO } from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Bot, Shield, MessageSquare, Clock, FileCheck, XCircle } from "lucide-react";

const capabilities = [
  {
    icon: MessageSquare,
    title: "Answers Checklist Questions Instantly",
    description:
      "When a client asks \"what do I still need to send you?\", Scout reads their specific vault checklist and replies with their exact outstanding items — not a generic response.",
  },
  {
    icon: Clock,
    title: "Available 24/7",
    description:
      "Scout works around your clients' schedules, not yours. Questions at 10pm on a Sunday get answered immediately without interrupting your weekend.",
  },
  {
    icon: Shield,
    title: "Tax Advice Explicitly Blocked",
    description:
      "Scout is strictly limited to document collection assistance. It cannot and will not provide tax advice, legal guidance, or financial recommendations. Every conversation is logged.",
  },
  {
    icon: FileCheck,
    title: "Every Conversation Is Logged",
    description:
      "You can review every Scout conversation from your dashboard. Full transcript, timestamp, and client attribution — a complete audit trail of every client interaction.",
  },
];

const notCapable = [
  "Scout cannot give tax advice",
  "Scout cannot access documents outside the client's own vault",
  "Scout cannot modify checklist items",
  "Scout cannot process payments or discuss billing",
  "Scout cannot access other clients' information",
];

const exampleConversations = [
  {
    client: "Hey, what do I still need to send you?",
    scout: "Hi! Based on your current checklist, you still have 2 items outstanding: your Form 1099-B from Charles Schwab and your Schedule K-1 from Main Street LLC. Everything else has been received. Let me know if you have any trouble finding those!",
  },
  {
    client: "I uploaded my W-2 — did you get it?",
    scout: "Yes! Your W-2 from Acme Corp was received and marked complete. You're all set on that one. Your remaining outstanding items are the 1099-B from Charles Schwab and the K-1 from Main Street LLC.",
  },
  {
    client: "Can you tell me if I should take the standard deduction?",
    scout: "That's a great question for your CPA — I'm only able to help with document collection for your current engagement. I'll make sure your accountant sees this when they review your file. Is there anything else I can help you find or upload?",
  },
];

export default function Scout() {
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Scout — Client AI Assistant | Ledger Stash"
        description="Scout is Ledger Stash's client-facing AI agent. It answers your clients' document questions 24/7, knows each client's specific checklist, and logs every conversation — so you don't have to be on call."
        keywords="AI client portal accounting, client AI assistant CPA, accounting AI document collection, Scout AI ledger stash, client document assistant"
        canonical="/scout"
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="py-20 bg-gradient-to-b from-muted/40 to-background">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="rounded-full bg-primary/10 p-4 border border-primary/20">
                  <Bot className="h-10 w-10 text-primary" />
                </div>
              </div>
              <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-4">
                Meet Scout
              </p>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-6 leading-tight">
                Your Clients' Questions.<br />Answered. Automatically.
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Scout is the client-facing AI agent built into every Ledger Stash plan. It knows each client's specific checklist, answers their document questions 24/7, and logs every conversation — so you never have to answer "what do I still owe you?" again.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/signup" className="gap-2">
                    Start Free Trial
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="xl" asChild>
                  <Link to="/sage">Meet Sage (CPA-Side AI)</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">Included on every plan · No setup required</p>
            </div>
          </div>
        </section>

        {/* What Scout Does */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-foreground mb-4">What Scout Does</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Scout is context-aware. It doesn't give generic answers — it reads each client's specific vault and responds with their actual outstanding items.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {capabilities.map((c) => (
                <div key={c.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <c.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground">{c.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Example Conversations */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-foreground mb-4">Scout in Action</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Real examples of how Scout handles the most common client questions.
              </p>
            </div>
            <div className="max-w-3xl mx-auto space-y-6">
              {exampleConversations.map((conv, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-muted w-8 h-8 flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">C</div>
                    <div className="bg-muted rounded-xl rounded-tl-none px-4 py-3 text-sm text-foreground max-w-lg">
                      {conv.client}
                    </div>
                  </div>
                  <div className="flex items-start gap-3 flex-row-reverse">
                    <div className="rounded-full bg-primary/10 w-8 h-8 flex items-center justify-center shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-primary/5 border border-primary/10 rounded-xl rounded-tr-none px-4 py-3 text-sm text-foreground max-w-lg">
                      {conv.scout}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What Scout Cannot Do */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
                What Scout Cannot Do
              </h2>
              <p className="text-muted-foreground text-center mb-8">
                Scout is deliberately limited to document collection assistance. These guardrails protect your clients and your firm.
              </p>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="space-y-3">
                  {notCapable.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Competitive Note */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">
                Exclusive to Ledger Stash
              </p>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                No Competitor Has This
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                SmartVault's SmartRequestAI generates intake checklists from prior-year returns — it does not answer client questions. TaxDome and Liscio have no client-facing AI agents at all. Scout is a Ledger Stash exclusive, included on every plan at no extra cost.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-card border-t border-border">
          <div className="container text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Let Scout Handle the Questions
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Start your free trial and see how many hours Scout saves you in the first week.
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
