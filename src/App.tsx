import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useNoIndexLovable } from "@/hooks/useNoIndexLovable";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";

// Lazy-loaded routes for code splitting
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Clients = lazy(() => import("./pages/Clients"));
const ClientDetail = lazy(() => import("./pages/ClientDetail"));
const Documents = lazy(() => import("./pages/Documents"));
const Contact = lazy(() => import("./pages/Contact"));
const ContactSubmissions = lazy(() => import("./pages/ContactSubmissions"));
const OwnerDashboard = lazy(() => import("./pages/OwnerDashboard"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Security = lazy(() => import("./pages/Security"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Settings = lazy(() => import("./pages/Settings"));
const AcceptInvite = lazy(() => import("./pages/AcceptInvite"));
const Welcome = lazy(() => import("./pages/Welcome"));
const ClientPortal = lazy(() => import("./pages/ClientPortal"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AvatarPreview = lazy(() => import("./pages/AvatarPreview"));
const Recipients = lazy(() => import("./pages/Recipients"));
const Requirements = lazy(() => import("./pages/Requirements"));
const RequirementDetail = lazy(() => import("./pages/RequirementDetail"));
const Signatures = lazy(() => import("./pages/Signatures"));
const Sign = lazy(() => import("./pages/Sign"));
const ComplianceSoftware = lazy(() => import("./pages/seo/ComplianceSoftware"));
const PolicyAcknowledgment = lazy(() => import("./pages/seo/PolicyAcknowledgment"));
const FillablePdfForms = lazy(() => import("./pages/seo/FillablePdfForms"));
const DigitalPolicySignature = lazy(() => import("./pages/seo/DigitalPolicySignature"));
const DocusignAlternative = lazy(() => import("./pages/seo/DocusignAlternative"));
const SmartVaultAlternative = lazy(() => import("./pages/seo/SmartVaultAlternative"));
const TaxDomeAlternative = lazy(() => import("./pages/seo/TaxDomeAlternative"));
const TrackPolicyAcknowledgments = lazy(() => import("./pages/blog/TrackPolicyAcknowledgments"));
const ClientIntakeForms = lazy(() => import("./pages/use-cases/ClientIntakeForms"));
const ContractorAgreements = lazy(() => import("./pages/use-cases/ContractorAgreements"));
const EmployeeAcknowledgments = lazy(() => import("./pages/use-cases/EmployeeAcknowledgments"));
const Compare = lazy(() => import("./pages/Compare"));

const queryClient = new QueryClient();

const App = () => {
  useNoIndexLovable();

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:id" element={<ClientDetail />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/owner" element={<OwnerDashboard />} />
            <Route path="/owner/inquiries" element={<ContactSubmissions />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/security" element={<Security />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/accept-invite" element={<AcceptInvite />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/portal/:token" element={<ClientPortal />} />
            <Route path="/recipients" element={<Recipients />} />
            <Route path="/requirements" element={<Requirements />} />
            <Route path="/requirements/:id" element={<RequirementDetail />} />
            <Route path="/signatures" element={<Signatures />} />
            <Route path="/sign" element={<Sign />} />
            {/* SEO Landing Pages */}
            <Route path="/compliance-software-small-business" element={<ComplianceSoftware />} />
            <Route path="/policy-acknowledgment-software" element={<PolicyAcknowledgment />} />
            <Route path="/fillable-pdf-compliance-forms" element={<FillablePdfForms />} />
            <Route path="/digital-policy-signature-software" element={<DigitalPolicySignature />} />
            <Route path="/docusign-alternative-compliance" element={<DocusignAlternative />} />
            <Route path="/smartvault-alternative" element={<SmartVaultAlternative />} />
            <Route path="/taxdome-alternative" element={<TaxDomeAlternative />} />
            <Route path="/compare" element={<Compare />} />
            {/* Blog */}
            <Route path="/blog/track-employee-policy-acknowledgments" element={<TrackPolicyAcknowledgments />} />
            {/* Use Cases */}
            <Route path="/client-intake-consent-forms" element={<ClientIntakeForms />} />
            <Route path="/contractor-vendor-agreement-tracking" element={<ContractorAgreements />} />
            <Route path="/employee-acknowledgment-tracking" element={<EmployeeAcknowledgments />} />
            <Route path="/avatar-preview" element={<AvatarPreview />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
