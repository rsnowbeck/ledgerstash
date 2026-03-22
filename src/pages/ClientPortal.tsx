import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Loader2, FileText, CheckSquare, Upload, Clock, Shield,
  AlertCircle, CheckCircle2, Circle, Paperclip, ChevronDown,
  ChevronUp, File, MessageSquare, Send, User,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { AIAssistantWidget } from "@/components/ai/AIAssistantWidget";

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
  const [expandedSection, setExpandedSection] = useState<"docs" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const taskFileInputRef = useRef<HTMLInputElement>(null);
  const [activeTaskUpload, setActiveTaskUpload] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ id: string; sender_type: string; content: string; created_at: string }[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (token) verifyAndLoad();
  }, [token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadMessages = useCallback(async () => {
    if (!token) return;
    try {
      const res = await supabase.functions.invoke("client-portal", {
        body: { action: "get-messages", token },
      });
      if (res.data?.messages) setMessages(res.data.messages);
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  }, [token]);

  const handleSendMessage = useCallback(async () => {
    const trimmed = newMessage.trim();
    if (!trimmed || sendingMessage || !token) return;
    setSendingMessage(true);
    try {
      const res = await supabase.functions.invoke("client-portal", {
        body: { action: "send-message", token, content: trimmed },
      });
      if (res.data?.message) {
        setMessages((prev) => [...prev, res.data.message]);
        setNewMessage("");
      }
    } catch (err) {
      toast.error("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  }, [newMessage, sendingMessage, token]);

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
    if (taskId) setUploadingTaskId(taskId);
    else setUploading(true);

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
          body: { action: "confirm-upload", token, fileName: file.name, fileType: file.type, fileSize: file.size, storagePath },
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
      if (taskId) await handleUpdateTask(taskId, "completed");
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
    if (e.target.files && activeTaskUpload) uploadFiles(e.target.files, activeTaskUpload);
    e.target.value = "";
  };

  const triggerTaskUpload = (taskId: string) => {
    setActiveTaskUpload(taskId);
    setTimeout(() => taskFileInputRef.current?.click(), 0);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
  }, [token]);

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
      <input ref={taskFileInputRef} type="file" multiple className="hidden" onChange={handleTaskFileChange} />
      <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileChange} />

      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {firmLogoUrl && <img src={firmLogoUrl} alt={firmName} className="h-8 w-8 object-contain rounded" />}
            <div>
              <h1 className="text-lg font-bold text-foreground">{firmName || "Ledger Stash"}</h1>
              {firmName && <p className="text-xs text-muted-foreground">Secure Client Portal</p>}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            AES-256 Encrypted
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Welcome */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">Welcome, {client.first_name}</h2>
          <p className="text-muted-foreground mt-1">
            Complete each step below to submit your documents to {firmName || "your accountant"}.
          </p>
        </div>

        {/* Overall Progress */}
        {totalTasks > 0 && (
          <div className="p-5 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Overall Progress</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {completedTasks.length} of {totalTasks} steps completed
                </p>
              </div>
              <span className={`text-2xl font-bold ${completionPercent === 100 ? "text-emerald-600" : "text-foreground"}`}>
                {completionPercent}%
              </span>
            </div>
            <Progress value={completionPercent} className="h-2.5" />
            {completionPercent === 100 && (
              <p className="text-sm text-emerald-600 mt-3 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4" />
                All steps completed — thank you!
              </p>
            )}
          </div>
        )}

        {/* Step-by-step task list */}
        {totalTasks > 0 && (
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Your Checklist
            </h3>

            {/* Vertical step flow */}
            <div className="relative">
              {/* Vertical line connector */}
              <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-border" />

              <div className="space-y-0">
                {tasks.map((task, index) => {
                  const isCompleted = task.status === "completed";
                  const isUploading = uploadingTaskId === task.id;

                  return (
                    <div key={task.id} className="relative flex gap-4 pb-6 last:pb-0">
                      {/* Step indicator */}
                      <div className="relative z-10 flex-shrink-0">
                        {isCompleted ? (
                          <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-full border-2 border-border bg-card flex items-center justify-center">
                            <span className="text-sm font-bold text-muted-foreground">{index + 1}</span>
                          </div>
                        )}
                      </div>

                      {/* Step content */}
                      <div className={`flex-1 rounded-xl border bg-card p-4 transition-all ${
                        isCompleted
                          ? "border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/10"
                          : "border-border hover:border-accent/40"
                      }`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`font-medium ${isCompleted ? "text-muted-foreground line-through" : "text-foreground"}`}>
                                {task.title}
                              </h4>
                              {task.priority === "high" && !isCompleted && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-destructive/10 text-destructive font-semibold uppercase">
                                  Required
                                </span>
                              )}
                            </div>
                            {task.description && (
                              <p className="text-sm text-muted-foreground">{task.description}</p>
                            )}
                            {task.due_date && !isCompleted && (
                              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground mt-2">
                                <Clock className="h-3 w-3" />
                                Due {new Date(task.due_date).toLocaleDateString()}
                              </span>
                            )}
                          </div>

                          {/* Action buttons */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {isCompleted ? (
                              <button
                                onClick={() => handleUpdateTask(task.id, "pending")}
                                className="text-xs text-muted-foreground hover:text-foreground transition-colors underline"
                              >
                                Undo
                              </button>
                            ) : (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => triggerTaskUpload(task.id)}
                                  disabled={isUploading}
                                >
                                  {isUploading ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <Upload className="h-3.5 w-3.5" />
                                  )}
                                  <span className="ml-1.5">{isUploading ? "Uploading…" : "Upload"}</span>
                                </Button>
                                <button
                                  onClick={() => handleUpdateTask(task.id, "completed")}
                                  className="h-8 w-8 rounded-full border-2 border-muted-foreground/30 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 flex items-center justify-center transition-all"
                                  title="Mark as complete"
                                >
                                  <Circle className="h-4 w-4 text-transparent" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {totalTasks === 0 && (
          <div className="text-center py-12 border border-dashed border-border rounded-xl">
            <CheckSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No tasks assigned yet. Check back soon!</p>
          </div>
        )}

        {/* Documents Section */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <button
            onClick={() => setExpandedSection(expandedSection === "docs" ? null : "docs")}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-semibold text-foreground">Uploaded Documents</h3>
                <p className="text-xs text-muted-foreground">{documents.length} file{documents.length !== 1 ? "s" : ""} uploaded</p>
              </div>
            </div>
            {expandedSection === "docs" ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>

          {expandedSection === "docs" && (
            <div className="border-t border-border">
              {/* Drop zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`m-4 border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                  isDragging ? "border-accent bg-accent/5 scale-[1.01]" : "border-border hover:border-accent/40"
                }`}
              >
                <Upload className={`h-8 w-8 mx-auto mb-2 ${isDragging ? "text-accent" : "text-muted-foreground"}`} />
                <p className="text-sm text-foreground font-medium mb-1">
                  {uploading ? "Uploading..." : isDragging ? "Drop files here" : "Drag & drop files or click to browse"}
                </p>
                <label className="cursor-pointer">
                  <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileChange} disabled={uploading} />
                  <Button variant="outline" size="sm" asChild disabled={uploading} className="mt-2">
                    <span>
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      {uploading ? "Uploading..." : "Choose Files"}
                    </span>
                  </Button>
                </label>
              </div>

              {/* Files list */}
              {documents.length > 0 && (
                <div className="px-4 pb-4 space-y-2">
                  {documents.map(doc => (
                    <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border">
                      <File className="h-4 w-4 text-accent flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{doc.file_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.file_size_bytes ? `${(doc.file_size_bytes / 1024).toFixed(1)} KB · ` : ""}
                          {new Date(doc.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Messages Section */}
      <div className="max-w-2xl mx-auto px-4 mt-6">
        <button
          onClick={() => {
            setShowMessages(!showMessages);
            if (!showMessages) loadMessages();
          }}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <span className="font-medium text-sm text-foreground">Messages</span>
          </div>
          {showMessages ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {showMessages && (
          <div className="mt-3 rounded-xl border border-border bg-card overflow-hidden">
            <div className="max-h-[300px] overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No messages yet. Send a message to your accountant.
                </p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${msg.sender_type === "client" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.sender_type === "cpa" && (
                      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="h-3.5 w-3.5 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] rounded-xl px-3 py-2 ${
                        msg.sender_type === "client"
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <p className="text-[10px] mt-1 opacity-60">
                        {new Date(msg.created_at).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                      </p>
                    </div>
                    {msg.sender_type === "client" && (
                      <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t border-border p-3">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                className="flex gap-2"
              >
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="min-h-[40px] max-h-[80px] resize-none text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={sendingMessage || !newMessage.trim()}
                  className="h-10 w-10 p-0 flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {showPoweredBy && (
        <footer className="border-t border-border mt-8 py-6 text-center">
          <p className="text-xs text-muted-foreground">
            Powered by{" "}
            <a href="https://ledgerstash.com?ref=portal" className="hover:text-foreground transition-colors">
              Ledger Stash
            </a>
            {" "}— Secure Client Vault for Accountants
          </p>
        </footer>
      )}
      {!showPoweredBy && <div className="mt-8" />}

      {/* AI Assistant */}
      <AIAssistantWidget mode="client" clientToken={token} />
    </div>
  );
}
