import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Pricing as PricingSection } from "@/components/landing/Pricing";
import { PageSEO } from "@/components/seo/PageSEO";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageSEO
        title="Pricing | Affordable Digital Signature Plans"
        description="Simple, transparent pricing for digital signature software. Starter plan $29/mo for small teams, Pro $79/mo for growing organizations. 14-day free trial included."
        keywords="digital signature pricing, e-signature cost, compliance software pricing, signature platform plans, affordable e-signature"
        canonical="/pricing"
      />
      <Header />
      <main className="flex-1">
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
