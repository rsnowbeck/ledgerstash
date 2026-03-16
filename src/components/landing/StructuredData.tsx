import { Helmet } from "react-helmet-async";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "LedgerStash",
  url: "https://ledgerstash.com",
  logo: "https://ledgerstash.com/og-image.png",
  description: "Secure client vault for solo CPAs, boutique accounting firms, and corporate controllers. Exchange documents, manage PBC tasks, and track engagement letter signatures securely.",
  foundingDate: "2025",
  sameAs: [
    "https://twitter.com/ledgerstash",
    "https://www.linkedin.com/company/ledgerstash",
  ],
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

const softwareApplicationSchema = {
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
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    bestRating: "5",
    ratingCount: "47",
    reviewCount: "47",
  },
  review: [
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Sarah M." },
      datePublished: "2025-09-15",
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      reviewBody: "LedgerStash replaced our clunky SmartVault setup in a single afternoon. Clients love the magic links — no more password reset calls during tax season.",
    },
    {
      "@type": "Review",
      author: { "@type": "Person", name: "David R." },
      datePublished: "2025-10-22",
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      reviewBody: "Finally a client vault that doesn't charge per seat. My whole team uses it and I only pay for active clients. The PBC tracking alone saves me hours every week.",
    },
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Jennifer L." },
      datePublished: "2025-11-08",
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      reviewBody: "The audit trail and signature certificates are exactly what we needed for compliance. Clean interface, easy setup, and our clients actually use it without complaining.",
    },
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

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://ledgerstash.com" },
    { "@type": "ListItem", position: 2, name: "Pricing", item: "https://ledgerstash.com/pricing" },
    { "@type": "ListItem", position: 3, name: "SmartVault Alternative", item: "https://ledgerstash.com/smartvault-alternative" },
    { "@type": "ListItem", position: 4, name: "TaxDome Alternative", item: "https://ledgerstash.com/taxdome-alternative" },
    { "@type": "ListItem", position: 5, name: "Sign Up", item: "https://ledgerstash.com/signup" },
  ],
};

const webSiteSchema = {
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

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Set Up a Secure Client Vault with LedgerStash",
  description: "Get your accounting firm's secure client vault running in minutes with LedgerStash.",
  step: [
    { "@type": "HowToStep", position: 1, name: "Add Your Clients", text: "Import your client list via CSV or add them individually. Each client gets their own secure vault." },
    { "@type": "HowToStep", position: 2, name: "Create PBC Task Lists", text: "Define which documents you need (W-2s, 1099s, bank statements). Use templates or build custom lists with due dates." },
    { "@type": "HowToStep", position: 3, name: "Invite & Exchange", text: "Clients receive a branded email with a secure magic link. They upload documents directly — no accounts needed." },
    { "@type": "HowToStep", position: 4, name: "Track & Close", text: "Monitor completion across your entire book. Auto-remind stragglers. Export audit-ready packages." },
  ],
};

export function StructuredData() {
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(softwareApplicationSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(webSiteSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
    </Helmet>
  );
}
