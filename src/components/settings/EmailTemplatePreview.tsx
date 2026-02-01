import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Mail, Bell, AlertTriangle, Clock } from "lucide-react";

interface EmailTemplatePreviewProps {
  organizationName: string;
  senderName: string;
  logoUrl?: string | null;
}

export function EmailTemplatePreview({
  organizationName,
  senderName,
  logoUrl
}: EmailTemplatePreviewProps) {
  const displaySender = senderName || organizationName || "Your Organization";
  
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
              subject="Signature requested for Annual Compliance Policy — due February 23, 2026" 
              senderName={displaySender}
            >
              <EmailHeader logoUrl={logoUrl} />
              <div className="py-6">
                <p className="text-muted-foreground mb-4">Hi John Smith,</p>
                <p className="text-muted-foreground mb-6">
                  {displaySender} has requested your signature on the following document:
                </p>
                <DocumentCard title="Annual Compliance Policy" />
                <DueDateBanner 
                  text="Please complete your signature by February 23, 2026." 
                  variant="info" 
                />
                <ConsequenceText text="Without your signature, this acknowledgment will remain incomplete in your organization's records." />
                <CTAButton text="Review & Sign Now" />
                <ContactFooter senderEmail={null} />
              </div>
              <EmailFooter senderName={displaySender} organizationName={organizationName} />
            </EmailPreviewFrame>
          </TabsContent>

          <TabsContent value="reminder" className="mt-4">
            <EmailPreviewFrame 
              subject="Reminder: Signature needed for Annual Compliance Policy (due February 23, 2026)" 
              senderName={displaySender}
            >
              <EmailHeader logoUrl={logoUrl} />
              <div className="py-6">
                <p className="text-muted-foreground mb-4">Hi John Smith,</p>
                <p className="text-muted-foreground mb-6">
                  This is a reminder that your signature is still needed for:
                </p>
                <DocumentCard title="Annual Compliance Policy" />
                <DueDateBanner 
                  text="Please review and sign by February 23, 2026." 
                  variant="info" 
                />
                <ConsequenceText text="Your acknowledgment is required to complete this compliance requirement." />
                <p className="text-sm text-muted-foreground mb-6">
                  Thank you for taking care of this.
                </p>
                <CTAButton text="Review & Sign Now" />
                <ContactFooter senderEmail={null} />
              </div>
              <EmailFooter senderName={displaySender} organizationName={organizationName} />
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
                  Your signature is still required for the document below:
                </p>
                <DocumentCard title="Annual Compliance Policy" />
                <DueDateBanner 
                  text="⏰ Due in 5 days (February 23, 2026)" 
                  variant="warning" 
                />
                <ConsequenceText text="Missing this deadline may be flagged in your organization's compliance records." variant="warning" />
                <p className="text-sm text-muted-foreground mb-6">
                  Please complete this as soon as possible.
                </p>
                <CTAButton text="Review & Sign Now" />
                <ContactFooter senderEmail={null} />
              </div>
              <EmailFooter senderName={displaySender} organizationName={organizationName} />
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
                  Your signature for the document below is now overdue:
                </p>
                <DocumentCard title="Annual Compliance Policy" />
                <DueDateBanner 
                  text="The due date was February 23, 2026." 
                  variant="error" 
                />
                <ConsequenceText text="This has been marked as incomplete in your organization's compliance records." variant="error" />
                <p className="text-sm text-muted-foreground mb-6">
                  Please complete your signature immediately or contact your organization administrator if you need assistance.
                </p>
                <CTAButton text="Review & Sign Now" />
                <ContactFooter senderEmail={null} />
              </div>
              <EmailFooter senderName={displaySender} organizationName={organizationName} />
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

function CTAButton({ text }: { text: string }) {
  return (
    <div className="text-center">
      <span className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium">
        {text}
      </span>
    </div>
  );
}

function ContactFooter({ senderEmail }: { senderEmail: string | null }) {
  return (
    <p className="text-sm text-muted-foreground mt-6">
      If you have questions, contact your organization administrator
      {senderEmail && (
        <> at <span className="text-primary">{senderEmail}</span></>
      )} or Attestly Support at <span className="text-primary">hello@attestly.com</span>.
    </p>
  );
}

function EmailFooter({ senderName, organizationName }: { senderName: string; organizationName?: string }) {
  const footerText = organizationName && senderName !== organizationName
    ? `This request was sent by ${senderName} on behalf of ${organizationName}.`
    : `This request was sent by ${senderName}.`;
  
  return (
    <div className="pt-4 border-t border-border text-center text-xs text-muted-foreground">
      <p>{footerText}</p>
      <p className="mt-1">If you didn't expect this email, you can safely ignore it.</p>
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
