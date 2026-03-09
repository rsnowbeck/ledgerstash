import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { DropZone } from "@/components/documents/DropZone";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, FolderOpen, MoreVertical, Download, Trash2, Eye, Upload } from "lucide-react";
import { toast } from "sonner";

export default function Documents() {
  usePageTitle("Document Vault");
  const { user, loading: authLoading } = useAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [firmId, setFirmId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string>("all");
  const [deleteDoc, setDeleteDoc] = useState<any | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    if (user?.id) loadDocuments();
  }, [user?.id]);

  const loadDocuments = async () => {
    if (!user?.id) return;
    try {
      const { data: fm } = await supabase
        .from('firm_members')
        .select('firm_id')
        .eq('profile_id', user.id)
        .maybeSingle();

      if (!fm) { setLoading(false); return; }
      setFirmId(fm.firm_id);

      const { data: clientList } = await supabase
        .from('clients')
        .select('id, first_name, last_name')
        .eq('firm_id', fm.firm_id)
        .order('last_name');

      setClients(clientList || []);

      if (!clientList?.length) { setLoading(false); return; }

      const clientIds = clientList.map(c => c.id);
      const clientMap = Object.fromEntries(clientList.map(c => [c.id, `${c.first_name} ${c.last_name}`]));

      const { data: docs } = await supabase
        .from('documents')
        .select('*')
        .in('client_id', clientIds)
        .order('created_at', { ascending: false });

      setDocuments((docs || []).map(d => ({ ...d, client_name: clientMap[d.client_id] || 'Unknown' })));
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadFiles = async (files: FileList) => {
    if (!user?.id || !firmId || selectedClient === "all") {
      toast.error("Please select a client before uploading.");
      return;
    }
    setUploading(true);
    let successCount = 0;
    try {
      for (const file of Array.from(files)) {
        const path = `${selectedClient}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('client-documents')
          .upload(path, file);
        if (uploadError) {
          console.error('Upload error:', uploadError);
          toast.error(`Failed to upload ${file.name}`);
          continue;
        }
        const { error: insertError } = await supabase
          .from('documents')
          .insert({
            client_id: selectedClient,
            uploaded_by: user.id,
            file_name: file.name,
            file_type: file.type,
            file_size_bytes: file.size,
            storage_path: path,
          });
        if (insertError) {
          console.error('Insert error:', insertError);
          toast.error(`Failed to save ${file.name}`);
          continue;
        }
        successCount++;
      }
      if (successCount > 0) {
        toast.success(`${successCount} file${successCount > 1 ? 's' : ''} uploaded`);
        loadDocuments();
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (doc: any) => {
    try {
      const { data, error } = await supabase.storage
        .from('client-documents')
        .createSignedUrl(doc.storage_path, 60);
      if (error || !data?.signedUrl) throw error;
      window.open(data.signedUrl, '_blank');
    } catch {
      toast.error("Failed to download file");
    }
  };

  const handlePreview = async (doc: any) => {
    try {
      const { data, error } = await supabase.storage
        .from('client-documents')
        .createSignedUrl(doc.storage_path, 60);
      if (error || !data?.signedUrl) throw error;
      window.open(data.signedUrl, '_blank');
    } catch {
      toast.error("Failed to preview file");
    }
  };

  const handleDelete = async () => {
    if (!deleteDoc) return;
    try {
      await supabase.storage.from('client-documents').remove([deleteDoc.storage_path]);
      const { error } = await supabase.from('documents').delete().eq('id', deleteDoc.id);
      if (error) throw error;
      toast.success(`Deleted ${deleteDoc.file_name}`);
      setDeleteDoc(null);
      loadDocuments();
    } catch {
      toast.error("Failed to delete file");
    }
  };

  const formatSize = (bytes: number | null) => {
    if (!bytes) return '—';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filteredDocs = selectedClient === "all"
    ? documents
    : documents.filter(d => d.client_id === selectedClient);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }
  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Document Vault</h1>
          <p className="text-muted-foreground">Securely stored documents across all your clients.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Clients" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              {clients.map(c => (
                <SelectItem key={c.id} value={c.id}>
                  {c.first_name} {c.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="accent"
            size="sm"
            onClick={() => {
              if (selectedClient === "all") {
                toast.error("Select a client first to upload files.");
                return;
              }
              setShowUpload(prev => !prev);
            }}
          >
            <Upload className="h-4 w-4 mr-1" />
            Upload
          </Button>
        </div>
      </div>

      {showUpload && selectedClient !== "all" && (
        <div className="mb-6">
          <DropZone onFiles={handleUploadFiles} uploading={uploading} />
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="card-elevated p-12 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent mb-6">
            <FolderOpen className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {selectedClient !== "all" ? "No documents for this client" : "Your vault is empty"}
          </h2>
          <p className="text-muted-foreground">
            {selectedClient !== "all"
              ? "Upload files using the drop zone above."
              : "Select a client and upload files, or documents will appear as clients upload through the portal."}
          </p>
        </div>
      ) : (
        <div className="card-elevated overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">File Name</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Client</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Size</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Uploaded</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map(doc => (
                <tr key={doc.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-accent flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground">{doc.file_name}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{doc.client_name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{doc.file_type || '—'}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{formatSize(doc.file_size_bytes)}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(doc.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handlePreview(doc)}>
                          <Eye className="h-4 w-4 mr-2" /> Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload(doc)}>
                          <Download className="h-4 w-4 mr-2" /> Download
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteDoc(doc)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AlertDialog open={!!deleteDoc} onOpenChange={(open) => !open && setDeleteDoc(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteDoc?.file_name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
