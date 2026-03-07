import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DropZone } from "@/components/documents/DropZone";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Plus, Upload, FileText, CheckSquare, Clock, FolderPlus, Send, Loader2, Copy } from "lucide-react";
import { toast } from "sonner";

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const [client, setClient] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Task dialog
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: "", description: "", due_date: "", priority: "medium" });
  const [taskSaving, setTaskSaving] = useState(false);

  // Folder dialog
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [folderName, setFolderName] = useState("");

  // Upload
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user?.id && id) loadClientData();
  }, [user?.id, id]);

  const loadClientData = async () => {
    if (!id) return;
    try {
      const [clientRes, docsRes, tasksRes, foldersRes] = await Promise.all([
        supabase.from('clients').select('*').eq('id', id).single(),
        supabase.from('documents').select('*').eq('client_id', id).order('created_at', { ascending: false }),
        supabase.from('tasks').select('*').eq('client_id', id).order('created_at', { ascending: false }),
        supabase.from('folders').select('*').eq('client_id', id).order('name'),
      ]);

      setClient(clientRes.data);
      setDocuments(docsRes.data || []);
      setTasks(tasksRes.data || []);
      setFolders(foldersRes.data || []);
    } catch (error) {
      console.error('Error loading client:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!id || !user?.id || !taskForm.title) {
      toast.error("Please enter a task title");
      return;
    }
    setTaskSaving(true);
    try {
      const { error } = await supabase.from('tasks').insert({
        client_id: id,
        assigned_by: user.id,
        title: taskForm.title,
        description: taskForm.description || null,
        due_date: taskForm.due_date || null,
        priority: taskForm.priority,
      });
      if (error) throw error;
      toast.success("Task created");
      setTaskForm({ title: "", description: "", due_date: "", priority: "medium" });
      setTaskDialogOpen(false);
      loadClientData();
    } catch (error: any) {
      toast.error(error.message || "Failed to create task");
    } finally {
      setTaskSaving(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!id || !folderName) return;
    try {
      const { error } = await supabase.from('folders').insert({
        client_id: id,
        name: folderName,
      });
      if (error) throw error;
      toast.success("Folder created");
      setFolderName("");
      setFolderDialogOpen(false);
      loadClientData();
    } catch (error: any) {
      toast.error(error.message || "Failed to create folder");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length || !id || !user?.id) return;
    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        const storagePath = `${id}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('client-documents')
          .upload(storagePath, file);

        if (uploadError) throw uploadError;

        const { error: dbError } = await supabase.from('documents').insert({
          client_id: id,
          uploaded_by: user.id,
          file_name: file.name,
          file_type: file.type || null,
          file_size_bytes: file.size,
          storage_path: storagePath,
        });

        if (dbError) throw dbError;
      }
      toast.success(`${files.length} file(s) uploaded`);
      loadClientData();
    } catch (error: any) {
      toast.error(error.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, status: string) => {
    try {
      const { error } = await supabase.from('tasks').update({ status }).eq('id', taskId);
      if (error) throw error;
      toast.success("Task updated");
      loadClientData();
    } catch (error: any) {
      toast.error(error.message || "Failed to update task");
    }
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-32" />)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!client) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Client not found.</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link to="/clients">Back to Clients</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <Link to="/clients" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Clients
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">{client.first_name?.[0]}{client.last_name?.[0]}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{client.first_name} {client.last_name}</h1>
              <p className="text-muted-foreground">{client.email}</p>
            </div>
          </div>
          <span className={`self-start text-xs px-3 py-1 rounded-full ${
            client.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
          }`}>
            {client.status}
          </span>
        </div>
        {client.notes && (
          <p className="mt-3 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">{client.notes}</p>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="documents" className="space-y-6">
        <TabsList>
          <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
          <TabsTrigger value="tasks">Tasks ({tasks.length})</TabsTrigger>
        </TabsList>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <div className="flex items-center gap-3">
            <label className="cursor-pointer">
              <input type="file" multiple className="hidden" onChange={handleFileUpload} disabled={uploading} />
              <Button variant="hero" size="sm" asChild disabled={uploading}>
                <span>
                  <Upload className="h-4 w-4" />
                  {uploading ? "Uploading..." : "Upload Files"}
                </span>
              </Button>
            </label>
            <Dialog open={folderDialogOpen} onOpenChange={setFolderDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <FolderPlus className="h-4 w-4" />
                  New Folder
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Folder</DialogTitle>
                  <DialogDescription>Organize this client's documents into folders.</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Label htmlFor="folder-name">Folder Name</Label>
                  <Input id="folder-name" value={folderName} onChange={e => setFolderName(e.target.value)} className="mt-2" />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setFolderDialogOpen(false)}>Cancel</Button>
                  <Button variant="hero" onClick={handleCreateFolder}>Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Folders */}
          {folders.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {folders.map(folder => (
                <div key={folder.id} className="p-4 rounded-lg border border-border bg-card hover:border-accent/30 transition-colors cursor-pointer">
                  <FolderPlus className="h-8 w-8 text-accent mb-2" />
                  <p className="text-sm font-medium text-foreground truncate">{folder.name}</p>
                </div>
              ))}
            </div>
          )}

          {/* Documents List */}
          {documents.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-xl">
              <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No documents yet. Upload files to get started.</p>
            </div>
          ) : (
            <div className="card-elevated overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">File Name</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Type</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Size</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Uploaded</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map(doc => (
                    <tr key={doc.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-accent flex-shrink-0" />
                        <span className="text-sm font-medium text-foreground">{doc.file_name}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{doc.file_type || '—'}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {doc.file_size_bytes ? `${(doc.file_size_bytes / 1024).toFixed(1)} KB` : '—'}
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

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4">
          <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" size="sm">
                <Plus className="h-4 w-4" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Task</DialogTitle>
                <DialogDescription>Assign a task to this client.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input value={taskForm.title} onChange={e => setTaskForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g., Upload W-2 forms" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={taskForm.description} onChange={e => setTaskForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional details" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Input type="date" value={taskForm.due_date} onChange={e => setTaskForm(f => ({ ...f, due_date: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select value={taskForm.priority} onValueChange={v => setTaskForm(f => ({ ...f, priority: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setTaskDialogOpen(false)}>Cancel</Button>
                <Button variant="hero" onClick={handleCreateTask} disabled={taskSaving}>
                  {taskSaving ? "Creating..." : "Create Task"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {tasks.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-xl">
              <CheckSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No tasks assigned yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map(task => (
                <div key={task.id} className="p-4 rounded-lg border border-border bg-card flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-foreground">{task.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        task.priority === 'high' ? 'bg-destructive/10 text-destructive' :
                        task.priority === 'medium' ? 'bg-warning/10 text-warning' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    {task.description && <p className="text-sm text-muted-foreground mb-2">{task.description}</p>}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {task.due_date && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Due {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <Select value={task.status} onValueChange={v => handleUpdateTaskStatus(task.id, v)}>
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
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
