import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Mail, Send, Info, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { EmailTemplatePreview } from "./EmailTemplatePreview";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Organization {
  id: string;
  name: string;
  logo_url: string | null;
  sender_name: string | null;
  sender_email: string | null;
  custom_recipient_message: string | null;
}

interface EmailSettingsFormProps {
  organization: Organization;
  onUpdate: () => void;
}

export function EmailSettingsForm({ organization, onUpdate }: EmailSettingsFormProps) {
  const [saving, setSaving] = useState(false);
  const [senderName, setSenderName] = useState(organization.sender_name || "");
  const [senderEmail, setSenderEmail] = useState(organization.sender_email || "");
  const [customMessage, setCustomMessage] = useState(organization.custom_recipient_message || "");

  // Validate custom message - plain text only, no links
  const validateCustomMessage = (msg: string): string | null => {
    if (msg.length > 240) {
      return "Message must be 240 characters or less";
    }
    // Check for URLs/links
    const urlPattern = /(https?:\/\/|www\.|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi;
    if (urlPattern.test(msg)) {
      return "Links are not allowed in custom messages";
    }
    return null;
  };

  const handleSave = async () => {
    // Validate custom message
    const messageError = validateCustomMessage(customMessage);
    if (messageError) {
      toast.error(messageError);
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("organizations")
        .update({
          sender_name: senderName || null,
          sender_email: senderEmail || null,
          custom_recipient_message: customMessage.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", organization.id);

      if (error) throw error;

      toast.success("Email settings saved");
      onUpdate();
    } catch (error: any) {
      console.error("Error saving email settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSendTestEmail = async () => {
    toast.info("Test email functionality coming soon!");
  };

  return (
    <div className="space-y-6">
      {/* Sender Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Sender Configuration
          </CardTitle>
          <CardDescription>
            Customize how your organization's emails appear to recipients
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="senderName">Sender Display Name</Label>
            <Input
              id="senderName"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder={organization.name || "Your Organization Name"}
            />
            <p className="text-xs text-muted-foreground">
              This name appears in the "From" field. Leave blank to use organization name.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="senderEmail">Reply-To Email Address</Label>
            <Input
              id="senderEmail"
              type="email"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              placeholder="hr@yourcompany.com"
            />
            <p className="text-xs text-muted-foreground">
              When recipients reply, their messages go to this address
            </p>
          </div>

          <Separator className="my-4" />

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              All emails are sent from <strong>noreply@ledgerstash.com</strong>. 
              Support contact (<strong>hello@ledgerstash.com</strong>) is included by default.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Custom Message */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Optional Message to Recipients
          </CardTitle>
          <CardDescription>
            Add a personal note that appears in all document request emails
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customMessage">Custom Message</Label>
            <Textarea
              id="customMessage"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="e.g., Please upload these documents by Friday. Contact our office if you have questions."
              maxLength={240}
              rows={3}
              className="resize-none"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Plain text only. No links allowed.</span>
              <span className={customMessage.length > 200 ? "text-amber-500" : ""}>
                {customMessage.length}/240
              </span>
            </div>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              This message appears as a note between the document details and the upload button. 
              Leave empty to skip.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Email Previews */}
      <EmailTemplatePreview
        organizationName={organization.name}
        senderName={senderName || organization.name}
        logoUrl={organization.logo_url}
        customMessage={customMessage}
      />

      {/* Email Types Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Email Types
          </CardTitle>
          <CardDescription>
            Automatic emails sent by LedgerStash on your behalf
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <EmailTypeRow
              name="Document Request"
              description="Sent when you request documents from a client"
              trigger="Manual - when you send a document request"
            />
            <Separator />
            <EmailTypeRow
              name="Reminder"
              description="Follow-up for pending document submissions"
              trigger="Automatic - based on your reminder settings"
            />
            <Separator />
            <EmailTypeRow
              name="Team Invitation"
              description="Invite new team members to your organization"
              trigger="Manual - when you invite a team member"
            />
            <Separator />
            <EmailTypeRow
              name="Trial Expiration"
              description="Notification when your trial is ending"
              trigger="Automatic - 3 days before trial ends"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button 
          variant="outline" 
          onClick={handleSendTestEmail}
          disabled={saving}
        >
          <Send className="h-4 w-4 mr-2" />
          Send Test Email
        </Button>
        <Button variant="hero" onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Email Settings"
          )}
        </Button>
      </div>
    </div>
  );
}

interface EmailTypeRowProps {
  name: string;
  description: string;
  trigger: string;
}

function EmailTypeRow({ name, description, trigger }: EmailTypeRowProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-1">
        <p className="font-medium text-foreground">{name}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="text-right">
        <p className="text-xs text-muted-foreground">{trigger}</p>
      </div>
    </div>
  );
}
