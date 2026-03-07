import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, CheckSquare, Upload, Clock, Shield, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [isDragging, setIsDragging] = useState(false);

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
      toast.success("Task updated");
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
    } catch (err: any) {
      toast.error(err.message || "Failed to update task");
    }
  };

  const uploadFiles = async (files: FileList | File[]) => {
    if (!files.length) return;
    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        // Get signed upload URL
        const urlRes = await supabase.functions.invoke("client-portal", {
          body: { action: "get-upload-url", token, fileName: file.name, fileType: file.type },
        });
        if (urlRes.error || !urlRes.data?.success) throw new Error("Failed to get upload URL");

        const { uploadUrl, storagePath, token: uploadToken } = urlRes.data;

        // Upload file directly to storage
        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type || "application/octet-stream" },
          body: file,
        });
        if (!uploadRes.ok) throw new Error("Upload failed");

        // Confirm upload in DB
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

        // Add to local state
        setDocuments(prev => [{
          id: crypto.randomUUID(),
          file_name: file.name,
          file_type: file.type,
          file_size_bytes: file.size,
          created_at: new Date().toISOString(),
        }, ...prev]);
      }
      toast.success(`${files.length} file(s) uploaded successfully`);
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) uploadFiles(e.target.files);
    e.target.value = "";
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-foreground">LedgerStash</h1>
            {firmName && <p className="text-sm text-muted-foreground">{firmName}</p>}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            AES-256 Encrypted
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">Welcome, {client.first_name}</h2>
          <p className="text-muted-foreground mt-1">
            Upload documents, view tasks, and stay organized with {firmName || "your accountant"}.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="stat-card">
            <p className="text-2xl font-bold text-foreground">{pendingTasks.length}</p>
            <p className="text-sm text-muted-foreground">Pending Tasks</p>
          </div>
          <div className="stat-card">
            <p className="text-2xl font-bold text-foreground">{completedTasks.length}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>
          <div className="stat-card hidden sm:block">
            <p className="text-2xl font-bold text-foreground">{documents.length}</p>
            <p className="text-sm text-muted-foreground">Documents</p>
          </div>
        </div>

        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList>
            <TabsTrigger value="tasks">Tasks ({tasks.length})</TabsTrigger>
            <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
          </TabsList>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-4">
            {pendingTasks.length === 0 && completedTasks.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-xl">
                <CheckSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No tasks assigned yet.</p>
              </div>
            ) : (
              <>
                {pendingTasks.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Outstanding</h3>
                    {pendingTasks.map(task => (
                      <div key={task.id} className="p-4 rounded-lg border border-border bg-card flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-foreground">{task.title}</h4>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              task.priority === "high" ? "bg-destructive/10 text-destructive" :
                              task.priority === "medium" ? "bg-warning/10 text-warning" :
                              "bg-muted text-muted-foreground"
                            }`}>{task.priority}</span>
                          </div>
                          {task.description && <p className="text-sm text-muted-foreground mb-2">{task.description}</p>}
                          {task.due_date && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              Due {new Date(task.due_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <Select value={task.status} onValueChange={v => handleUpdateTask(task.id, v)}>
                          <SelectTrigger className="w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                )}
                {completedTasks.length > 0 && (
                  <div className="space-y-3 mt-6">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Completed</h3>
                    {completedTasks.map(task => (
                      <div key={task.id} className="p-4 rounded-lg border border-border bg-muted/30 opacity-70">
                        <div className="flex items-center gap-2">
                          <CheckSquare className="h-4 w-4 text-success" />
                          <span className="font-medium text-foreground line-through">{task.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
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
                <input type="file" multiple className="hidden" onChange={handleFileChange} disabled={uploading} />
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
      <footer className="border-t border-border mt-16 py-6 text-center">
        <p className="text-xs text-muted-foreground">
          Powered by{" "}
          <a href="https://ledgerstash.com?ref=portal" className="hover:text-foreground transition-colors">
            LedgerStash
          </a>
          {" "}— Secure Client Vault for Accountants
        </p>
      </footer>
    </div>
  );
}
