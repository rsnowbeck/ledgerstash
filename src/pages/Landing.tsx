import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { AISection } from "@/components/landing/AISection";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Pricing } from "@/components/landing/Pricing";
import { Comparison } from "@/components/landing/Comparison";
import { SocialProof } from "@/components/landing/SocialProof";
import { UseCases } from "@/components/landing/UseCases";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";
import { StructuredData } from "@/components/landing/StructuredData";
import { PageSEO } from "@/components/seo/PageSEO";

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
        <AISection />
        <Comparison />
        <Features />
        <HowItWorks />
        <SocialProof />
        <Pricing />
        <UseCases />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
