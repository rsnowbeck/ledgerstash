import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload, X, Building2, Image } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface Organization {
  id: string;
  name: string;
  plan: string | null;
  trial_ends_at: string | null;
  recipient_limit: number | null;
  requirement_limit: number | null;
  logo_url: string | null;
  sender_name: string | null;
  sender_email: string | null;
  default_due_days: number | null;
  auto_reminder_enabled: boolean | null;
  auto_reminder_days: number | null;
}

interface OrganizationSettingsFormProps {
  organization: Organization;
  onUpdate: () => void;
}

export function OrganizationSettingsForm({ organization, onUpdate }: OrganizationSettingsFormProps) {
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [orgName, setOrgName] = useState(organization.name || "");
  const [logoUrl, setLogoUrl] = useState(organization.logo_url || "");
  const [senderName, setSenderName] = useState(organization.sender_name || "");
  const [senderEmail, setSenderEmail] = useState(organization.sender_email || "");
  const [defaultDueDays, setDefaultDueDays] = useState(organization.default_due_days?.toString() || "30");
  const [autoReminderEnabled, setAutoReminderEnabled] = useState(organization.auto_reminder_enabled || false);
  const [autoReminderDays, setAutoReminderDays] = useState(organization.auto_reminder_days?.toString() || "7");

  const isPro = organization.plan === "pro";

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${organization.id}/logo.${fileExt}`;

      // Delete existing logo if present
      if (logoUrl) {
        const oldPath = logoUrl.split("/").slice(-2).join("/");
        await supabase.storage.from("organization-logos").remove([oldPath]);
      }

      // Upload new logo
      const { error: uploadError } = await supabase.storage
        .from("organization-logos")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("organization-logos")
        .getPublicUrl(fileName);

      setLogoUrl(publicUrl);
      toast.success("Logo uploaded successfully");
    } catch (error: any) {
      console.error("Error uploading logo:", error);
      toast.error("Failed to upload logo");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveLogo = async () => {
    if (!logoUrl) return;

    try {
      const oldPath = `${organization.id}/logo.${logoUrl.split(".").pop()}`;
      await supabase.storage.from("organization-logos").remove([oldPath]);
      setLogoUrl("");
      toast.success("Logo removed");
    } catch (error) {
      console.error("Error removing logo:", error);
      toast.error("Failed to remove logo");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("organizations")
        .update({
          name: orgName,
          logo_url: logoUrl || null,
          sender_name: senderName || null,
          sender_email: senderEmail || null,
          default_due_days: parseInt(defaultDueDays) || 30,
          auto_reminder_enabled: autoReminderEnabled,
          auto_reminder_days: parseInt(autoReminderDays) || 7,
          updated_at: new Date().toISOString(),
        })
        .eq("id", organization.id);

      if (error) throw error;

      toast.success("Organization settings saved");
      onUpdate();
    } catch (error: any) {
      console.error("Error saving organization:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const planDisplayNames: Record<string, string> = {
    trial: "Trial",
    starter: "Starter",
    team: "Team",
    pro: "Pro",
  };

  const planBadgeVariant = (plan: string): "default" | "secondary" | "outline" => {
    if (plan === "pro") return "default";
    if (plan === "team") return "secondary";
    return "outline";
  };

  return (
    <div className="space-y-6">
      {/* Organization Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Organization Information
          </CardTitle>
          <CardDescription>
            Basic information about your organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orgName">Organization Name</Label>
            <Input
              id="orgName"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="Your organization name"
            />
          </div>
        </CardContent>
      </Card>

      {/* Logo Upload - Pro Only */}
      <Card className={!isPro ? "opacity-60" : ""}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Company Logo
              </CardTitle>
              <CardDescription>
                Your logo appears on signing pages for recipients
              </CardDescription>
            </div>
            {!isPro && (
              <Badge variant="outline">Pro Plan</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isPro ? (
            <div className="text-sm text-muted-foreground">
              <p>Upgrade to Pro to add your company logo to signing pages.</p>
              <Button variant="outline" size="sm" className="mt-2" asChild>
                <Link to="/pricing">Upgrade to Pro</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4">
                {logoUrl ? (
                  <div className="relative">
                    <img
                      src={logoUrl}
                      alt="Organization logo"
                      className="h-16 w-16 object-contain rounded-lg border bg-background"
                    />
                    <button
                      onClick={handleRemoveLogo}
                      className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="h-16 w-16 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                    <Image className="h-6 w-6 text-muted-foreground/50" />
                  </div>
                )}

                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Upload Logo
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG up to 2MB. Recommended: 200x200px
                  </p>
                </div>
              </div>

              {/* Branding Preview */}
              {logoUrl && (
                <div className="mt-4 p-4 rounded-lg border bg-muted/30">
                  <p className="text-sm font-medium mb-2">Preview: Signing Page Header</p>
                  <div className="flex items-center gap-3 p-3 bg-background rounded border">
                    <img src={logoUrl} alt="Logo" className="h-8 w-8 object-contain" />
                    <span className="font-semibold">{orgName || "Your Organization"}</span>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Sender Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Email Sender Settings</CardTitle>
          <CardDescription>
            Customize how emails appear to recipients
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="senderName">Sender Name</Label>
            <Input
              id="senderName"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="e.g., HR Team or Your Company Name"
            />
            <p className="text-xs text-muted-foreground">
              This name appears in the "From" field of emails
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="senderEmail">Reply-To Email</Label>
            <Input
              id="senderEmail"
              type="email"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              placeholder="hr@yourcompany.com"
            />
            <p className="text-xs text-muted-foreground">
              Recipients can reply to this email address
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Defaults */}
      <Card>
        <CardHeader>
          <CardTitle>Document Request Defaults</CardTitle>
          <CardDescription>
            Set default values for new document requests
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="defaultDueDays">Default Due Date</Label>
            <Select value={defaultDueDays} onValueChange={setDefaultDueDays}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="60">60 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Default number of days until document requests are due
            </p>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="autoReminder">Automatic Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Automatically send reminder emails for pending document requests
              </p>
            </div>
            <Switch
              id="autoReminder"
              checked={autoReminderEnabled}
              onCheckedChange={setAutoReminderEnabled}
            />
          </div>

          {autoReminderEnabled && (
            <div className="space-y-2 pl-4 border-l-2 border-muted">
              <Label htmlFor="autoReminderDays">Remind after</Label>
              <Select value={autoReminderDays} onValueChange={setAutoReminderDays}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="5">5 days</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Days after sending before automatic reminder
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan & Billing (Read-only) */}
      <Card>
        <CardHeader>
          <CardTitle>Plan & Billing</CardTitle>
          <CardDescription>
            Your current subscription information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge variant={planBadgeVariant(organization.plan || "trial")}>
              {planDisplayNames[organization.plan || "trial"] || organization.plan}
            </Badge>
            {organization.plan === "trial" && organization.trial_ends_at && (
              <span className="text-sm text-muted-foreground">
                Trial ends {new Date(organization.trial_ends_at).toLocaleDateString()}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Recipient Limit</p>
              <p className="text-xl font-semibold text-foreground">
                {organization.recipient_limit === -1 ? "Unlimited" : organization.recipient_limit || 10}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Requirement Limit</p>
              <p className="text-xl font-semibold text-foreground">
                {organization.requirement_limit === -1 ? "Unlimited" : organization.requirement_limit || 5}
              </p>
            </div>
          </div>

          <Button variant="outline" asChild>
            <Link to="/pricing">View Plans & Upgrade</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button variant="hero" onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Organization Settings"
          )}
        </Button>
      </div>
    </div>
  );
}
