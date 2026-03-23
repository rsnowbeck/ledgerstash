import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Upload, FileText, Sparkles, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PBCItem {
  title: string;
  category: string;
  priority: string;
  description: string;
  schedule: string;
  selected: boolean;
}

interface ScanReturnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  clientName: string;
  organizationId: string;
  userId: string;
  existingDocuments: { id: string; file_name: string; storage_path: string }[];
  onTasksCreated: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  income: "bg-success/10 text-success",
  deductions: "bg-accent/10 text-accent",
  credits: "bg-primary/10 text-primary",
  business: "bg-warning/10 text-warning",
  investments: "bg-info/10 text-info",
  rental: "bg-secondary text-secondary-foreground",
  other: "bg-muted text-muted-foreground",
};

export function ScanReturnDialog({
  open,
  onOpenChange,
  clientId,
  clientName,
  organizationId,
  userId,
  existingDocuments,
  onTasksCreated,
}: ScanReturnDialogProps) {
  const [step, setStep] = useState<"select" | "scanning" | "review">("select");
  const [selectedDocId, setSelectedDocId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [items, setItems] = useState<PBCItem[]>([]);
  const [aiMessage, setAiMessage] = useState("");
  const [creating, setCreating] = useState(false);

  const pdfDocs = existingDocuments.filter(
    (d) => d.file_name.toLowerCase().endsWith(".pdf")
  );

  const handleSelectExisting = async () => {
    if (!selectedDocId) return;
    const doc = existingDocuments.find((d) => d.id === selectedDocId);
    if (!doc) return;

    // Get signed URL
    const { data: urlData } = await supabase.storage
      .from("client-documents")
      .createSignedUrl(doc.storage_path, 600);

    if (!urlData?.signedUrl) {
      toast.error("Could not access document");
      return;
    }

    await scanPdf(urlData.signedUrl, doc.file_name);
  };

  const handleUploadNew = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Please select a PDF file");
      return;
    }

    setUploading(true);
    const path = `${organizationId}/${clientId}/${crypto.randomUUID()}_${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("client-documents")
      .upload(path, file);

    if (uploadError) {
      toast.error("Upload failed");
      setUploading(false);
      return;
    }

    // Save document record
    await supabase.from("documents").insert({
      client_id: clientId,
      uploaded_by: userId,
      file_name: file.name,
      file_type: file.type,
      file_size_bytes: file.size,
      storage_path: path,
    });

    const { data: urlData } = await supabase.storage
      .from("client-documents")
      .createSignedUrl(path, 600);

    setUploading(false);

    if (urlData?.signedUrl) {
      await scanPdf(urlData.signedUrl, file.name);
    } else {
      toast.error("Could not generate document URL");
    }
  };

  const scanPdf = async (pdfUrl: string, pdfName: string) => {
    setStep("scanning");

    const { data, error } = await supabase.functions.invoke("scan-tax-return", {
      body: { pdfUrl, pdfName, clientName },
    });

    if (error) {
      toast.error("Failed to scan return");
      setStep("select");
      return;
    }

    const scannedItems: PBCItem[] = (data.items || []).map((item: any) => ({
      ...item,
      selected: item.priority === "high" || item.priority === "medium",
    }));

    setItems(scannedItems);
    setAiMessage(data.message || "");
    setStep("review");
  };

  const toggleItem = (index: number) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, selected: !item.selected } : item))
    );
  };

  const toggleAll = (selected: boolean) => {
    setItems((prev) => prev.map((item) => ({ ...item, selected })));
  };

  const handleCreateTasks = async () => {
    const selected = items.filter((i) => i.selected);
    if (selected.length === 0) {
      toast.error("Select at least one item");
      return;
    }

    setCreating(true);
    const inserts = selected.map((item) => ({
      client_id: clientId,
      assigned_by: userId,
      title: item.title,
      description: [item.description, item.schedule ? `Schedule/Form: ${item.schedule}` : ""]
        .filter(Boolean)
        .join("\n"),
      priority: item.priority,
      status: "pending",
    }));

    const { error } = await supabase.from("tasks").insert(inserts);

    if (error) {
      toast.error("Failed to create tasks");
    } else {
      toast.success(`Created ${selected.length} PBC tasks from prior-year return`);
      onTasksCreated();
      onOpenChange(false);
      setStep("select");
      setItems([]);
    }
    setCreating(false);
  };

  const selectedCount = items.filter((i) => i.selected).length;

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) { setStep("select"); setItems([]); } }}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            {step === "select" && "Generate PBC from Prior-Year Return"}
            {step === "scanning" && "Analyzing Tax Return…"}
            {step === "review" && "Review Suggested PBC Checklist"}
          </DialogTitle>
          <DialogDescription>
            {step === "select" && "Select a prior-year return to analyze, or upload a new one."}
            {step === "scanning" && "AI is scanning the return for income sources, deductions, and schedules…"}
            {step === "review" && aiMessage}
          </DialogDescription>
        </DialogHeader>

        {/* Step: Select PDF */}
        {step === "select" && (
          <div className="space-y-6 py-2">
            {pdfDocs.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Pick from Client Vault</Label>
                <Select value={selectedDocId} onValueChange={setSelectedDocId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a PDF…" />
                  </SelectTrigger>
                  <SelectContent>
                    {pdfDocs.map((doc) => (
                      <SelectItem key={doc.id} value={doc.id}>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          {doc.file_name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleSelectExisting} disabled={!selectedDocId} className="w-full gap-2">
                  <Sparkles className="h-4 w-4" />
                  Scan Selected Return
                </Button>
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">or upload new</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Upload a Prior-Year Return</Label>
              <div className="relative">
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={handleUploadNew}
                  disabled={uploading}
                  className="cursor-pointer"
                />
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-md">
                    <Loader2 className="h-5 w-5 animate-spin text-accent" />
                    <span className="ml-2 text-sm">Uploading…</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                PDF will be saved to the client's document vault automatically.
              </p>
            </div>
          </div>
        )}

        {/* Step: Scanning */}
        {step === "scanning" && (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-accent animate-pulse" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Using Gemini Pro to analyze the return…</p>
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Step: Review */}
        {step === "review" && (
          <>
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => toggleAll(true)}>Select All</Button>
                <Button variant="ghost" size="sm" onClick={() => toggleAll(false)}>Deselect All</Button>
              </div>
              <span className="text-sm text-muted-foreground">
                {selectedCount} of {items.length} selected
              </span>
            </div>

            <ScrollArea className="flex-1 max-h-[400px] pr-2">
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                      item.selected ? "border-accent/30 bg-accent/5" : "border-border bg-background"
                    }`}
                    onClick={() => toggleItem(index)}
                  >
                    <Checkbox
                      checked={item.selected}
                      onCheckedChange={() => toggleItem(index)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">{item.title}</span>
                        <Badge variant="outline" className={`text-[10px] ${CATEGORY_COLORS[item.category] || ""}`}>
                          {item.category}
                        </Badge>
                        {item.priority === "high" && (
                          <Badge variant="destructive" className="text-[10px]">High</Badge>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                      )}
                      {item.schedule && (
                        <p className="text-xs text-muted-foreground/60 mt-0.5">{item.schedule}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </>
        )}

        {step === "review" && (
          <DialogFooter>
            <Button variant="outline" onClick={() => { setStep("select"); setItems([]); }}>
              Back
            </Button>
            <Button onClick={handleCreateTasks} disabled={creating || selectedCount === 0} className="gap-2">
              {creating && <Loader2 className="h-4 w-4 animate-spin" />}
              Create {selectedCount} Tasks
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
