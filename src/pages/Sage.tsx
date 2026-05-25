import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageSEO } from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, BarChart3, Bell, Search, Shield } from "lucide-react";

const capabilities = [
  {
    icon: Search,
    title: "Portfolio-Level Queries",
    description:
      'Ask "who hasn\'t uploaded anything in 7 days?" or "which clients are still missing a W-2?" and get a live answer based on your entire book of business — not just one client at a time.',
  },
  {
    icon: Bell,
    title: "Send Reminders From the Conversation",
    description:
      "When Sage identifies clients who are behind, you can trigger reminders directly from the chat. No need to navigate to each client record individually.",
  },
  {
    icon: BarChart3,
    title: "Season-Wide Progress Tracking",
    description:
      "Ask Sage for a status summary of your entire practice: how many clients are complete, how many are in progress, and how many haven't started yet.",
  },
  {
    icon: Shield,
    title: "Strictly Internal",
    description:
      "Sage is only accessible to your team. Clients never see Sage and Sage never communicates with clients directly. It is your private practice intelligence layer.",
  },
];

const exampleQueries = [
  {
    query: "Who hasn't uploaded anything in the last 7 days?",
    response: "4 clients have had no activity in the last 7 days: Johnson Family Trust, Meridian Consulting LLC, Park Avenue Dental, and Sunrise Bakery. Would you like me to send them a reminder?",
  },
  {
    query: "How many clients are fully complete this week?",
    response: "18 of your 42 active clients are fully complete (43%). 16 are in progress, and 8 haven't started yet. Your completion rate is up 12% from last week.",
  },
  {
    query: "Which clients are still missing a W-2?",
    response: "3 clients have an outstanding W-2 on their checklist: Martinez Household, Chen Family, and Williams & Associates. I can send them a targeted reminder if you'd like.",
  },
];

export default function Sage() {
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Sage — Practice Intelligence AI | Ledger Stash"
        description="Sage is Ledger Stash's CPA-facing AI agent. Ask it portfolio-level questions about your entire book of business, get live status reports, and trigger reminders — all from a single conversation."
        keywords="AI practice management accounting, CPA AI assistant, accounting portfolio AI, practice intelligence software, Sage AI ledger stash"
        canonical="/sage"
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="py-20 bg-gradient-to-b from-muted/40 to-background">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="rounded-full bg-primary/10 p-4 border border-primary/20">
                  <Zap className="h-10 w-10 text-primary" />
                </div>
              </div>
              <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-4">
                Meet Sage
              </p>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-6 leading-tight">
                Your Practice.<br />Queried in Seconds.
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Sage is the CPA-facing AI agent built into every Ledger Stash plan. Ask it anything about your book of business — who's behind, what's missing, how the season is tracking — and get a live answer based on your actual portfolio data.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/signup" className="gap-2">
                    Start Free Trial
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="xl" asChild>
                  <Link to="/scout">Meet Scout (Client-Side AI)</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">Included on every plan · No setup required</p>
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-foreground mb-4">What Sage Does</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Sage gives you a real-time view of your entire practice — without opening 40 individual client records.
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

        {/* Example Queries */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-foreground mb-4">Sage in Action</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Real examples of the questions CPAs ask Sage during tax season.
              </p>
            </div>
            <div className="max-w-3xl mx-auto space-y-6">
              {exampleQueries.map((ex, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-muted w-8 h-8 flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">You</div>
                    <div className="bg-muted rounded-xl rounded-tl-none px-4 py-3 text-sm text-foreground max-w-lg">
                      {ex.query}
                    </div>
                  </div>
                  <div className="flex items-start gap-3 flex-row-reverse">
                    <div className="rounded-full bg-primary/10 w-8 h-8 flex items-center justify-center shrink-0">
                      <Zap className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-primary/5 border border-primary/10 rounded-xl rounded-tr-none px-4 py-3 text-sm text-foreground max-w-lg">
                      {ex.response}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Scout vs Sage */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
                Scout vs. Sage — Two Agents, Two Audiences
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-foreground font-semibold">Feature</th>
                      <th className="text-center py-3 px-4 text-foreground font-semibold">Scout</th>
                      <th className="text-center py-3 px-4 text-foreground font-semibold">Sage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Who uses it", "Your clients", "Your team"],
                      ["What it knows", "One client's specific checklist", "Your entire portfolio"],
                      ["Primary function", "Answer document questions 24/7", "Portfolio queries and reminders"],
                      ["Can send reminders", "No", "Yes"],
                      ["Tax advice", "Blocked", "Not applicable"],
                      ["Conversation logging", "Full transcript logged", "Full transcript logged"],
                      ["Included on all plans", "✅ Yes", "✅ Yes"],
                    ].map(([feature, scout, sage], i) => (
                      <tr key={i} className="border-b border-border">
                        <td className="py-3 px-4 text-foreground font-medium">{feature}</td>
                        <td className="py-3 px-4 text-center text-muted-foreground">{scout}</td>
                        <td className="py-3 px-4 text-center text-muted-foreground">{sage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-card border-t border-border">
          <div className="container text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Get a Real-Time View of Your Practice
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Start your free trial and ask Sage your first portfolio question in under 5 minutes.
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
