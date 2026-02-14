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
import Recipients from "./pages/Recipients";
import Requirements from "./pages/Requirements";
import RequirementDetail from "./pages/RequirementDetail";
import Sign from "./pages/Sign";
import Signatures from "./pages/Signatures";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Security from "./pages/Security";
import Pricing from "./pages/Pricing";
import Settings from "./pages/Settings";
import AcceptInvite from "./pages/AcceptInvite";
import NotFound from "./pages/NotFound";
import ComplianceSoftware from "./pages/seo/ComplianceSoftware";
import PolicyAcknowledgment from "./pages/seo/PolicyAcknowledgment";
import FillablePdfForms from "./pages/seo/FillablePdfForms";
import DigitalPolicySignature from "./pages/seo/DigitalPolicySignature";
import DocusignAlternative from "./pages/seo/DocusignAlternative";

const queryClient = new QueryClient();

const App = () => {
  // Prevent search engines from indexing lovable.app domain
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
          <Route path="/recipients" element={<Recipients />} />
          <Route path="/requirements" element={<Requirements />} />
          <Route path="/requirements/:id" element={<RequirementDetail />} />
          <Route path="/signatures" element={<Signatures />} />
          <Route path="/sign/:token" element={<Sign />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/security" element={<Security />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/accept-invite" element={<AcceptInvite />} />
          <Route path="/compliance-software-small-business" element={<ComplianceSoftware />} />
          <Route path="/policy-acknowledgment-software" element={<PolicyAcknowledgment />} />
          <Route path="/fillable-pdf-compliance-forms" element={<FillablePdfForms />} />
          <Route path="/digital-policy-signature-software" element={<DigitalPolicySignature />} />
          <Route path="/docusign-alternative-compliance" element={<DocusignAlternative />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
