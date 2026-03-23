import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ClientContacts } from "@/components/clients/ClientContacts";
import { ClientMessages } from "@/components/clients/ClientMessages";
import { AIConversationReview } from "@/components/ai/AIConversationReview";
import { useOrganization } from "@/hooks/useOrganization";
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
import { AuditExportButton } from "@/components/clients/AuditExportButton";
import { PBCTemplatePicker } from "@/components/clients/PBCTemplatePicker";
import { useAuth } from "@/hooks/useAuth";
import { EngagementHistoryDialog } from "@/components/clients/EngagementHistoryDialog";
import { ArrowLeft, Plus, Upload, FileText, CheckSquare, Clock, FolderPlus, Send, Loader2, Copy, ListChecks, Download, Trash2, Eye, MoreHorizontal, Pencil, X, MessageSquare, Settings, Bell, Archive } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const { organization } = useOrganization(user);
  const [client, setClient] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactCount, setContactCount] = useState(0);
  const [reminderOverride, setReminderOverride] = useState(false);
  const [clientReminderDays, setClientReminderDays] = useState("7");
  const [reminderSaving, setReminderSaving] = useState(false);
  // Task dialog
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: "", description: "", due_date: "", priority: "medium" });
  const [taskSaving, setTaskSaving] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);

  // Folder dialog
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);

  // Bulk task selection
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

  // Upload
  const [uploading, setUploading] = useState(false);

  // Invite
  const [inviting, setInviting] = useState(false);
  const [portalLink, setPortalLink] = useState<string | null>(null);
  const [engagementDialogOpen, setEngagementDialogOpen] = useState(false);

  useEffect(() => {
    if (user?.id && id) loadClientData();
  }, [user?.id, id, organization?.id]);

  const loadClientData = async () => {
    if (!id) return;
    try {
      const [clientRes, docsRes, tasksRes, foldersRes, contactsRes] = await Promise.all([
        supabase.from('clients').select('*').eq('id', id).single(),
        supabase.from('documents').select('*').eq('client_id', id).order('created_at', { ascending: false }),
        supabase.from('tasks').select('*').eq('client_id', id).order('created_at', { ascending: false }),
        supabase.from('folders').select('*').eq('client_id', id).order('name'),
        organization?.id
          ? supabase.from('recipients').select('id', { count: 'exact', head: true }).eq('client_id', id).eq('organization_id', organization.id).eq('is_deleted', false)
          : Promise.resolve({ count: 0 }),
      ]);

      const clientData = clientRes.data;
      setClient(clientData);
      if (clientData?.reminder_cadence_days) {
        setReminderOverride(true);
        setClientReminderDays(clientData.reminder_cadence_days.toString());
      } else {
        setReminderOverride(false);
      }
      setDocuments(docsRes.data || []);
      setTasks(tasksRes.data || []);
      setFolders(foldersRes.data || []);
      setContactCount(contactsRes.count || 0);
    } catch (error) {
      console.error('Error loading client:', error);
    } finally {
      setLoading(false);
    }
  };

  // handleCreateTask is now merged into handleSaveTask below

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

  const handleDropFiles = async (files: FileList) => {
    if (!id || !user?.id) return;
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
    }
  };

  const handleSendInvite = async () => {
    if (!client || !user?.id) return;
    setInviting(true);
    try {
      // Get firm name
      const { data: fm } = await supabase
        .from('firm_members')
        .select('firm_id')
        .eq('profile_id', user.id)
        .maybeSingle();
      let firmName = "";
      let senderName = "";
      if (fm?.firm_id) {
        const { data: firm } = await supabase.from('firms').select('name').eq('id', fm.firm_id).single();
        firmName = firm?.name || "";
      }
      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
      senderName = profile?.full_name || "";

      const res = await supabase.functions.invoke('send-client-invite', {
        body: { clientId: client.id, firmName, senderName },
      });

      if (res.error) throw new Error(res.error.message);
      if (!res.data?.success) throw new Error(res.data?.error || 'Failed to send invite');

      setPortalLink(res.data.portalUrl);
      toast.success(`Invite sent to ${client.email}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to send invite");
    } finally {
      setInviting(false);
    }
  };

  const copyPortalLink = () => {
    if (portalLink) {
      navigator.clipboard.writeText(portalLink);
      toast.success("Portal link copied to clipboard");
    }
  };

  const handleDownloadDoc = async (doc: any) => {
    try {
      const { data, error } = await supabase.storage
        .from('client-documents')
        .download(doc.storage_path);
      if (error) throw error;
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.file_name;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error: any) {
      toast.error("Failed to download file");
    }
  };

  const handleDeleteDoc = async (doc: any) => {
    if (!confirm(`Delete "${doc.file_name}"? This cannot be undone.`)) return;
    try {
      await supabase.storage.from('client-documents').remove([doc.storage_path]);
      const { error } = await supabase.from('documents').delete().eq('id', doc.id);
      if (error) throw error;
      toast.success("Document deleted");
      loadClientData();
    } catch (error: any) {
      toast.error("Failed to delete document");
    }
  };

  const handlePreviewDoc = async (doc: any) => {
    try {
      const { data, error } = await supabase.storage
        .from('client-documents')
        .createSignedUrl(doc.storage_path, 300);
      if (error) throw error;
      window.open(data.signedUrl, '_blank');
    } catch (error: any) {
      toast.error("Failed to preview file");
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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

  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || "",
      due_date: task.due_date || "",
      priority: task.priority,
    });
    setTaskDialogOpen(true);
  };

  const handleSaveTask = async () => {
    if (!taskForm.title) {
      toast.error("Please enter a task title");
      return;
    }
    setTaskSaving(true);
    try {
      if (editingTask) {
        // Update existing task
        const { error } = await supabase.from('tasks').update({
          title: taskForm.title,
          description: taskForm.description || null,
          due_date: taskForm.due_date || null,
          priority: taskForm.priority,
        }).eq('id', editingTask.id);
        if (error) throw error;
        toast.success("Task updated");
      } else {
        // Create new task
        if (!id || !user?.id) return;
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
      }
      setTaskForm({ title: "", description: "", due_date: "", priority: "medium" });
      setEditingTask(null);
      setTaskDialogOpen(false);
      loadClientData();
    } catch (error: any) {
      toast.error(error.message || "Failed to save task");
    } finally {
      setTaskSaving(false);
    }
  };

  const handleDeleteTask = async (taskId: string, taskTitle: string) => {
    if (!confirm(`Delete "${taskTitle}"? This cannot be undone.`)) return;
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);
      if (error) throw error;
      toast.success("Task deleted");
      loadClientData();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete task");
    }
  };

  const handleBulkDeleteTasks = async () => {
    if (selectedTaskIds.size === 0) return;
    if (!confirm(`Delete ${selectedTaskIds.size} selected task(s)? This cannot be undone.`)) return;
    setBulkDeleting(true);
    try {
      const { error } = await supabase.from('tasks').delete().in('id', Array.from(selectedTaskIds));
      if (error) throw error;
      toast.success(`${selectedTaskIds.size} task(s) deleted`);
      setSelectedTaskIds(new Set());
      loadClientData();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete tasks");
    } finally {
      setBulkDeleting(false);
    }
  };

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTaskIds(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  };

  const toggleAllTasks = () => {
    if (selectedTaskIds.size === tasks.length) {
      setSelectedTaskIds(new Set());
    } else {
      setSelectedTaskIds(new Set(tasks.map(t => t.id)));
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
              <h1 className="text-2xl font-bold text-foreground">
                {client.client_type === 'business' && client.company_name
                  ? client.company_name
                  : `${client.first_name} ${client.last_name}`}
              </h1>
              {client.client_type === 'business' && (
                <p className="text-sm text-foreground/80">{client.first_name} {client.last_name} · Primary Contact</p>
              )}
              <p className="text-muted-foreground">{client.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start">
            <AuditExportButton
              clientId={client.id}
              clientName={`${client.first_name} ${client.last_name}`}
            />
            <span className={`text-xs px-3 py-1 rounded-full ${
              client.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
            }`}>
              {client.status}
            </span>
            <Button variant="hero" size="sm" onClick={handleSendInvite} disabled={inviting}>
              {inviting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {inviting ? "Sending..." : "Send Invite"}
            </Button>
          </div>
        </div>
        {client.notes && (
          <p className="mt-3 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">{client.notes}</p>
        )}
        {portalLink && (
          <div className="mt-3 flex items-center gap-2 bg-success/5 border border-success/20 rounded-lg p-3">
            <p className="text-sm text-foreground flex-1 truncate">{portalLink}</p>
            <Button variant="outline" size="sm" onClick={copyPortalLink}>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </Button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="documents" className="space-y-6">
        <TabsList>
          <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
          <TabsTrigger value="tasks">Tasks ({tasks.length})</TabsTrigger>
          <TabsTrigger value="messages">
            <MessageSquare className="h-4 w-4 mr-1" />
            Messages
          </TabsTrigger>
          {client.client_type === 'business' && (
            <TabsTrigger value="contacts">Contacts ({contactCount})</TabsTrigger>
          )}
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-1" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
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

          {/* Drop Zone */}
          <DropZone onFiles={handleDropFiles} uploading={uploading} />

          {/* Documents List */}
          {documents.length > 0 && (
            <div className="card-elevated overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                     <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">File Name</th>
                     <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Type</th>
                     <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Size</th>
                     <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Uploaded</th>
                     <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">Actions</th>
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
                         {formatFileSize(doc.file_size_bytes)}
                       </td>
                       <td className="px-4 py-3 text-sm text-muted-foreground">
                         {new Date(doc.created_at).toLocaleDateString()}
                       </td>
                       <td className="px-4 py-3 text-right">
                         <div className="flex items-center justify-end gap-1">
                           <Button variant="ghost" size="sm" onClick={() => handlePreviewDoc(doc)} title="Preview">
                             <Eye className="h-3.5 w-3.5" />
                           </Button>
                           <Button variant="ghost" size="sm" onClick={() => handleDownloadDoc(doc)} title="Download">
                             <Download className="h-3.5 w-3.5" />
                           </Button>
                           <Button variant="ghost" size="sm" onClick={() => handleDeleteDoc(doc)} title="Delete" className="text-destructive hover:text-destructive">
                             <Trash2 className="h-3.5 w-3.5" />
                           </Button>
                         </div>
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
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setTemplatePickerOpen(true)}>
              <ListChecks className="h-4 w-4" />
              Use Template
            </Button>
            <Dialog open={taskDialogOpen} onOpenChange={(open) => {
              setTaskDialogOpen(open);
              if (!open) {
                setEditingTask(null);
                setTaskForm({ title: "", description: "", due_date: "", priority: "medium" });
              }
            }}>
              <DialogTrigger asChild>
                <Button variant="hero" size="sm" onClick={() => { setEditingTask(null); setTaskForm({ title: "", description: "", due_date: "", priority: "medium" }); }}>
                  <Plus className="h-4 w-4" />
                  New Task
                </Button>
              </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingTask ? "Edit Task" : "Create Task"}</DialogTitle>
                <DialogDescription>{editingTask ? "Update this task's details." : "Assign a task to this client."}</DialogDescription>
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
                <Button variant="hero" onClick={handleSaveTask} disabled={taskSaving}>
                  {taskSaving ? "Saving..." : editingTask ? "Save Changes" : "Create Task"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          </div>

          <PBCTemplatePicker
            open={templatePickerOpen}
            onOpenChange={setTemplatePickerOpen}
            onSelect={async (templateTasks, sendInvite) => {
              if (!id || !user?.id) return;
              try {
                const inserts = templateTasks.map((t) => ({
                  client_id: id,
                  assigned_by: user.id,
                  title: t.title,
                  description: t.description,
                  priority: t.priority,
                }));
                const { error } = await supabase.from("tasks").insert(inserts);
                if (error) throw error;
                toast.success(`${templateTasks.length} tasks created from template`);
                loadClientData();

                if (sendInvite) {
                  // Automatically send the portal invite
                  handleSendInvite();
                }
              } catch (error: any) {
                toast.error(error.message || "Failed to create tasks from template");
              }
            }}
          />
          {tasks.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-xl">
              <CheckSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No tasks assigned yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Bulk actions bar */}
              <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
                <Checkbox
                  checked={selectedTaskIds.size === tasks.length && tasks.length > 0}
                  onCheckedChange={toggleAllTasks}
                  aria-label="Select all tasks"
                />
                <span className="text-sm text-muted-foreground">
                  {selectedTaskIds.size > 0
                    ? `${selectedTaskIds.size} of ${tasks.length} selected`
                    : `${tasks.length} tasks`}
                </span>
                {selectedTaskIds.size > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDeleteTasks}
                    disabled={bulkDeleting}
                    className="ml-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                    {bulkDeleting ? "Deleting..." : `Delete (${selectedTaskIds.size})`}
                  </Button>
                )}
              </div>

              {tasks.map(task => (
                <div key={task.id} className={`p-4 rounded-lg border bg-card flex items-start gap-3 ${
                  selectedTaskIds.has(task.id) ? 'border-primary/40 bg-primary/5' : 'border-border'
                }`}>
                  <Checkbox
                    checked={selectedTaskIds.has(task.id)}
                    onCheckedChange={() => toggleTaskSelection(task.id)}
                    className="mt-1"
                    aria-label={`Select ${task.title}`}
                  />
                  <div className="flex-1 min-w-0 flex items-start justify-between gap-4">
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
                    <div className="flex items-center gap-2">
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditTask(task)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteTask(task.id, task.title)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages">
          <div className="space-y-6">
            <ClientMessages
              clientId={client.id}
              clientName={client.company_name || `${client.first_name} ${client.last_name}`}
            />
            {organization?.id && (
              <AIConversationReview
                clientId={client.id}
                organizationId={organization.id}
              />
            )}
          </div>
        </TabsContent>

        {/* Contacts Tab - Business clients only */}
        {client.client_type === 'business' && organization?.id && (
          <TabsContent value="contacts">
            <ClientContacts
              clientId={client.id}
              organizationId={organization.id}
              clientEmail={client.email}
              clientName={client.company_name || `${client.first_name} ${client.last_name}`}
              onCountChange={setContactCount}
            />
          </TabsContent>
        )}
        {/* Settings Tab */}
        <TabsContent value="settings">
          <div className="max-w-lg space-y-6">
            <div className="rounded-lg border bg-card p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Reminder Schedule</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Override the organization-wide reminder cadence for this specific client.
                {organization?.auto_reminder_days && !reminderOverride && (
                  <span className="block mt-1">Currently using org default: every <strong>{organization.auto_reminder_days} days</strong></span>
                )}
              </p>
              <div className="flex items-center justify-between">
                <Label htmlFor="reminderOverride">Custom reminder cadence</Label>
                <Switch
                  id="reminderOverride"
                  checked={reminderOverride}
                  onCheckedChange={(checked) => {
                    setReminderOverride(checked);
                    if (!checked) {
                      // Save null immediately when turning off
                      setReminderSaving(true);
                      supabase.from("clients").update({ reminder_cadence_days: null }).eq("id", client.id)
                        .then(({ error }) => {
                          if (error) { toast.error("Failed to update"); }
                          else { toast.success("Using org default reminder schedule"); setClient({ ...client, reminder_cadence_days: null }); }
                          setReminderSaving(false);
                        });
                    }
                  }}
                />
              </div>
              {reminderOverride && (
                <div className="space-y-3 pt-2 border-t">
                  <Label>Frequency</Label>
                  <Select value={clientReminderDays} onValueChange={setClientReminderDays}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,5,7,10,14,21,30].map(d => (
                        <SelectItem key={d} value={d.toString()}>Every {d} day{d > 1 ? "s" : ""}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="hero"
                    size="sm"
                    disabled={reminderSaving || parseInt(clientReminderDays) === client.reminder_cadence_days}
                    onClick={async () => {
                      setReminderSaving(true);
                      const days = parseInt(clientReminderDays);
                      const { error } = await supabase.from("clients").update({ reminder_cadence_days: days }).eq("id", client.id);
                      if (error) toast.error("Failed to save");
                      else { toast.success(`Reminders set to every ${days} day${days > 1 ? "s" : ""}`); setClient({ ...client, reminder_cadence_days: days }); }
                      setReminderSaving(false);
                    }}
                  >
                    {reminderSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Save
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
