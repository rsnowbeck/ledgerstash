import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, X, Check } from "lucide-react";
import { toast } from "sonner";

interface Requirement {
  id: string;
  title: string;
  description: string | null;
  status: string | null;
  due_date: string | null;
  frequency: string | null;
  attachment_url: string | null;
  attachment_name: string | null;
}

interface RequirementEditFormProps {
  requirement: Requirement;
  onSave: () => void;
  onCancel: () => void;
}

export function RequirementEditForm({
  requirement,
  onSave,
  onCancel,
}: RequirementEditFormProps) {
  const [title, setTitle] = useState(requirement.title);
  const [description, setDescription] = useState(requirement.description || "");
  const [frequency, setFrequency] = useState(requirement.frequency || "one-time");
  const [dueDate, setDueDate] = useState(requirement.due_date || "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase
        .from("requirements")
        .update({
          title: title.trim(),
          description: description.trim() || null,
          frequency,
          due_date: dueDate || null,
        })
        .eq("id", requirement.id);

      if (error) throw error;

      toast.success("Requirement updated successfully");
      onSave();
    } catch (error: any) {
      console.error("Error updating requirement:", error);
      toast.error(error.message || "Failed to update requirement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="edit-title">Title *</Label>
        <Input
          id="edit-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Employee Handbook 2024"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-description">Description</Label>
        <Textarea
          id="edit-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Briefly describe what this requirement is about..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-frequency">Frequency</Label>
          <Select value={frequency} onValueChange={setFrequency}>
            <SelectTrigger id="edit-frequency">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="one-time">One-time</SelectItem>
              <SelectItem value="annual">Annual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-dueDate">Due Date</Label>
          <Input
            id="edit-dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={saving}
          className="flex-1"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button
          type="submit"
          variant="hero"
          disabled={saving}
          className="flex-1"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
