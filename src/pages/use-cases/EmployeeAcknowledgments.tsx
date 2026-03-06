import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageSEO } from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Clock, Shield, FileCheck, Download } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function EmployeeAcknowledgments() {
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Employee Policy Acknowledgment Software for SMBs"
        description="Track employee policy acknowledgments, recurring requirements, and signed documents with built-in audit logs and reminders. Simple internal document tracking for growing businesses."
        keywords="employee acknowledgment software, policy acknowledgment tracking, internal document tracking, employee signature tracking, employee handbook software, policy tracking software"
        canonical="/employee-acknowledgment-tracking"
      />
      <Header />
      <main className="pt-28 lg:pt-40 pb-16">
        <article className="container">
          <div className="mx-auto max-w-3xl">

            {/* Hero */}
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl mb-6">
              Employee Policy & Acknowledgment Tracking{" "}
              <span className="text-accent">for SMBs</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              Managing employee policy acknowledgments shouldn't rely on spreadsheets, email reminders, or manual tracking. Ledger Stash gives growing businesses a structured way to distribute internal documents, require acknowledgments, and maintain clear proof of completion — all in one system.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Whether you're rolling out a new handbook, updating security policies, or managing recurring confirmations, Ledger Stash keeps everything organized and easy to verify.
            </p>
            <div className="flex flex-col items-start gap-2 mb-14">
              <Button variant="hero" size="lg" asChild>
                <Link to="/signup">Start Free Trial</Link>
              </Button>
              <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1">
                View Pricing <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Why It Breaks Down */}
            <section className="mb-14">
              <h2 className="text-2xl font-bold text-foreground mb-4">Why Internal Document Tracking Breaks Down</h2>
              <p className="text-muted-foreground mb-4">
                Most companies start with simple tools — email attachments and spreadsheets. That works at first, but as teams grow, it creates operational risk.
              </p>
              <p className="text-muted-foreground mb-4">
                Policy acknowledgments get buried in inboxes. Spreadsheets fall out of date. Version control becomes unclear. And when leadership asks, "Who signed this?", the answer isn't immediate.
              </p>
              <p className="text-muted-foreground font-medium">
                The problem isn't sending documents.
                <br />
                It's tracking and proving completion.
              </p>
            </section>

            {/* A Structured System */}
            <section className="mb-14">
              <h2 className="text-2xl font-bold text-foreground mb-4">A Structured System for Employee Acknowledgments</h2>
              <p className="text-muted-foreground mb-4">
                Ledger Stash replaces scattered tracking systems with a purpose-built workflow for internal document management.
              </p>
              <p className="text-muted-foreground mb-4">
                Upload a policy or handbook once. Assign it to the appropriate employees or groups. Require a signature and any additional fields. Monitor completion in real time.
              </p>
              <p className="text-muted-foreground mb-4">
                Instead of chasing responses, you see exactly who has completed the document and who still needs to respond.
              </p>
              <p className="text-muted-foreground font-medium">
                Everything lives in one organized dashboard.
              </p>
            </section>

            {/* Recurring Requirements */}
            <section className="mb-14">
              <h2 className="text-2xl font-bold text-foreground mb-4">Built for Recurring Policy Requirements</h2>
              <p className="text-muted-foreground mb-4">
                Many internal documents aren't one-time events. Security policies, codes of conduct, and compliance confirmations often require annual or periodic acknowledgment.
              </p>
              <p className="text-muted-foreground mb-4">
                LedgerStash allows you to schedule recurring cycles so acknowledgments renew automatically. Employees are notified when action is required, and historical completion records are preserved across cycles.
              </p>
              <p className="text-muted-foreground font-medium">
                No resets. No duplicate tracking systems.
              </p>
            </section>

            {/* Use Cases */}
            <section className="mb-14">
              <h2 className="text-2xl font-bold text-foreground mb-4">Designed for Real-World Internal Use Cases</h2>
              <p className="text-muted-foreground mb-4">LedgerStash is commonly used to manage:</p>
              <ul className="space-y-3 mb-4">
                {[
                  "Employee handbook acknowledgments",
                  "Code of conduct confirmations",
                  "Security policy updates",
                  "IT access agreements",
                  "Confidentiality acknowledgments",
                  "Workplace safety confirmations",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground">
                If it requires a signature and proof of completion, LedgerStash keeps it structured and visible.
              </p>
            </section>

            {/* Why Not E-Signature */}
            <section className="mb-14">
              <h2 className="text-2xl font-bold text-foreground mb-4">Why Not Just Use an E-Signature Tool?</h2>
              <p className="text-muted-foreground mb-4">
                Traditional e-signature platforms are designed for contracts and one-off transactions.
              </p>
              <p className="text-muted-foreground mb-4">
                Internal document tracking is different. It requires recurring workflows, visibility across teams, automated reminders, and easy access to historical records.
              </p>
              <p className="text-muted-foreground">
                LedgerStash is built specifically for that ongoing internal process — without enterprise software complexity.
              </p>
            </section>

            {/* Proof */}
            <section className="mb-14">
              <h2 className="text-2xl font-bold text-foreground mb-4">Proof When You Need It</h2>
              <p className="text-muted-foreground mb-4">Every completed acknowledgment includes:</p>
              <ul className="space-y-3">
                {[
                  { icon: Clock, text: "Timestamped activity history" },
                  { icon: Shield, text: "IP tracking" },
                  { icon: FileCheck, text: "Secure document storage" },
                  { icon: Download, text: "Downloadable PDF copies" },
                  { icon: Download, text: "Exportable completion data" },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-3">
                    <item.icon className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item.text}</span>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground mt-4">
                So when you need documentation, it's ready.
              </p>
            </section>

            {/* FAQ */}
            <section className="mb-14">
              <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="recurring">
                  <AccordionTrigger>Can I require recurring annual acknowledgments?</AccordionTrigger>
                  <AccordionContent>Yes. You can schedule recurring acknowledgment cycles so employees are automatically notified when renewal is required.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="offboarding">
                  <AccordionTrigger>What happens when an employee leaves the company?</AccordionTrigger>
                  <AccordionContent>You can archive recipients while keeping historical completion records intact for reporting or audits.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="export">
                  <AccordionTrigger>Can I export acknowledgment records for audits?</AccordionTrigger>
                  <AccordionContent>Yes. Every completed acknowledgment includes timestamped activity logs, IP tracking, and downloadable PDF proof.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            {/* CTA */}
            <section className="text-center py-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Start tracking employee acknowledgments in minutes</h2>
              <p className="text-muted-foreground mb-8">
                No complex setup. No training required.
              </p>
              <Button variant="hero" size="xl" asChild>
                <Link to="/signup" className="gap-2">
                  Start Your 14-Day Free Trial
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </section>

          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
