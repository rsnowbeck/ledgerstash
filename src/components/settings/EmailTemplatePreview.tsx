import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Mail, Bell, AlertTriangle, Clock } from "lucide-react";

interface EmailTemplatePreviewProps {
  organizationName: string;
  senderName: string;
  logoUrl?: string | null;
  customMessage?: string | null;
}

export function EmailTemplatePreview({
  organizationName,
  senderName,
  logoUrl,
  customMessage
}: EmailTemplatePreviewProps) {
  const displaySender = senderName || organizationName || "Your Organization";
  
  // Build intro line matching the edge function logic
  const buildIntro = () => {
    if (senderName && organizationName) {
      return `${senderName} has requested that you review and sign the following document on behalf of ${organizationName}:`;
    } else if (senderName) {
      return `${senderName} has requested that you review and sign the following document:`;
    } else if (organizationName) {
      return `${organizationName} has requested that you review and sign the following document:`;
    }
    return `You have been requested to review and sign the following document:`;
  };
  
  const intro = buildIntro();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Template Previews
        </CardTitle>
        <CardDescription>
          See how your emails will appear to recipients
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="initial" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="initial" className="text-xs">
              <Mail className="h-3 w-3 mr-1" />
              Initial
            </TabsTrigger>
            <TabsTrigger value="reminder" className="text-xs">
              <Bell className="h-3 w-3 mr-1" />
              Reminder
            </TabsTrigger>
            <TabsTrigger value="escalated" className="text-xs">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Escalated
            </TabsTrigger>
            <TabsTrigger value="overdue" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              Overdue
            </TabsTrigger>
          </TabsList>

          <TabsContent value="initial" className="mt-4">
            <EmailPreviewFrame 
              subject="Action required: Please sign Annual Compliance Policy" 
              senderName={displaySender}
            >
              <EmailHeader logoUrl={logoUrl} />
              <div className="py-6">
                <p className="text-muted-foreground mb-4">Hi John Smith,</p>
                <p className="text-muted-foreground mb-6">
                  {intro}
                </p>
                <DocumentCard title="Annual Compliance Policy" />
                <DueDateBanner 
                  text="Please complete your signature by February 23, 2026." 
                  variant="info" 
                />
                {customMessage && <CustomMessageBanner message={customMessage} />}
                <p className="text-sm text-muted-foreground mb-6">
                  This request is part of a formal document acknowledgment process initiated by {organizationName || "the requester"}.
                </p>
                <CTAButton text="Review & Sign Now" />
                <ContactFooter senderName={senderName} organizationName={organizationName} />
              </div>
              <EmailFooter />
            </EmailPreviewFrame>
          </TabsContent>

          <TabsContent value="reminder" className="mt-4">
            <EmailPreviewFrame 
              subject="Reminder: Please sign Annual Compliance Policy" 
              senderName={displaySender}
            >
              <EmailHeader logoUrl={logoUrl} />
              <div className="py-6">
                <p className="text-muted-foreground mb-4">Hi John Smith,</p>
                <p className="text-muted-foreground mb-6">
                  {intro}
                </p>
                <DocumentCard title="Annual Compliance Policy" />
                <DueDateBanner 
                  text="Please complete your signature by February 23, 2026." 
                  variant="info" 
                />
                {customMessage && <CustomMessageBanner message={customMessage} />}
                <p className="text-sm text-muted-foreground mb-6">
                  This request is part of a formal document acknowledgment process initiated by {organizationName || "the requester"}.
                </p>
                <CTAButton text="Review & Sign Now" />
                <ContactFooter senderName={senderName} organizationName={organizationName} />
              </div>
              <EmailFooter />
            </EmailPreviewFrame>
          </TabsContent>

          <TabsContent value="escalated" className="mt-4">
            <EmailPreviewFrame 
              subject="Action required: Annual Compliance Policy signature due in 5 days" 
              senderName={displaySender}
            >
              <EmailHeader logoUrl={logoUrl} />
              <div className="py-6">
                <p className="text-muted-foreground mb-4">Hi John Smith,</p>
                <p className="text-muted-foreground mb-6">
                  {intro}
                </p>
                <DocumentCard title="Annual Compliance Policy" />
                <DueDateBanner 
                  text="⏰ Due in 5 days (February 23, 2026)" 
                  variant="warning" 
                />
                {customMessage && <CustomMessageBanner message={customMessage} />}
                <ConsequenceText text="Missing this deadline may be flagged in compliance records." variant="warning" />
                <p className="text-sm text-muted-foreground mb-6">
                  This request is part of a formal document acknowledgment process initiated by {organizationName || "the requester"}.
                </p>
                <CTAButton text="Review & Sign Now" />
                <ContactFooter senderName={senderName} organizationName={organizationName} />
              </div>
              <EmailFooter />
            </EmailPreviewFrame>
          </TabsContent>

          <TabsContent value="overdue" className="mt-4">
            <EmailPreviewFrame 
              subject="Overdue: Annual Compliance Policy signature was due February 23, 2026" 
              senderName={displaySender}
            >
              <EmailHeader logoUrl={logoUrl} />
              <div className="py-6">
                <p className="text-muted-foreground mb-4">Hi John Smith,</p>
                <p className="text-muted-foreground mb-6">
                  {intro}
                </p>
                <DocumentCard title="Annual Compliance Policy" />
                <DueDateBanner 
                  text="The due date was February 23, 2026." 
                  variant="error" 
                />
                {customMessage && <CustomMessageBanner message={customMessage} />}
                <ConsequenceText text="This has been marked as incomplete in compliance records." variant="error" />
                <p className="text-sm text-muted-foreground mb-6">
                  This request is part of a formal document acknowledgment process initiated by {organizationName || "the requester"}.
                </p>
                <CTAButton text="Review & Sign Now" />
                <ContactFooter senderName={senderName} organizationName={organizationName} />
              </div>
              <EmailFooter />
            </EmailPreviewFrame>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Sub-components for cleaner organization

function EmailHeader({ logoUrl }: { logoUrl?: string | null }) {
  return (
    <div className="text-center pb-6 border-b border-border">
      {logoUrl ? <img src={logoUrl} alt="Logo" className="h-8 mx-auto mb-2" /> : null}
      <h2 className="text-xl font-semibold text-foreground">Attestly</h2>
    </div>
  );
}

function DocumentCard({ title }: { title: string }) {
  return (
    <div className="bg-muted rounded-lg p-4 mb-2">
      <p className="text-xs text-muted-foreground uppercase tracking-wide">Document</p>
      <p className="font-semibold text-foreground">{title}</p>
    </div>
  );
}

function DueDateBanner({ text, variant }: { text: string; variant: "info" | "warning" | "error" }) {
  const variantStyles = {
    info: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-l-4 border-blue-500",
    warning: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-l-4 border-amber-500",
    error: "bg-red-500/10 text-red-700 dark:text-red-400 border-l-4 border-red-500",
  };

  return (
    <div className={`rounded-lg p-3 mb-4 text-sm font-medium ${variantStyles[variant]}`}>
      {text}
    </div>
  );
}

function ConsequenceText({ text, variant = "default" }: { text: string; variant?: "default" | "warning" | "error" }) {
  const variantStyles = {
    default: "text-muted-foreground",
    warning: "text-amber-700 dark:text-amber-400",
    error: "text-red-700 dark:text-red-400",
  };

  return (
    <p className={`text-sm mb-4 italic ${variantStyles[variant]}`}>
      {text}
    </p>
  );
}

function CustomMessageBanner({ message }: { message: string }) {
  return (
    <div className="bg-sky-500/10 border-l-4 border-sky-500 rounded-lg p-3 mb-4">
      <p className="text-xs text-sky-700 dark:text-sky-400 uppercase tracking-wide font-semibold mb-1">Note from sender</p>
      <p className="text-sm text-sky-800 dark:text-sky-300">{message}</p>
    </div>
  );
}

function CTAButton({ text }: { text: string }) {
  return (
    <div className="text-center">
      <span className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium">
        {text}
      </span>
    </div>
  );
}

function ContactFooter({ senderName, organizationName }: { senderName?: string; organizationName?: string }) {
  const contactText = organizationName 
    ? `If you have questions, please contact ${senderName || "the requester"} or your primary contact at ${organizationName}.`
    : `If you have questions, please contact ${senderName || "the requester"}.`;
  
  return (
    <p className="text-sm text-muted-foreground mt-6">
      {contactText}
    </p>
  );
}

function EmailFooter() {
  return (
    <div className="pt-4 border-t border-border text-center text-xs text-muted-foreground">
      <p>If you didn't expect this email, you can safely ignore it.</p>
      <p className="mt-2">Need help? Contact <span className="text-primary">hello@attestly.com</span></p>
      <p className="mt-2 text-[11px] text-muted-foreground/60">
        Powered by <span className="text-muted-foreground/80">Attestly</span>
      </p>
    </div>
  );
}

interface EmailPreviewFrameProps {
  subject: string;
  senderName: string;
  children: React.ReactNode;
}

function EmailPreviewFrame({
  subject,
  senderName,
  children
}: EmailPreviewFrameProps) {
  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      {/* Email Header */}
      <div className="bg-muted/50 px-4 py-3 border-b">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline" className="text-xs">Preview</Badge>
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex">
            <span className="text-muted-foreground w-16">From:</span>
            <span className="text-foreground">Attestly &lt;noreply@getattestly.com&gt;</span>
          </div>
          <div className="flex">
            <span className="text-muted-foreground w-16">Subject:</span>
            <span className="text-foreground font-medium">{subject}</span>
          </div>
        </div>
      </div>
      
      {/* Email Body */}
      <div className="p-6 max-h-[400px] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
