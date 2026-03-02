import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, Shield, FileText, ExternalLink } from "lucide-react";
import { FormField } from "./FormFieldTypes";

interface SignerFormViewProps {
  fields: FormField[];
  pdfUrl: string;
  pdfName: string | null;
  requirementTitle: string;
  organizationName: string;
  organizationLogo: string | null;
  recipientName: string;
  onSubmit: (responses: Record<string, any>, signedName: string) => Promise<void>;
  isSubmitting: boolean;
}

export function SignerFormView({
  fields,
  pdfUrl,
  pdfName,
  requirementTitle,
  organizationName,
  organizationLogo,
  recipientName,
  onSubmit,
  isSubmitting,
}: SignerFormViewProps) {
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [signedName, setSignedName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateResponse = (key: string, value: any) => {
    setResponses((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    fields.forEach((field) => {
      if (field.required) {
        const val = responses[field.key];
        if (field.type === "checkbox") {
          if (!val) newErrors[field.key] = "This field is required";
        } else if (!val || (typeof val === "string" && !val.trim())) {
          newErrors[field.key] = "This field is required";
        }
      }
      
      if (field.type === "email" && responses[field.key]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(responses[field.key])) {
          newErrors[field.key] = "Please enter a valid email";
        }
      }
    });

    // Signature field check
    const sigField = fields.find((f) => f.type === "signature");
    if (sigField && sigField.required && !responses[sigField.key]?.trim()) {
      newErrors[sigField.key] = "Signature is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    
    // Use the signature field value as signedName if present
    const sigField = fields.find((f) => f.type === "signature");
    const name = sigField ? responses[sigField.key] : signedName;
    
    await onSubmit(responses, name || recipientName);
  };

  const renderField = (field: FormField) => {
    const hasError = !!errors[field.key];

    switch (field.type) {
      case "checkbox":
        return (
          <div key={field.id} className="flex items-start gap-3">
            <Checkbox
              id={field.key}
              checked={Boolean(responses[field.key])}
              onCheckedChange={(checked) => updateResponse(field.key, checked)}
              className="mt-0.5"
            />
            <div>
              <Label htmlFor={field.key} className="text-sm cursor-pointer">
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>
              {hasError && <p className="text-xs text-destructive mt-1">{errors[field.key]}</p>}
            </div>
          </div>
        );

      case "signature":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.key} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={field.key}
              placeholder="Type your full name to sign"
              value={responses[field.key] || ""}
              onChange={(e) => updateResponse(field.key, e.target.value)}
              className={`h-14 text-lg ${hasError ? "border-destructive" : ""}`}
              autoCapitalize="words"
            />
            {responses[field.key] && (
              <div className="p-3 rounded-lg bg-muted/50 border border-border text-center">
                <p className="text-xs text-muted-foreground mb-1">Signature preview</p>
                <p
                  className="text-2xl text-foreground"
                  style={{ fontFamily: "'Brush Script MT', 'Segoe Script', cursive" }}
                >
                  {responses[field.key]}
                </p>
              </div>
            )}
            {hasError && <p className="text-xs text-destructive">{errors[field.key]}</p>}
          </div>
        );

      default:
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.key} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={field.key}
              type={field.type === "date" ? "date" : field.type === "number" ? "number" : field.type === "email" ? "email" : "text"}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              value={responses[field.key] || ""}
              onChange={(e) => updateResponse(field.key, e.target.value)}
              className={`h-12 touch-manipulation ${hasError ? "border-destructive" : ""}`}
            />
            {hasError && <p className="text-xs text-destructive">{errors[field.key]}</p>}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Form from</p>
            <p className="font-semibold text-foreground">{organizationName}</p>
          </div>
          {organizationLogo && (
            <img src={organizationLogo} alt={organizationName} className="h-10 w-10 rounded-lg object-contain" />
          )}
        </div>
      </header>

      <main className="flex-1 px-4 py-6">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Recipient Badge */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
              <span className="text-sm font-medium">{recipientName}</span>
            </div>
          </div>

          {/* Document */}
          <Card>
            <CardHeader className="pb-4 bg-muted/30">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{requirementTitle}</CardTitle>
                </div>
              </div>
            </CardHeader>
            {pdfUrl && (
              <CardContent className="pt-4 pb-4">
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <FileText className="h-5 w-5 text-accent" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{pdfName || "View Document"}</p>
                    <p className="text-xs text-muted-foreground">Tap to view document</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>
              </CardContent>
            )}
          </Card>

          {/* Form Fields */}
          <Card>
            <CardContent className="pt-6 pb-6 space-y-5">
              {fields.filter(f => f.type !== "signature").map(renderField)}
              
              {/* Signature fields last */}
              {fields.filter(f => f.type === "signature").map(renderField)}

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full h-14 text-base font-semibold touch-manipulation"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Form"
                )}
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
                <Shield className="h-3.5 w-3.5" />
                <span>Your IP address and timestamp will be recorded</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t bg-background px-4 py-4 mt-auto">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-xs text-muted-foreground">
            Secured by <span className="font-semibold">VaultLedger</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
