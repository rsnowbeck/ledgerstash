import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Pricing as PricingSection } from "@/components/landing/Pricing";
import { PageSEO } from "@/components/seo/PageSEO";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageSEO
        title="Pricing | Secure Client Vault Plans | Ledger Stash"
        description="Simple, transparent pricing for your secure client vault. Solo CPA $29/mo, Boutique Firm $79/mo, Enterprise Vault $199/mo. 14-day free trial included."
        keywords="client vault pricing, accounting portal cost, CPA software pricing, secure document exchange plans"
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
