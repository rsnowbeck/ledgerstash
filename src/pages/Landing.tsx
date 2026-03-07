import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
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
        title="Secure Client Vault for Accounting Firms | Ledger Stash"
        description="Give your accounting firm a branded, secure vault where clients upload documents, complete PBC tasks, and stay organized — with end-to-end encryption and automated follow-ups."
        keywords="client vault accounting, secure document exchange CPA, accounting firm client portal, tax document management, PBC list software"
        canonical="/"
      />
      <StructuredData />
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <Comparison />
        <UseCases />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
