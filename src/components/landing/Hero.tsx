import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Shield, Clock, FileCheck } from "lucide-react";
export function Hero() {
  return <section className="section-hero pt-28 lg:pt-40 pb-20 lg:pb-32">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground mb-8 animate-fade-in">
            <Shield className="h-4 w-4 text-accent" />
            <span>Audit-ready proof, without complexity</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-5 animate-slide-up">Compliance&nbsp;Acknowledgments<br /><span className="text-accent font-bold inline-block mt-2">Simplified</span></h1>

          {/* Subheadline */}
          <p className="mx-auto max-w-[39rem] text-lg text-muted-foreground mb-10 animate-slide-up" style={{
          animationDelay: "0.1s"
        }}>
            Collect legally defensible signatures for policies, NDAs, and training. 
            No logins for signers. Audit-ready proof in seconds.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up" style={{
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
              <span>Setup in 5 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* Feature Cards Preview */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto animate-slide-up" style={{
        animationDelay: "0.4s"
      }}>
          <div className="card-elevated p-6 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent mb-4">
              <FileCheck className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">One-Click Signatures</h3>
            <p className="text-sm text-muted-foreground">
              Signers acknowledge in seconds. No accounts, no passwords.
            </p>
          </div>

          <div className="card-elevated p-6 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent mb-4">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Audit-Ready Proof</h3>
            <p className="text-sm text-muted-foreground">
              Timestamped records with IP tracking. Export PDFs instantly.
            </p>
          </div>

          <div className="card-elevated p-6 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent mb-4">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Automated Reminders</h3>
            <p className="text-sm text-muted-foreground">
              Never chase signatures again. We remind them for you.
            </p>
          </div>
        </div>
      </div>
    </section>;
}