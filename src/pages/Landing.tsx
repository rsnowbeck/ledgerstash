import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";
import { StructuredData } from "@/components/landing/StructuredData";
import { PageSEO } from "@/components/seo/PageSEO";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Attestly | Compliance Software for Small Businesses"
        description="Simple compliance form software for small businesses. Collect policy acknowledgments, employee handbook signatures & fillable PDF forms. No signer accounts needed. Audit-ready tracking. Start free."
        keywords="compliance software small business, compliance form software, policy acknowledgment software, employee acknowledgment tracking, fillable PDF compliance software, no-login e-signature, audit-ready compliance tracking, DocuSign alternative, employee handbook software, policy tracking software"
        canonical="/"
      />
      <StructuredData />
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}