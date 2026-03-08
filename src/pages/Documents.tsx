import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, FolderOpen } from "lucide-react";

export default function Documents() {
  usePageTitle("Documents");
  const { user, loading: authLoading } = useAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

      // Get all clients for this firm
      const { data: clients } = await supabase
        .from('clients')
        .select('id, first_name, last_name')
        .eq('firm_id', fm.firm_id);

      if (!clients?.length) { setLoading(false); return; }

      const clientIds = clients.map(c => c.id);
      const clientMap = Object.fromEntries(clients.map(c => [c.id, `${c.first_name} ${c.last_name}`]));

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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Document Vault</h1>
        <p className="text-muted-foreground">Securely stored documents across all your clients, organized and audit-ready.</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
        </div>
      ) : documents.length === 0 ? (
        <div className="card-elevated p-12 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent mb-6">
            <FolderOpen className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">No documents yet</h2>
          <p className="text-muted-foreground">Documents will appear here when you or your clients upload files.</p>
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
              </tr>
            </thead>
            <tbody>
              {documents.map(doc => (
                <tr key={doc.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-accent flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground">{doc.file_name}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{doc.client_name}</td>
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
    </DashboardLayout>
  );
}
