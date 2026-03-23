import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Archive, RotateCcw, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Json } from "@/integrations/supabase/types";

interface EngagementHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  organizationId: string;
  userId: string;
  tasks: { title: string; status: string }[];
  documents: { file_name: string }[];
  onPrefill?: (taskTitles: string[]) => void;
}

interface EngagementRecord {
  id: string;
  tax_year: string;
  template_name: string | null;
  task_titles: string[];
  document_names: string[];
  closed_at: string;
}

export function EngagementHistoryDialog({
  open,
  onOpenChange,
  clientId,
  organizationId,
  userId,
  tasks,
  documents,
  onPrefill,
}: EngagementHistoryDialogProps) {
  const [mode, setMode] = useState<"close" | "prefill">("close");
  const [taxYear, setTaxYear] = useState(String(new Date().getFullYear()));
  const [templateName, setTemplateName] = useState("");
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState<EngagementRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (open) {
      loadHistory();
    }
  }, [open, clientId]);

  const loadHistory = async () => {
    setLoadingHistory(true);
    const { data, error } = await supabase
      .from("engagement_history")
      .select("*")
      .eq("client_id", clientId)
      .order("closed_at", { ascending: false })
      .limit(5);

    if (!error && data) {
      setHistory(
        data.map((d: any) => ({
          id: d.id,
          tax_year: d.tax_year,
          template_name: d.template_name,
          task_titles: Array.isArray(d.task_titles) ? (d.task_titles as string[]) : [],
          document_names: Array.isArray(d.document_names) ? (d.document_names as string[]) : [],
          closed_at: d.closed_at,
        }))
      );
    }
    setLoadingHistory(false);
  };

  const handleCloseEngagement = async () => {
    if (!taxYear.trim()) {
      toast.error("Tax year is required");
      return;
    }
    setSaving(true);
    const taskTitles = tasks.map((t) => t.title);
    const docNames = documents.map((d) => d.file_name);

    const { error } = await supabase.from("engagement_history").insert({
      client_id: clientId,
      organization_id: organizationId,
      tax_year: taxYear.trim(),
      template_name: templateName.trim() || null,
      task_titles: taskTitles as unknown as Json,
      document_names: docNames as unknown as Json,
      created_by: userId,
    });

    if (error) {
      toast.error("Failed to save engagement history");
      console.error(error);
    } else {
      toast.success(`${taxYear} engagement archived with ${taskTitles.length} tasks and ${docNames.length} documents`);
      onOpenChange(false);
      loadHistory();
    }
    setSaving(false);
  };

  const handlePrefill = (record: EngagementRecord) => {
    if (onPrefill) {
      onPrefill(record.task_titles);
      toast.success(`Pre-populated ${record.task_titles.length} tasks from ${record.tax_year}`);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Engagement History
          </DialogTitle>
          <DialogDescription>
            Close an engagement to save this year's checklist, or pre-populate from a previous year.
          </DialogDescription>
        </DialogHeader>

        {/* Previous engagements */}
        {loadingHistory ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : history.length > 0 ? (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Previous Engagements</Label>
            {history.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{record.tax_year}</span>
                    {record.template_name && (
                      <Badge variant="secondary" className="text-xs">{record.template_name}</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {record.task_titles.length} tasks · {record.document_names.length} documents
                  </p>
                </div>
                {onPrefill && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePrefill(record)}
                    className="gap-1"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Use
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-2">
            No previous engagements found for this client.
          </p>
        )}

        {/* Close current engagement */}
        <div className="space-y-3 border-t border-border pt-4 mt-2">
          <Label className="text-sm font-medium">Close Current Engagement</Label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="tax-year" className="text-xs text-muted-foreground">Tax Year</Label>
              <Input
                id="tax-year"
                value={taxYear}
                onChange={(e) => setTaxYear(e.target.value)}
                placeholder="2025"
              />
            </div>
            <div>
              <Label htmlFor="template-name" className="text-xs text-muted-foreground">Template (optional)</Label>
              <Input
                id="template-name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="e.g. 1040 Individual"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            This will save {tasks.length} tasks and {documents.length} documents as a snapshot.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleCloseEngagement} disabled={saving} className="gap-2">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Archive Engagement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
