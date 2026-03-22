import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Upload, Info } from "lucide-react";
import { toast } from "sonner";

interface UploadNotificationSettingsProps {
  organizationId: string;
  uploadNotificationsEnabled: boolean;
  uploadNotificationMode: string;
  onUpdate?: () => void;
}

export function UploadNotificationSettings({
  organizationId,
  uploadNotificationsEnabled,
  uploadNotificationMode,
  onUpdate,
}: UploadNotificationSettingsProps) {
  const [enabled, setEnabled] = useState(uploadNotificationsEnabled);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("organizations")
        .update({
          upload_notifications_enabled: enabled,
          upload_notification_mode: "instant",
          updated_at: new Date().toISOString(),
        } as any)
        .eq("id", organizationId);

      if (error) throw error;

      toast.success("Upload notification settings updated");
      onUpdate?.();
    } catch (error: any) {
      console.error("Error updating upload notification settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = enabled !== uploadNotificationsEnabled;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Notifications
        </CardTitle>
        <CardDescription>
          Get notified when clients upload documents to their vault
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="uploadNotify">Enable Upload Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive an email each time a client uploads a document
            </p>
          </div>
          <Switch
            id="uploadNotify"
            checked={enabled}
            onCheckedChange={setEnabled}
          />
        </div>

        {enabled && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>You'll receive an email for each document uploaded by a client</li>
                <li>Notifications include the client name and file name</li>
                <li>Only uploads from the client portal trigger notifications</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <Button
          variant="hero"
          onClick={handleSave}
          disabled={saving || !hasChanges}
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Settings"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
