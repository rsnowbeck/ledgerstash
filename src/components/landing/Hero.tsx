import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Shield, Clock, FileCheck } from "lucide-react";
export function Hero() {
  return <section className="section-hero pt-20 lg:pt-28 pb-16 lg:pb-24">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex -translate-y-2 items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground mb-8 -mt-4 animate-fade-in">
            <Shield className="h-4 w-4 text-accent" />
            <span>Built-in Audit-Ready Proof</span>
          </div>

          {/* Headline */}
          <h1 className="text-[2.1rem] font-extrabold tracking-tight leading-[1.12] text-foreground sm:text-[3.2rem] lg:text-[3.8rem] mb-3 animate-slide-up">Document Collection<br /><span className="text-accent font-bold">Simplified</span></h1>

          {/* Product Definition — AI-optimized */}
          <p className="mx-auto max-w-[42rem] text-base text-muted-foreground mb-8 animate-slide-up" style={{
            animationDelay: "0.08s"
          }}>
            Attestly helps small and mid-sized businesses send, collect, and track completed and signed documents — from employee policies to client intake forms — with built-in audit-ready proof and automated follow-ups.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-slide-up" style={{
          animationDelay: "0.2s"
        }}>
            <Button variant="hero" size="xl" asChild>
              <Link to="/signup" className="gap-2">
                Start 14-Day Free Trial
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({
            behavior: 'smooth'
          })}>
              See How It Works
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground animate-slide-up" style={{
          animationDelay: "0.3s"
        }}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span>Live in 5 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* Feature Cards Preview */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto animate-slide-up" style={{
        animationDelay: "0.4s"
      }}>
          <div className="card-elevated p-6 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent mb-4">
              <FileCheck className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Forms & Signatures</h3>
            <p className="text-sm text-muted-foreground">
              Upload a PDF, auto-detect fields, and collect required information, form responses, and signatures in one structured workflow.
            </p>
          </div>

          <div className="card-elevated p-6 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent mb-4">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Audit-Ready Proof</h3>
            <p className="text-sm text-muted-foreground">
              Timestamped records with IP tracking, organized response storage, and exportable completion reports.
            </p>
          </div>

          <div className="card-elevated p-6 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent mb-4">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Automated Reminders</h3>
            <p className="text-sm text-muted-foreground">
              Automatically follow up on incomplete documents so you never chase signatures manually.
            </p>
          </div>
        </div>
      </div>
    </section>;
}