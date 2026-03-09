import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePageTitle } from "@/hooks/usePageTitle";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  FolderOpen, 
  Plus,
  Clock,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Lock,
  FileText,
  Upload,
  AlertCircle,
  Send,
  Download,
  Trash2,
  MoreHorizontal,
  ShieldCheck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useOrganization } from "@/hooks/useOrganization";
import { OnboardingTour } from "@/components/onboarding/OnboardingTour";
import { PlanWelcomeOverlay } from "@/components/onboarding/PlanWelcomeOverlay";
import { useSubscription } from "@/hooks/useSubscription";

interface ClientWithTasks {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company_name: string | null;
  client_type: string;
  status: string;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  highPriorityPending: number;
}

export default function Dashboard() {
  usePageTitle("Dashboard");
  const { user, loading: authLoading } = useAuth();
  const { organization } = useOrganization(user);
  const { planKey } = useSubscription(user);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalClients: 0,
    totalDocuments: 0,
    pendingTasks: 0,
    completedTasks: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [clientsWithTasks, setClientsWithTasks] = useState<ClientWithTasks[]>([]);
  const [recentDocs, setRecentDocs] = useState<any[]>([]);
  const [firmId, setFirmId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadFirmAndStats();
    }
  }, [user?.id]);

  const loadFirmAndStats = async () => {
    if (!user?.id) return;
    
    try {
      const { data: firmMember } = await supabase
        .from('firm_members')
        .select('firm_id')
        .eq('profile_id', user.id)
        .maybeSingle();

      if (!firmMember) {
        const companyName = user.user_metadata?.company_name;
        let firmName = companyName || 'My Firm';
        if (!companyName) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .maybeSingle();
          firmName = profile?.full_name ? `${profile.full_name}'s Firm` : 'My Firm';
        }
        
        const { data: newFirm } = await supabase
          .from('firms')
          .insert({ name: firmName, owner_id: user.id })
          .select()
          .single();

        if (newFirm) {
          await supabase
            .from('firm_members')
            .insert({ firm_id: newFirm.id, profile_id: user.id, role: 'owner' });
          setFirmId(newFirm.id);
          await fetchStats(newFirm.id);
        }
      } else {
        setFirmId(firmMember.firm_id);
        await fetchStats(firmMember.firm_id);
      }
    } catch (error) {
      console.error('Error loading firm:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchStats = async (fId: string) => {
    try {
      // Fetch all clients
      const { data: clients, count: clientsCount } = await supabase
        .from('clients')
        .select('*', { count: 'exact' })
        .eq('firm_id', fId)
        .order('created_at', { ascending: false });

      const allClients = clients || [];
      const clientIds = allClients.map(c => c.id);

      // Fetch docs count
      const { count: docsCount } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .in('client_id', clientIds.length > 0 ? clientIds : ['00000000-0000-0000-0000-000000000000']);

      // Fetch recent documents
      let docs: any[] = [];
      if (clientIds.length > 0) {
        const { data: docsData } = await supabase
          .from('documents')
          .select('*, clients!inner(first_name, last_name)')
          .in('client_id', clientIds)
          .order('created_at', { ascending: false })
          .limit(5);
        docs = docsData || [];
      }
      setRecentDocs(docs);

      // Fetch ALL tasks for these clients (not just 5)
      let allTasks: any[] = [];
      if (clientIds.length > 0) {
        const { data: tasks } = await supabase
          .from('tasks')
          .select('*')
          .in('client_id', clientIds);
        allTasks = tasks || [];
      }

      const totalPending = allTasks.filter(t => t.status !== 'completed').length;
      const totalCompleted = allTasks.filter(t => t.status === 'completed').length;

      setStats({
        totalClients: clientsCount || 0,
        totalDocuments: docsCount || 0,
        pendingTasks: totalPending,
        completedTasks: totalCompleted,
      });

      // Build client-with-tasks view
      const clientTaskMap: ClientWithTasks[] = allClients.map(client => {
        const clientTasks = allTasks.filter(t => t.client_id === client.id);
        const completed = clientTasks.filter(t => t.status === 'completed').length;
        const pending = clientTasks.filter(t => t.status !== 'completed').length;
        const highPriority = clientTasks.filter(t => t.status !== 'completed' && t.priority === 'high').length;
        return {
          id: client.id,
          first_name: client.first_name,
          last_name: client.last_name,
          email: client.email,
          company_name: client.company_name,
          client_type: client.client_type,
          status: client.status,
          totalTasks: clientTasks.length,
          completedTasks: completed,
          pendingTasks: pending,
          highPriorityPending: highPriority,
        };
      });

      // Sort: clients with pending tasks first, then by pending count desc
      clientTaskMap.sort((a, b) => {
        if (a.pendingTasks > 0 && b.pendingTasks === 0) return -1;
        if (a.pendingTasks === 0 && b.pendingTasks > 0) return 1;
        return b.pendingTasks - a.pendingTasks;
      });

      setClientsWithTasks(clientTaskMap);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleDownloadDoc = async (doc: any) => {
    try {
      const { data, error } = await supabase.storage
        .from('client-documents')
        .createSignedUrl(doc.storage_path, 60);
      if (error) throw error;
      window.open(data.signedUrl, '_blank');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download document');
    }
  };

  const handleDeleteDoc = async (doc: any) => {
    if (!confirm(`Delete "${doc.file_name}"? This cannot be undone.`)) return;
    try {
      const { error: storageError } = await supabase.storage
        .from('client-documents')
        .remove([doc.storage_path]);
      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', doc.id);
      if (dbError) throw dbError;

      setRecentDocs(prev => prev.filter(d => d.id !== doc.id));
      setStats(prev => ({ ...prev, totalDocuments: Math.max(0, prev.totalDocuments - 1) }));
      toast.success('Document deleted');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete document');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (statsLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="stat-card">
                <Skeleton className="h-10 w-10 rounded-lg mb-4" />
                <Skeleton className="h-8 w-12 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const statCards = [
    { label: "Active Clients", value: stats.totalClients.toString(), icon: Users, clickAction: '/clients' },
    { label: "Documents", value: stats.totalDocuments.toString(), icon: FolderOpen, clickAction: '/documents' },
    { label: "Pending Tasks", value: stats.pendingTasks.toString(), icon: Clock, clickAction: '/clients' },
    { label: "Completed", value: stats.completedTasks.toString(), icon: CheckCircle, clickAction: '/clients' },
  ];

  const clientsNeedingAction = clientsWithTasks.filter(c => c.pendingTasks > 0);
  const clientsAllDone = clientsWithTasks.filter(c => c.totalTasks > 0 && c.pendingTasks === 0);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your firm.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="heroOutline" size="sm" asChild>
            <Link to="/clients">
              <Plus className="h-4 w-4" />
              Add Client
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <button
            key={stat.label}
            onClick={() => navigate(stat.clickAction)}
            className="stat-card text-left transition-all hover:shadow-md hover:border-accent/30 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-accent/10">
                <stat.icon className="h-5 w-5 text-accent" />
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </button>
        ))}
      </div>

      {/* Empty State */}
      {stats.totalClients === 0 ? (
        <div className="card-elevated p-12 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent mb-6">
            <Users className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Get started with LedgerStash
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Add your first client to start exchanging documents and managing PBC task lists securely.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="hero" asChild>
              <Link to="/clients">
                <Users className="h-4 w-4" />
                Add Your First Client
              </Link>
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Add clients", desc: "Import your client list or add them one by one." },
              { step: "2", title: "Create PBC lists", desc: "Define what documents each client needs to provide." },
              { step: "3", title: "Track & close", desc: "Monitor uploads, auto-remind, and export audit packages." },
            ].map((item) => (
              <div key={item.step} className="p-6 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{item.step}</span>
                  </div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Client PBC Status */}
          <div className="lg:col-span-5 space-y-6">
            {/* Clients Needing Action */}
            <div className="card-elevated overflow-hidden">
              <div className="p-5 border-b border-border flex justify-between items-center bg-muted/30">
                <h2 className="font-bold text-foreground flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  Clients Needing Action
                </h2>
                <span className="bg-destructive/10 text-destructive text-xs font-bold px-2 py-1 rounded-full">
                  {clientsNeedingAction.length}
                </span>
              </div>
              <div className="divide-y divide-border">
                {clientsNeedingAction.length === 0 && clientsAllDone.length === 0 ? (
                  <div className="p-6 text-center">
                    <Send className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No PBC tasks yet.</p>
                    <p className="text-xs text-muted-foreground mt-1">Create tasks from a client's detail page.</p>
                  </div>
                ) : clientsNeedingAction.length === 0 ? (
                  <div className="p-6 text-center">
                    <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground">All caught up!</p>
                    <p className="text-xs text-muted-foreground mt-1">Every client has completed their tasks.</p>
                  </div>
                ) : (
                  clientsNeedingAction.slice(0, 8).map((client) => {
                    const pct = client.totalTasks > 0
                      ? Math.round((client.completedTasks / client.totalTasks) * 100)
                      : 0;
                    const displayName = client.client_type === 'business' && client.company_name
                      ? client.company_name
                      : `${client.first_name} ${client.last_name}`;

                    return (
                      <Link
                        key={client.id}
                        to={`/clients/${client.id}`}
                        className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors group"
                      >
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold text-primary">
                            {client.first_name?.[0]}{client.last_name?.[0]}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
                            <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                              {client.completedTasks}/{client.totalTasks}
                            </span>
                          </div>
                          <Progress value={pct} className="h-1.5 mb-1" />
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {client.pendingTasks} pending
                            </span>
                                 {client.highPriorityPending > 0 && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-destructive/10 text-destructive font-semibold">
                                {client.highPriorityPending} urgent
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </Link>
                    );
                  })
                )}
              </div>
              {clientsNeedingAction.length > 8 && (
                <div className="p-3 border-t border-border text-center">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/clients">
                      View all {clientsNeedingAction.length} clients
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Completed Clients */}
            {clientsAllDone.length > 0 && (
              <div className="card-elevated overflow-hidden">
                <div className="p-5 border-b border-border flex justify-between items-center bg-muted/30">
                  <h2 className="font-bold text-foreground flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Completed
                  </h2>
                  <span className="bg-emerald-500/10 text-emerald-600 text-xs font-bold px-2 py-1 rounded-full">
                    {clientsAllDone.length}
                  </span>
                </div>
                <div className="divide-y divide-border">
                  {clientsAllDone.slice(0, 5).map((client) => {
                    const displayName = client.client_type === 'business' && client.company_name
                      ? client.company_name
                      : `${client.first_name} ${client.last_name}`;
                    return (
                      <Link
                        key={client.id}
                        to={`/clients/${client.id}`}
                        className="flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors"
                      >
                        <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">{displayName}</p>
                        <span className="ml-auto text-xs text-muted-foreground">{client.totalTasks} tasks</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Document Vault + Recent Clients */}
          <div className="lg:col-span-7 space-y-6">
            {/* Document Vault Table */}
            <div className="card-elevated overflow-hidden">
              <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-bold text-foreground text-lg">Secure Document Vault</h2>
                  <p className="text-sm text-muted-foreground">Recent documents across all clients.</p>
                </div>
                <Button variant="heroOutline" size="sm" asChild>
                  <Link to="/documents">
                    <FolderOpen className="h-4 w-4" />
                    View All
                  </Link>
                </Button>
              </div>

              {recentDocs.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent mb-3">
                    <Upload className="h-6 w-6" />
                  </div>
                  <p className="text-sm text-muted-foreground">No documents yet. Upload files from a client's page.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">
                        <th className="px-5 py-3">Document</th>
                        <th className="px-5 py-3">Client</th>
                        <th className="px-5 py-3">Date</th>
                        <th className="px-5 py-3 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {recentDocs.map((doc: any) => (
                        <tr
                          key={doc.id}
                          className="group hover:bg-muted/30 transition-colors cursor-pointer"
                          onClick={() => handleDownloadDoc(doc)}
                        >
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${
                                doc.file_type?.includes('pdf') ? 'bg-destructive/10 text-destructive' : 
                                doc.file_type?.includes('sheet') || doc.file_type?.includes('xlsx') ? 'bg-emerald-500/10 text-emerald-600' : 
                                'bg-accent/10 text-accent'
                              }`}>
                                <FileText className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{doc.file_name}</p>
                                <p className="text-[10px] text-muted-foreground">
                                  {doc.file_size_bytes ? (doc.file_size_bytes >= 1048576 ? `${(doc.file_size_bytes / 1048576).toFixed(1)} MB` : `${(doc.file_size_bytes / 1024).toFixed(1)} KB`) : '—'}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-sm text-muted-foreground">
                            {doc.clients?.first_name} {doc.clients?.last_name}
                          </td>
                          <td className="px-5 py-3 text-sm text-muted-foreground">
                            {new Date(doc.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </td>
                          <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleDownloadDoc(doc)}>
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteDoc(doc)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
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
            </div>

            {/* Recent Clients */}
            <div className="card-elevated p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Recent Clients</h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/clients">
                    View All
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
              <div className="space-y-3">
                {clientsWithTasks.slice(0, 5).map((client) => {
                  const displayName = client.client_type === 'business' && client.company_name
                    ? client.company_name
                    : `${client.first_name} ${client.last_name}`;
                  return (
                    <Link
                      key={client.id}
                      to={`/clients/${client.id}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {client.first_name?.[0]}{client.last_name?.[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{displayName}</p>
                          <p className="text-sm text-muted-foreground">{client.email}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        client.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'
                      }`}>
                        {client.status}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      <OnboardingTour organizationId={organization?.id} />
      <PlanWelcomeOverlay organizationId={organization?.id} planKey={planKey} />
    </DashboardLayout>
  );
}
