import { Helmet } from "react-helmet-async";

interface PageSEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  noindex?: boolean;
}

export function PageSEO({ 
  title, 
  description, 
  keywords,
  canonical,
  noindex = false 
}: PageSEOProps) {
  const fullTitle = title.includes("Attestly") ? title : `${title} | Attestly`;
  const baseUrl = "https://getattestly.com";
  const canonicalUrl = canonical ? `${baseUrl}${canonical}` : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      
      {/* Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}
