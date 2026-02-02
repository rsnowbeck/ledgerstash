import { useEffect } from "react";

export function useOrganizationSchema() {
  useEffect(() => {
    const existingScript = document.querySelector('script[data-org-schema]');
    if (existingScript) return;

    const schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Attestly",
      "url": "https://getattestly.com",
      "logo": "https://getattestly.com/og-image.png",
      "description": "Compliance signature management platform for collecting legally defensible digital signatures for policies, NDAs, and training acknowledgments.",
      "foundingDate": "2025",
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "hello@attestly.com",
        "contactType": "customer support",
        "availableLanguage": "English"
      },
      "sameAs": [
        "https://twitter.com/getattestly"
      ]
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

export function useWebsiteSchema() {
  useEffect(() => {
    const existingScript = document.querySelector('script[data-website-schema]');
    if (existingScript) return;

    const schema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Attestly",
      "url": "https://getattestly.com",
      "description": "Streamline compliance acknowledgments with secure digital signatures. Track, manage, and automate policy sign-offs for your organization.",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://getattestly.com/?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
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

export function useSoftwareApplicationSchema() {
  useEffect(() => {
    const existingScript = document.querySelector('script[data-software-schema]');
    if (existingScript) return;

    const schema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Attestly",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "description": "Compliance signature management platform for collecting legally defensible digital signatures without requiring signer accounts.",
      "offers": [
        {
          "@type": "Offer",
          "name": "Starter",
          "price": "29",
          "priceCurrency": "USD",
          "priceValidUntil": "2027-12-31",
          "description": "100 recipients, 10 requirements, email support"
        },
        {
          "@type": "Offer",
          "name": "Pro",
          "price": "79",
          "priceCurrency": "USD",
          "priceValidUntil": "2027-12-31",
          "description": "500 recipients, unlimited requirements, custom branding"
        }
      ],
      "featureList": [
        "One-click digital signatures",
        "No signer accounts required",
        "Audit trail with timestamps and IP addresses",
        "Automated reminder emails",
        "PDF proof export",
        "CSV recipient import",
        "Team management",
        "Custom branding (Pro)"
      ],
      "screenshot": "https://getattestly.com/og-image.png",
      "url": "https://getattestly.com"
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
  useWebsiteSchema();
  useSoftwareApplicationSchema();
  return null;
}
