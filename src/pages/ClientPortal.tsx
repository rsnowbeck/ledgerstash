import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, FileText, CheckSquare, Upload, Clock, Shield, AlertCircle, CheckCircle2, Circle, ChevronDown, Paperclip } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ClientData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  status: string;
  priority: string;
  created_at: string;
}

interface Document {
  id: string;
  file_name: string;
  file_type: string | null;
  file_size_bytes: number | null;
  created_at: string;
}

export default function ClientPortal() {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<ClientData | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [firmName, setFirmName] = useState("");
  const [firmLogoUrl, setFirmLogoUrl] = useState("");
  const [accentColor, setAccentColor] = useState("");
  const [showPoweredBy, setShowPoweredBy] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadingTaskId, setUploadingTaskId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const taskFileInputRef = useRef<HTMLInputElement>(null);
  const [activeTaskUpload, setActiveTaskUpload] = useState<string | null>(null);

  useEffect(() => {
    if (token) verifyAndLoad();
  }, [token]);

  const verifyAndLoad = async () => {
    try {
      const res = await supabase.functions.invoke("client-portal", {
        body: { action: "verify", token },
      });

      if (res.error) throw new Error(res.error.message);
      const data = res.data;
      if (!data?.success) throw new Error(data?.error || "Invalid link");

      setClient(data.client);
      setTasks(data.tasks);
      setDocuments(data.documents);
      setFirmName(data.firmName);
      setFirmLogoUrl(data.firmLogoUrl || "");
      setAccentColor(data.accentColor || "");
      setShowPoweredBy(data.showPoweredBy !== false);
    } catch (err: any) {
      setError(err.message || "Unable to load portal");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (taskId: string, status: string) => {
    try {
      const res = await supabase.functions.invoke("client-portal", {
        body: { action: "update-task", token, taskId, status },
      });
      if (res.error) throw new Error(res.error.message);
      toast.success(status === "completed" ? "Task marked complete!" : "Task updated");
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
    } catch (err: any) {
      toast.error(err.message || "Failed to update task");
    }
  };

  const uploadFiles = async (files: FileList | File[], taskId?: string) => {
    if (!files.length) return;
    if (taskId) {
      setUploadingTaskId(taskId);
    } else {
      setUploading(true);
    }

    try {
      for (const file of Array.from(files)) {
        const urlRes = await supabase.functions.invoke("client-portal", {
          body: { action: "get-upload-url", token, fileName: file.name, fileType: file.type },
        });
        if (urlRes.error || !urlRes.data?.success) throw new Error("Failed to get upload URL");

        const { uploadUrl, storagePath } = urlRes.data;

        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type || "application/octet-stream" },
          body: file,
        });
        if (!uploadRes.ok) throw new Error("Upload failed");

        const confirmRes = await supabase.functions.invoke("client-portal", {
          body: {
            action: "confirm-upload",
            token,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            storagePath,
          },
        });
        if (confirmRes.error) throw new Error("Failed to record upload");

        setDocuments(prev => [{
          id: crypto.randomUUID(),
          file_name: file.name,
          file_type: file.type,
          file_size_bytes: file.size,
          created_at: new Date().toISOString(),
        }, ...prev]);
      }

      toast.success(`${files.length} file(s) uploaded successfully`);

      // If uploaded against a task, mark it as completed
      if (taskId) {
        await handleUpdateTask(taskId, "completed");
      }
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      setUploadingTaskId(null);
      setActiveTaskUpload(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) uploadFiles(e.target.files);
    e.target.value = "";
  };

  const handleTaskFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && activeTaskUpload) {
      uploadFiles(e.target.files, activeTaskUpload);
    }
    e.target.value = "";
  };

  const triggerTaskUpload = (taskId: string) => {
    setActiveTaskUpload(taskId);
    setTimeout(() => taskFileInputRef.current?.click(), 0);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
  }, [token]);

  const pendingTasks = tasks.filter(t => t.status !== "completed");
  const completedTasks = tasks.filter(t => t.status === "completed");
  const totalTasks = tasks.length;
  const completionPercent = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  const accentStyle = accentColor ? { "--portal-accent": accentColor } as React.CSSProperties : undefined;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your portal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <h1 className="text-xl font-bold text-foreground mb-2">Unable to Access Portal</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!client) return null;

  return (
    <div className="min-h-screen bg-background" style={accentStyle}>
      {/* Hidden file inputs */}
      <input ref={taskFileInputRef} type="file" multiple className="hidden" onChange={handleTaskFileChange} />

      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {firmLogoUrl && (
              <img src={firmLogoUrl} alt={firmName} className="h-8 w-8 object-contain rounded" />
            )}
            <div>
              <h1 className="text-lg font-bold text-foreground">{firmName || "LedgerStash"}</h1>
              {firmName && <p className="text-xs text-muted-foreground">Secure Client Portal</p>}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            AES-256 Encrypted
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome + Progress */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">Welcome, {client.first_name}</h2>
          <p className="text-muted-foreground mt-1">
            Complete the tasks below to submit your documents to {firmName || "your accountant"}.
          </p>
        </div>

        {/* Progress Overview */}
        {totalTasks > 0 && (
          <div className="mb-8 p-5 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-medium text-foreground">Your Progress</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {completedTasks.length} of {totalTasks} tasks completed
                </p>
              </div>
              <span className="text-2xl font-bold text-foreground">{completionPercent}%</span>
            </div>
            <Progress value={completionPercent} className="h-2.5" />
            {completionPercent === 100 && (
              <p className="text-sm text-success mt-3 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                All tasks completed — thank you!
              </p>
            )}
          </div>
        )}

        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList>
            <TabsTrigger value="tasks">
              Checklist ({pendingTasks.length} remaining)
            </TabsTrigger>
            <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
          </TabsList>

          {/* Tasks / Checklist Tab */}
          <TabsContent value="tasks" className="space-y-4">
            {pendingTasks.length === 0 && completedTasks.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-xl">
                <CheckSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No tasks assigned yet. Check back soon!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Outstanding tasks */}
                {pendingTasks.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Outstanding ({pendingTasks.length})
                    </h3>
                    {pendingTasks.map(task => (
                      <div key={task.id} className="rounded-xl border border-border bg-card overflow-hidden">
                        <div className="p-4">
                          <div className="flex items-start gap-3">
                            {/* Checkbox circle */}
                            <button
                              onClick={() => handleUpdateTask(task.id, "completed")}
                              className="mt-0.5 h-5 w-5 rounded-full border-2 border-muted-foreground/40 hover:border-accent flex items-center justify-center flex-shrink-0 transition-colors"
                              title="Mark as complete"
                            >
                              <Circle className="h-3 w-3 text-transparent" />
                            </button>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <h4 className="font-medium text-foreground">{task.title}</h4>
                                {task.priority === "high" && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-destructive/10 text-destructive font-medium uppercase">
                                    Required
                                  </span>
                                )}
                              </div>
                              {task.description && (
                                <p className="text-sm text-muted-foreground mt-0.5">{task.description}</p>
                              )}
                              {task.due_date && (
                                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground mt-2">
                                  <Clock className="h-3 w-3" />
                                  Due {new Date(task.due_date).toLocaleDateString()}
                                </span>
                              )}
                            </div>

                            {/* Upload button per task */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => triggerTaskUpload(task.id)}
                              disabled={uploadingTaskId === task.id}
                              className="flex-shrink-0"
                            >
                              {uploadingTaskId === task.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Paperclip className="h-3.5 w-3.5" />
                              )}
                              <span className="hidden sm:inline ml-1">
                                {uploadingTaskId === task.id ? "Uploading..." : "Upload"}
                              </span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Completed tasks */}
                {completedTasks.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Completed ({completedTasks.length})
                    </h3>
                    {completedTasks.map(task => (
                      <div key={task.id} className="p-4 rounded-xl border border-border bg-muted/20 flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                        <span className="text-sm text-muted-foreground line-through">{task.title}</span>
                        <button
                          onClick={() => handleUpdateTask(task.id, "pending")}
                          className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Undo
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-4">
            {/* Drag and drop zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                isDragging
                  ? "border-accent bg-accent/5 scale-[1.01]"
                  : "border-border hover:border-accent/40"
              }`}
            >
              <Upload className={`h-10 w-10 mx-auto mb-3 ${isDragging ? "text-accent" : "text-muted-foreground"}`} />
              <p className="text-foreground font-medium mb-1">
                {uploading ? "Uploading..." : isDragging ? "Drop files here" : "Drag & drop files here"}
              </p>
              <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
              <label className="cursor-pointer">
                <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileChange} disabled={uploading} />
                <Button variant="outline" size="sm" asChild disabled={uploading}>
                  <span>
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    {uploading ? "Uploading..." : "Choose Files"}
                  </span>
                </Button>
              </label>
            </div>

            {/* Documents List */}
            {documents.length > 0 && (
              <div className="card-elevated overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">File</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground hidden sm:table-cell">Type</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground hidden sm:table-cell">Size</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Uploaded</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map(doc => (
                      <tr key={doc.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-3 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-accent flex-shrink-0" />
                          <span className="text-sm font-medium text-foreground truncate max-w-[200px]">{doc.file_name}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">{doc.file_type || "—"}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">
                          {doc.file_size_bytes ? `${(doc.file_size_bytes / 1024).toFixed(1)} KB` : "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {new Date(doc.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      {showPoweredBy && (
        <footer className="border-t border-border mt-16 py-6 text-center">
          <p className="text-xs text-muted-foreground">
            Powered by{" "}
            <a href="https://ledgerstash.com?ref=portal" className="hover:text-foreground transition-colors">
              LedgerStash
            </a>
            {" "}— Secure Client Vault for Accountants
          </p>
        </footer>
      )}
      {!showPoweredBy && <div className="mt-16" />}
    </div>
  );
}