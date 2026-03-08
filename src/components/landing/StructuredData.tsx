import { useEffect } from "react";

export function useOrganizationSchema() {
  useEffect(() => {
    const existingScript = document.querySelector('script[data-org-schema]');
    if (existingScript) return;

    const schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "LedgerStash",
      url: "https://ledgerstash.com",
      logo: "https://ledgerstash.com/og-image.png",
      description: "Secure client vault for solo CPAs, boutique accounting firms, and corporate controllers. Exchange documents, manage PBC tasks, and track engagement letter signatures securely.",
      foundingDate: "2025",
      contactPoint: {
        "@type": "ContactPoint",
        email: "hello@ledgerstash.com",
        contactType: "customer support",
        availableLanguage: "English",
      },
      address: {
        "@type": "PostalAddress",
        addressCountry: "US",
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
      name: "LedgerStash",
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Client Vault Software",
      operatingSystem: "Web",
      description: "Secure client vault for solo CPAs and boutique accounting firms. Simplify document exchange, PBC task management, engagement letter tracking, and ESIGN-compliant audit trails.",
      offers: [
        { "@type": "Offer", name: "Solo CPA", price: "29", priceCurrency: "USD", priceValidUntil: "2027-12-31", description: "Up to 25 active clients, standard branding, unlimited team members" },
        { "@type": "Offer", name: "Boutique Firm", price: "79", priceCurrency: "USD", priceValidUntil: "2027-12-31", description: "Up to 100 clients, full white-labeling, Busy Season auto-reminders" },
        { "@type": "Offer", name: "Enterprise Vault", price: "199", priceCurrency: "USD", priceValidUntil: "2027-12-31", description: "Unlimited clients, advanced audit logs, dedicated support" },
      ],
      featureList: [
        "Secure PBC list management",
        "Bank-grade compliance vault (AES-256)",
        "White-label client portal",
        "Busy Season auto-reminders",
        "ESIGN & UETA compliant audit trails",
        "Engagement letter tracking",
        "Audit-ready export with PDF certificates",
        "Per-client folders",
        "Team collaboration (unlimited members)",
        "Real-time firm dashboard",
        "Frictionless client access (no passwords)",
      ],
      url: "https://ledgerstash.com",
      screenshot: "https://ledgerstash.com/og-image.png",
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

export function useBreadcrumbSchema() {
  useEffect(() => {
    const existingScript = document.querySelector('script[data-breadcrumb-schema]');
    if (existingScript) return;

    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://ledgerstash.com" },
        { "@type": "ListItem", position: 2, name: "Pricing", item: "https://ledgerstash.com/pricing" },
        { "@type": "ListItem", position: 3, name: "Sign Up", item: "https://ledgerstash.com/signup" },
      ],
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-breadcrumb-schema", "true");
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const el = document.querySelector('script[data-breadcrumb-schema]');
      if (el) el.remove();
    };
  }, []);
}

export function useWebSiteSchema() {
  useEffect(() => {
    const existingScript = document.querySelector('script[data-website-schema]');
    if (existingScript) return;

    const schema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "LedgerStash",
      url: "https://ledgerstash.com",
      description: "Secure client vault for accounting firms. Exchange documents, manage PBC tasks, and track signatures with end-to-end encryption.",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://ledgerstash.com/?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-website-schema", "true");
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const el = document.querySelector('script[data-website-schema]');
      if (el) el.remove();
    };
  }, []);
}

export function StructuredData() {
  useOrganizationSchema();
  useSoftwareApplicationSchema();
  useBreadcrumbSchema();
  useWebSiteSchema();
  return null;
}
