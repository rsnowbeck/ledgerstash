import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Bell, Info } from "lucide-react";
import { toast } from "sonner";

interface AutoReminderSettingsProps {
  organizationId: string;
  autoReminderEnabled: boolean;
  autoReminderDays: number;
  onUpdate?: () => void;
}

const REMINDER_CADENCE_OPTIONS = [
  { value: "3", label: "Every 3 days" },
  { value: "5", label: "Every 5 days" },
  { value: "7", label: "Every 7 days" },
  { value: "14", label: "Every 14 days" },
];

export function AutoReminderSettings({
  organizationId,
  autoReminderEnabled,
  autoReminderDays,
  onUpdate,
}: AutoReminderSettingsProps) {
  const [enabled, setEnabled] = useState(autoReminderEnabled);
  const [days, setDays] = useState(autoReminderDays?.toString() || "7");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("organizations")
        .update({
          auto_reminder_enabled: enabled,
          auto_reminder_days: parseInt(days),
          updated_at: new Date().toISOString(),
        })
        .eq("id", organizationId);

      if (error) throw error;

      toast.success("Auto-reminder settings updated");
      onUpdate?.();
    } catch (error: any) {
      console.error("Error updating auto-reminder settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const hasChanges =
    enabled !== autoReminderEnabled || parseInt(days) !== autoReminderDays;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Auto-Reminders
        </CardTitle>
        <CardDescription>
          Automatically send reminder emails to recipients who haven't signed yet
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="autoReminder">Enable Auto-Reminders</Label>
            <p className="text-sm text-muted-foreground">
              Automatically send reminders for pending signatures
            </p>
          </div>
          <Switch
            id="autoReminder"
            checked={enabled}
            onCheckedChange={setEnabled}
          />
        </div>

        {enabled && (
          <div className="space-y-4 pl-0 pt-2 border-t">
            <div className="space-y-2 pt-4">
              <Label>Reminder Frequency</Label>
              <Select value={days} onValueChange={setDays}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {REMINDER_CADENCE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                How often to send reminder emails to recipients with unsigned documents
              </p>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Reminders are only sent for pending signatures</li>
                  <li>Reminders stop automatically when a document is signed</li>
                  <li>Expired signing requests won't receive reminders</li>
                  <li>All reminders are logged in your signature history</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
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
