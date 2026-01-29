import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, AlertCircle, FileText, Loader2, Shield } from "lucide-react";

interface SigningData {
  recipientName: string;
  recipientEmail: string;
  requirementTitle: string;
  requirementDescription: string | null;
  attachmentUrl: string | null;
  attachmentName: string | null;
  organizationName: string;
}

type PageState = 'loading' | 'ready' | 'success' | 'error';

export default function Sign() {
  const { token } = useParams<{ token: string }>();
  const [pageState, setPageState] = useState<PageState>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [signingData, setSigningData] = useState<SigningData | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);
  const [signedName, setSignedName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setErrorMessage('Invalid signing link');
      setPageState('error');
      return;
    }

    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-signing-token', {
        body: { action: 'verify', token },
      });

      if (error) {
        console.error('Verification error:', error);
        setErrorMessage(error.message || 'Unable to verify signing link');
        setPageState('error');
        return;
      }

      if (data.error) {
        setErrorMessage(data.error);
        setPageState('error');
        return;
      }

      setSigningData(data);
      setPageState('ready');
    } catch (err) {
      console.error('Unexpected error:', err);
      setErrorMessage('An unexpected error occurred');
      setPageState('error');
    }
  };

  const handleSubmit = async () => {
    if (!acknowledged || !signedName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-signing-token', {
        body: { action: 'complete', token, signedName: signedName.trim() },
      });

      if (error || data?.error) {
        setErrorMessage(data?.error || error?.message || 'Failed to submit signature');
        setPageState('error');
        return;
      }

      setPageState('success');
    } catch (err) {
      console.error('Submit error:', err);
      setErrorMessage('Failed to submit signature');
      setPageState('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = acknowledged && signedName.trim().length > 0;

  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (pageState === 'error') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Unable to Load</h2>
            <p className="text-muted-foreground">{errorMessage}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (pageState === 'success') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Signature Complete</h2>
            <p className="text-muted-foreground mb-4">
              Thank you for acknowledging this document. You may close this page.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3 w-3" />
              <span>Your signature has been securely recorded</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card px-4 py-3">
        <div className="max-w-lg mx-auto">
          <p className="text-sm text-muted-foreground">Signing request from</p>
          <p className="font-semibold text-foreground">{signingData?.organizationName}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Recipient Info */}
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-1">Document for</p>
            <p className="text-lg font-semibold text-foreground">{signingData?.recipientName}</p>
          </div>

          {/* Document Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-start gap-3 text-lg">
                <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>{signingData?.requirementTitle}</span>
              </CardTitle>
              {signingData?.requirementDescription && (
                <CardDescription className="ml-8">
                  {signingData.requirementDescription}
                </CardDescription>
              )}
            </CardHeader>
            {signingData?.attachmentUrl && (
              <CardContent className="pt-0">
                <a
                  href={signingData.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <FileText className="h-4 w-4" />
                  {signingData.attachmentName || 'View Attachment'}
                </a>
              </CardContent>
            )}
          </Card>

          {/* Acknowledgment Section */}
          <Card>
            <CardContent className="pt-6 space-y-6">
              {/* Checkbox */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id="acknowledge"
                  checked={acknowledged}
                  onCheckedChange={(checked) => setAcknowledged(checked === true)}
                  className="mt-0.5"
                />
                <label htmlFor="acknowledge" className="text-sm text-foreground cursor-pointer leading-relaxed">
                  I have read and acknowledge this document. I understand that this acknowledgment is legally binding.
                </label>
              </div>

              {/* Signature Input */}
              <div className="space-y-2">
                <label htmlFor="signedName" className="text-sm font-medium text-foreground">
                  Type your full name to sign
                </label>
                <Input
                  id="signedName"
                  placeholder="Your full legal name"
                  value={signedName}
                  onChange={(e) => setSignedName(e.target.value)}
                  className="text-lg"
                  autoComplete="name"
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Sign & Acknowledge'
                )}
              </Button>

              {/* Security Notice */}
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
                <Shield className="h-3 w-3" />
                <span>Your IP address and timestamp will be recorded</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card px-4 py-3 mt-auto">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-xs text-muted-foreground">
            Powered by <span className="font-semibold">Attestly</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
