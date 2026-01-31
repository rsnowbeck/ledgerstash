import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, AlertCircle, FileText, Loader2, Shield, ExternalLink } from "lucide-react";

interface SigningData {
  recipientName: string;
  recipientEmail: string;
  requirementTitle: string;
  requirementDescription: string | null;
  attachmentUrl: string | null;
  attachmentName: string | null;
  organizationName: string;
  organizationLogo: string | null;
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
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </div>
          <p className="text-muted-foreground font-medium">Loading your document...</p>
        </div>
      </div>
    );
  }

  if (pageState === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-destructive/20">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-3">Unable to Load</h2>
            <p className="text-muted-foreground leading-relaxed">{errorMessage}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (pageState === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-primary/20">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 animate-in zoom-in-50 duration-300">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Signature Complete!</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Thank you for acknowledging this document. You may now close this page.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5" />
              <span>Your signature has been securely recorded</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex flex-col">
      {/* Header - Sticky on mobile */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 px-4 py-4 safe-area-inset-top">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Signing request from</p>
            <p className="font-semibold text-foreground">{signingData?.organizationName}</p>
          </div>
          {signingData?.organizationLogo && (
            <img 
              src={signingData.organizationLogo} 
              alt={signingData.organizationName}
              className="h-10 w-10 rounded-lg object-contain"
            />
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Recipient Badge */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
              <span className="text-sm font-medium">{signingData?.recipientName}</span>
            </div>
          </div>

          {/* Document Card */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-4 bg-muted/30">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg leading-tight mb-1">
                    {signingData?.requirementTitle}
                  </CardTitle>
                  {signingData?.requirementDescription && (
                    <CardDescription className="line-clamp-3">
                      {signingData.requirementDescription}
                    </CardDescription>
                  )}
                </div>
              </div>
            </CardHeader>
            {signingData?.attachmentUrl && (
              <CardContent className="pt-4 pb-4">
                <a
                  href={signingData.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors touch-manipulation"
                >
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {signingData.attachmentName || 'View Attachment'}
                    </p>
                    <p className="text-xs text-muted-foreground">Tap to view document</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </a>
              </CardContent>
            )}
          </Card>

          {/* Acknowledgment Section */}
          <Card>
            <CardContent className="pt-6 pb-6 space-y-6">
              {/* Checkbox - Large touch target */}
              <button
                type="button"
                onClick={() => setAcknowledged(!acknowledged)}
                className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all touch-manipulation ${
                  acknowledged 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/30 hover:bg-muted/50'
                }`}
              >
                <div className={`h-6 w-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  acknowledged 
                    ? 'bg-primary border-primary' 
                    : 'border-muted-foreground/30'
                }`}>
                  {acknowledged && (
                    <CheckCircle className="h-4 w-4 text-primary-foreground" />
                  )}
                </div>
                <span className="text-sm text-foreground text-left leading-relaxed">
                  I have read and acknowledge this document. I understand that this acknowledgment is legally binding.
                </span>
              </button>

              {/* Signature Input - Large for mobile */}
              <div className="space-y-3">
                <label htmlFor="signedName" className="text-sm font-medium text-foreground block">
                  Type your full name to sign
                </label>
                <Input
                  id="signedName"
                  placeholder="Your full legal name"
                  value={signedName}
                  onChange={(e) => setSignedName(e.target.value)}
                  className="h-14 text-lg px-4 touch-manipulation"
                  autoComplete="name"
                  autoCapitalize="words"
                  enterKeyHint="done"
                />
                {signedName && (
                  <div className="p-3 rounded-lg bg-muted/50 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Signature preview</p>
                    <p className="text-lg font-serif italic text-foreground">{signedName}</p>
                  </div>
                )}
              </div>

              {/* Submit Button - Extra large for mobile */}
              <Button
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                className="w-full h-14 text-base font-semibold touch-manipulation"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Sign & Acknowledge'
                )}
              </Button>

              {/* Security Notice */}
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
                <Shield className="h-3.5 w-3.5" />
                <span>Your IP address and timestamp will be recorded</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer - Safe area aware */}
      <footer className="border-t bg-background px-4 py-4 mt-auto safe-area-inset-bottom">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-xs text-muted-foreground">
            Secured by <span className="font-semibold">Attestly</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
