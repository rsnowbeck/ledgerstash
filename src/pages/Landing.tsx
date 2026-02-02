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
        title="Attestly | Digital Signature Software for Policy & Compliance Acknowledgments"
        description="Collect legally binding digital signatures for compliance policies, NDAs, and training acknowledgments. No signer accounts needed. Audit trail included. Start free trial."
        keywords="digital signature software, compliance signature, policy acknowledgment, e-signature platform, NDA signing, employee training acknowledgment, HR compliance software, electronic signature"
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