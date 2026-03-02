import { useEffect } from "react";

export function useOrganizationSchema() {
  useEffect(() => {
    const existingScript = document.querySelector('script[data-org-schema]');
    if (existingScript) return;

    const schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "VaultLedger",
      url: "https://getvaultledger.com",
      logo: "https://getvaultledger.com/og-image.png",
      description: "Secure client vault for boutique accounting and tax firms. Exchange documents, manage PBC tasks, and communicate with clients securely.",
      foundingDate: "2025",
      contactPoint: {
        "@type": "ContactPoint",
        email: "hello@vaultledger.com",
        contactType: "customer support",
        availableLanguage: "English",
      },
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-org-schema", "true");
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const el = document.querySelector('script[data-org-schema]');
      if (el) el.remove();
    };
  }, []);
}

export function useSoftwareApplicationSchema() {
  useEffect(() => {
    const existingScript = document.querySelector('script[data-software-schema]');
    if (existingScript) return;

    const schema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "VaultLedger",
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Client Vault Software",
      operatingSystem: "Web",
      description: "Secure client vault for boutique accounting and tax firms. Simplify document exchange, PBC task management, and client communication.",
      offers: [
        { "@type": "Offer", name: "Solo CPA", price: "29", priceCurrency: "USD", priceValidUntil: "2027-12-31" },
        { "@type": "Offer", name: "Boutique Firm", price: "79", priceCurrency: "USD", priceValidUntil: "2027-12-31" },
        { "@type": "Offer", name: "Enterprise Vault", price: "199", priceCurrency: "USD", priceValidUntil: "2027-12-31" },
      ],
      featureList: [
        "Secure PBC list management",
        "Bank-grade compliance vault",
        "White-label client portal",
        "Busy Season auto-reminders",
        "Per-client folders",
        "Team collaboration",
        "Audit-ready export",
      ],
      url: "https://getvaultledger.com",
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-software-schema", "true");
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const el = document.querySelector('script[data-software-schema]');
      if (el) el.remove();
    };
  }, []);
}

export function StructuredData() {
  useOrganizationSchema();
  useSoftwareApplicationSchema();
  return null;
}
