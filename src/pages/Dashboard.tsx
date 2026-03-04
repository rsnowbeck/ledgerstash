import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePageTitle } from "@/hooks/usePageTitle";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useOrganization } from "@/hooks/useOrganization";
import { OnboardingTour } from "@/components/onboarding/OnboardingTour";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { organization } = useOrganization(user);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalClients: 0,
    totalDocuments: 0,
    pendingTasks: 0,
    completedTasks: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [recentClients, setRecentClients] = useState<any[]>([]);
  const [recentTasks, setRecentTasks] = useState<any[]>([]);
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
        // Use company_name from signup metadata, fallback to profile name
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
      const { data: clients, count: clientsCount } = await supabase
        .from('clients')
        .select('*', { count: 'exact' })
        .eq('firm_id', fId)
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentClients(clients || []);

      const clientIds = (clients || []).map(c => c.id);

      const { count: docsCount } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .in('client_id', clientIds);

      // Fetch recent documents for the vault table
      if (clientIds.length > 0) {
        const { data: docs } = await supabase
          .from('documents')
          .select('*, clients!inner(first_name, last_name)')
          .in('client_id', clientIds)
          .order('created_at', { ascending: false })
          .limit(5);
        setRecentDocs(docs || []);
      }

      // Fetch tasks
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .in('client_id', clientIds)
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentTasks(tasks || []);

      const pending = (tasks || []).filter(t => t.status !== 'completed').length;
      const completed = (tasks || []).filter(t => t.status === 'completed').length;

      setStats({
        totalClients: clientsCount || 0,
        totalDocuments: docsCount || 0,
        pendingTasks: pending,
        completedTasks: completed,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
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
    { label: "Pending PBC", value: stats.pendingTasks.toString(), icon: Clock, clickAction: '/clients' },
    { label: "Completed", value: stats.completedTasks.toString(), icon: CheckCircle, clickAction: '/clients' },
  ];

  const pendingTasks = recentTasks.filter(t => t.status !== 'completed');
  const completedTasksList = recentTasks.filter(t => t.status === 'completed');

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
        /* Two-Column Layout: PBC Tasks + Document Vault */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: PBC Task List */}
          <div className="lg:col-span-4 space-y-6">
            <div className="card-elevated overflow-hidden">
              <div className="p-5 border-b border-border flex justify-between items-center bg-muted/30">
                <h2 className="font-bold text-foreground flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-accent" />
                  Action Required (PBC)
                </h2>
                <span className="bg-accent/10 text-accent text-xs font-bold px-2 py-1 rounded-full">
                  {pendingTasks.length} Pending
                </span>
              </div>
              <div className="p-4 space-y-3">
                {recentTasks.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">No PBC tasks yet. Create tasks from a client's page.</p>
                ) : (
                  recentTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                        task.status === 'completed' 
                        ? 'bg-success/5 border-success/20 opacity-75' 
                        : 'bg-card border-border hover:border-accent/30'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`text-sm font-bold ${task.status === 'completed' ? 'text-success line-through' : 'text-foreground'}`}>
                          {task.title}
                        </h3>
                        {task.status === 'completed' ? (
                          <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                        ) : (
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${task.priority === 'high' ? 'bg-destructive animate-pulse' : 'bg-warning'}`} />
                        )}
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <span>{task.due_date ? `Due: ${new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'No due date'}</span>
                        <span className={task.status === 'completed' ? 'text-success' : 'text-accent'}>
                          {task.status === 'completed' ? 'Done' : task.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Security Badge Card */}
            <div className="rounded-2xl p-6 text-primary-foreground shadow-lg relative overflow-hidden bg-primary">
              <Lock className="absolute -right-4 -bottom-4 w-24 h-24 text-primary-foreground/10 rotate-12" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-primary-foreground/20 p-1.5 rounded-lg">
                    <Lock className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-primary-foreground/70">AES-256 Encrypted</span>
                </div>
                <h3 className="text-lg font-bold mb-2">Your Private Vault</h3>
                <p className="text-sm text-primary-foreground/80 leading-relaxed">
                  All documents are encrypted at rest and in transit. Only you and your clients can access these files.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Document Vault + Recent Clients */}
          <div className="lg:col-span-8 space-y-6">
            {/* Document Vault Table */}
            <div className="card-elevated overflow-hidden">
              <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-bold text-foreground text-lg">Secure Document Vault</h2>
                  <p className="text-sm text-muted-foreground">Recent documents across all clients.</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="heroOutline" size="sm" asChild>
                    <Link to="/documents">
                      <FolderOpen className="h-4 w-4" />
                      View All
                    </Link>
                  </Button>
                </div>
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
                        <th className="px-5 py-3">Document Name</th>
                        <th className="px-5 py-3">Date Added</th>
                        <th className="px-5 py-3">Size</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {recentDocs.map((doc: any) => (
                        <tr key={doc.id} className="group hover:bg-muted/30 transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${
                                doc.file_type?.includes('pdf') ? 'bg-destructive/10 text-destructive' : 
                                doc.file_type?.includes('sheet') || doc.file_type?.includes('xlsx') ? 'bg-success/10 text-success' : 
                                'bg-accent/10 text-accent'
                              }`}>
                                <FileText className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">{doc.file_name}</p>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">{doc.file_type || 'File'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-sm text-muted-foreground">{new Date(doc.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                          <td className="px-5 py-3 text-sm text-muted-foreground">{doc.file_size_bytes ? (doc.file_size_bytes >= 1048576 ? `${(doc.file_size_bytes / 1048576).toFixed(1)} MB` : `${(doc.file_size_bytes / 1024).toFixed(1)} KB`) : '—'}</td>
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
                {recentClients.map((client) => (
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
                        <p className="font-medium text-foreground">{client.first_name} {client.last_name}</p>
                        <p className="text-sm text-muted-foreground">{client.email}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      client.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                    }`}>
                      {client.status}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <OnboardingTour organizationId={organization?.id} />
    </DashboardLayout>
  );
}
