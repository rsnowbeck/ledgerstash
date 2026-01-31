import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Mail, Bell, AlertTriangle, UserPlus } from "lucide-react";

interface EmailTemplatePreviewProps {
  organizationName: string;
  senderName: string;
  logoUrl?: string | null;
}

export function EmailTemplatePreview({ organizationName, senderName, logoUrl }: EmailTemplatePreviewProps) {
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
        <Tabs defaultValue="signing" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="signing" className="text-xs">
              <Mail className="h-3 w-3 mr-1" />
              Signing
            </TabsTrigger>
            <TabsTrigger value="reminder" className="text-xs">
              <Bell className="h-3 w-3 mr-1" />
              Reminder
            </TabsTrigger>
            <TabsTrigger value="invite" className="text-xs">
              <UserPlus className="h-3 w-3 mr-1" />
              Invite
            </TabsTrigger>
            <TabsTrigger value="trial" className="text-xs">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Trial
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signing" className="mt-4">
            <EmailPreviewFrame
              subject={`Action Required: Please sign "Annual Compliance Policy"`}
              senderName={displaySender}
            >
              <div className="text-center pb-6 border-b border-border">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="h-8 mx-auto mb-2" />
                ) : null}
                <h2 className="text-xl font-semibold text-foreground">Attestly</h2>
              </div>
              <div className="py-6">
                <p className="text-muted-foreground mb-4">Hi John Smith,</p>
                <p className="text-muted-foreground mb-6">
                  {displaySender} has requested your signature on the following document:
                </p>
                <div className="bg-muted rounded-lg p-4 mb-6">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Document</p>
                  <p className="font-semibold text-foreground">Annual Compliance Policy</p>
                </div>
                <div className="text-center">
                  <span className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium">
                    Review & Sign Document
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-6">
                  If you have any questions, please contact your organization administrator or email support@attestly.com.
                </p>
              </div>
              <div className="pt-4 border-t border-border text-center text-xs text-muted-foreground">
                <p>This email was sent by Attestly on behalf of {displaySender}.</p>
                <p className="mt-1">If you didn't expect this email, you can safely ignore it.</p>
              </div>
            </EmailPreviewFrame>
          </TabsContent>

          <TabsContent value="reminder" className="mt-4">
            <EmailPreviewFrame
              subject={`Reminder: Please sign "Annual Compliance Policy"`}
              senderName={displaySender}
            >
              <div className="text-center pb-6 border-b border-border">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="h-8 mx-auto mb-2" />
                ) : null}
                <h2 className="text-xl font-semibold text-foreground">Attestly</h2>
              </div>
              <div className="py-6">
                <p className="text-muted-foreground mb-4">Hi John Smith,</p>
                <p className="text-muted-foreground mb-6">
                  This is a friendly reminder that your signature is still needed on the following document:
                </p>
                <div className="bg-muted rounded-lg p-4 mb-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Document</p>
                  <p className="font-semibold text-foreground">Annual Compliance Policy</p>
                </div>
                <div className="bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-lg p-3 mb-6 text-sm">
                  ⏰ Due in 3 days
                </div>
                <div className="text-center">
                  <span className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium">
                    Review & Sign Now
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-6">
                  Need help? Contact support@attestly.com
                </p>
              </div>
              <div className="pt-4 border-t border-border text-center text-xs text-muted-foreground">
                <p>This reminder was sent by Attestly on behalf of {displaySender}.</p>
              </div>
            </EmailPreviewFrame>
          </TabsContent>

          <TabsContent value="invite" className="mt-4">
            <EmailPreviewFrame
              subject={`You've been invited to join ${displaySender} on Attestly`}
              senderName={displaySender}
            >
              <div className="text-center pb-6 border-b border-border">
                <h2 className="text-xl font-semibold text-foreground">Attestly</h2>
              </div>
              <div className="py-6">
                <p className="text-muted-foreground mb-4">Hi there,</p>
                <p className="text-muted-foreground mb-6">
                  You've been invited to join <strong>{displaySender}</strong> on Attestly as a team member.
                </p>
                <div className="bg-muted rounded-lg p-4 mb-6">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Role</p>
                  <p className="font-semibold text-foreground">Admin</p>
                </div>
                <div className="text-center">
                  <span className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium">
                    Accept Invitation
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-6">
                  This invitation expires in 7 days. Questions? Contact support@attestly.com
                </p>
              </div>
              <div className="pt-4 border-t border-border text-center text-xs text-muted-foreground">
                <p>If you didn't expect this invitation, you can safely ignore it.</p>
              </div>
            </EmailPreviewFrame>
          </TabsContent>

          <TabsContent value="trial" className="mt-4">
            <EmailPreviewFrame
              subject="Your Attestly trial ends in 3 days"
              senderName="Attestly"
            >
              <div className="text-center pb-6 border-b border-border">
                <h2 className="text-xl font-semibold text-foreground">Attestly</h2>
              </div>
              <div className="py-6">
                <p className="text-muted-foreground mb-4">Hi there,</p>
                <p className="text-muted-foreground mb-6">
                  Your free trial of Attestly is ending soon. Here's a quick summary of what you've accomplished:
                </p>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-foreground">5</p>
                    <p className="text-xs text-muted-foreground">Recipients</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-foreground">3</p>
                    <p className="text-xs text-muted-foreground">Requirements</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-foreground">12</p>
                    <p className="text-xs text-muted-foreground">Signatures</p>
                  </div>
                </div>
                <div className="text-center">
                  <span className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium">
                    Upgrade Now
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-6 text-center">
                  Questions about plans? Contact support@attestly.com
                </p>
              </div>
              <div className="pt-4 border-t border-border text-center text-xs text-muted-foreground">
                <p>© 2025 Attestly. All rights reserved.</p>
              </div>
            </EmailPreviewFrame>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

interface EmailPreviewFrameProps {
  subject: string;
  senderName: string;
  children: React.ReactNode;
}

function EmailPreviewFrame({ subject, senderName, children }: EmailPreviewFrameProps) {
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
            <span className="text-foreground">{senderName} &lt;noreply@getattestly.com&gt;</span>
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
