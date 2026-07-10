import { lazy, Suspense } from "react";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { StructuredData } from "@/components/landing/StructuredData";
import { PageSEO } from "@/components/seo/PageSEO";

// Below-the-fold sections are lazy-loaded so the initial JS bundle stays small
// and the hero (LCP element) mounts and paints as early as possible on mobile.
const AISection = lazy(() => import("@/components/landing/AISection").then((m) => ({ default: m.AISection })));
const Features = lazy(() => import("@/components/landing/Features").then((m) => ({ default: m.Features })));
const HowItWorks = lazy(() => import("@/components/landing/HowItWorks").then((m) => ({ default: m.HowItWorks })));
const Pricing = lazy(() => import("@/components/landing/Pricing").then((m) => ({ default: m.Pricing })));
const Comparison = lazy(() => import("@/components/landing/Comparison").then((m) => ({ default: m.Comparison })));
const SocialProof = lazy(() => import("@/components/landing/SocialProof").then((m) => ({ default: m.SocialProof })));
const UseCases = lazy(() => import("@/components/landing/UseCases").then((m) => ({ default: m.UseCases })));
const FAQ = lazy(() => import("@/components/landing/FAQ").then((m) => ({ default: m.FAQ })));
const Footer = lazy(() => import("@/components/landing/Footer").then((m) => ({ default: m.Footer })));

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Ledger Stash — Secure Client Vault for Solo CPAs and Boutique Firms"
        description="The only CPA client portal with context-aware AI, flat pricing, and unlimited team members. No per-user fees. No annual contracts. No seat minimums. Set up in under 5 minutes. Start free for 14 days."
        keywords="client vault accounting, secure document exchange CPA, accounting firm client portal, tax document management, PBC list software"
        canonical="/"
        ogImage="https://ledgerstash.com/og-image.png"
      />
      <StructuredData />
      <Header />
      <main>
        <Hero />
        <Suspense fallback={null}>
          <AISection />
          <Comparison />
          <Features />
          <HowItWorks />
          <SocialProof />
          <Pricing />
          <UseCases />
          <FAQ />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}
