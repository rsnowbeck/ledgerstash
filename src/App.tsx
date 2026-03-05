import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useNoIndexLovable } from "@/hooks/useNoIndexLovable";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import Documents from "./pages/Documents";
import Contact from "./pages/Contact";
import ContactSubmissions from "./pages/ContactSubmissions";
import OwnerDashboard from "./pages/OwnerDashboard";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Security from "./pages/Security";
import Pricing from "./pages/Pricing";
import Settings from "./pages/Settings";
import AcceptInvite from "./pages/AcceptInvite";
import Welcome from "./pages/Welcome";
import NotFound from "./pages/NotFound";
import Recipients from "./pages/Recipients";
import Requirements from "./pages/Requirements";
import RequirementDetail from "./pages/RequirementDetail";
import Signatures from "./pages/Signatures";
import Sign from "./pages/Sign";
import ComplianceSoftware from "./pages/seo/ComplianceSoftware";
import PolicyAcknowledgment from "./pages/seo/PolicyAcknowledgment";
import FillablePdfForms from "./pages/seo/FillablePdfForms";
import DigitalPolicySignature from "./pages/seo/DigitalPolicySignature";
import DocusignAlternative from "./pages/seo/DocusignAlternative";
import TrackPolicyAcknowledgments from "./pages/blog/TrackPolicyAcknowledgments";
import ClientIntakeForms from "./pages/use-cases/ClientIntakeForms";
import ContractorAgreements from "./pages/use-cases/ContractorAgreements";
import EmployeeAcknowledgments from "./pages/use-cases/EmployeeAcknowledgments";

const queryClient = new QueryClient();

const App = () => {
  useNoIndexLovable();

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
          {/* Blog */}
          <Route path="/blog/track-employee-policy-acknowledgments" element={<TrackPolicyAcknowledgments />} />
          {/* Use Cases */}
          <Route path="/client-intake-consent-forms" element={<ClientIntakeForms />} />
          <Route path="/contractor-vendor-agreement-tracking" element={<ContractorAgreements />} />
          <Route path="/employee-acknowledgment-tracking" element={<EmployeeAcknowledgments />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
