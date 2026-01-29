import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  FileText, 
  BarChart3, 
  Plus,
  Clock,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useOrganization } from "@/hooks/useOrganization";

export default function Dashboard() {
  const { loading: authLoading } = useAuth();
  const { organization, loading: orgLoading } = useOrganization();
  const [stats, setStats] = useState({
    totalRecipients: 0,
    activeRequirements: 0,
    pendingSignatures: 0,
    complianceRate: null as number | null,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (organization?.id) {
      fetchStats();
    }
  }, [organization?.id]);

  const fetchStats = async () => {
    if (!organization?.id) return;
    
    try {
      // Fetch recipients count
      const { count: recipientsCount } = await supabase
        .from('recipients')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', organization.id)
        .eq('is_deleted', false);

      // Fetch requirements count (published only)
      const { count: requirementsCount } = await supabase
        .from('requirements')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', organization.id)
        .eq('status', 'published');

      // Fetch pending signing requests
      const { count: pendingCount } = await supabase
        .from('signing_requests')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', organization.id)
        .eq('status', 'pending');

      // Fetch completed signing requests for compliance rate
      const { count: completedCount } = await supabase
        .from('signing_requests')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', organization.id)
        .eq('status', 'completed');

      const totalRequests = (pendingCount || 0) + (completedCount || 0);
      const complianceRate = totalRequests > 0 
        ? Math.round((completedCount || 0) / totalRequests * 100) 
        : null;

      setStats({
        totalRecipients: recipientsCount || 0,
        activeRequirements: requirementsCount || 0,
        pendingSignatures: pendingCount || 0,
        complianceRate,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  if (authLoading || orgLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const statCards = [
    { 
      label: "Total Recipients", 
      value: stats.totalRecipients.toString(), 
      icon: Users, 
      change: stats.totalRecipients === 0 ? "Add your first" : `${stats.totalRecipients} people` 
    },
    { 
      label: "Active Requirements", 
      value: stats.activeRequirements.toString(), 
      icon: FileText, 
      change: stats.activeRequirements === 0 ? "Create one" : `${stats.activeRequirements} published` 
    },
    { 
      label: "Pending Signatures", 
      value: stats.pendingSignatures.toString(), 
      icon: Clock, 
      change: stats.pendingSignatures === 0 ? "—" : "Awaiting response" 
    },
    { 
      label: "Compliance Rate", 
      value: stats.complianceRate !== null ? `${stats.complianceRate}%` : "—", 
      icon: BarChart3, 
      change: stats.complianceRate !== null ? "Overall completion" : "No data yet" 
    },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back{organization?.name ? ` to ${organization.name}` : ''}! Here's an overview of your compliance status.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="heroOutline" asChild>
            <Link to="/recipients">
              <Plus className="h-4 w-4" />
              Add Recipient
            </Link>
          </Button>
          <Button variant="hero" asChild>
            <Link to="/requirements">
              <Plus className="h-4 w-4" />
              New Requirement
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-accent" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-xs text-muted-foreground mt-2">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Empty State or Recent Activity */}
      {stats.totalRecipients === 0 && stats.activeRequirements === 0 ? (
        <>
          <div className="card-elevated p-12 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent mb-6">
              <FileText className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Get started with Attestly
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Create your first compliance requirement and start collecting 
              acknowledgments from your team.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="heroOutline" asChild>
                <Link to="/recipients">
                  <Users className="h-4 w-4" />
                  Add Recipients
                </Link>
              </Button>
              <Button variant="hero" asChild>
                <Link to="/requirements">
                  <FileText className="h-4 w-4" />
                  Create Requirement
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold text-foreground">Add recipients</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Add your employees, contractors, or vendors who need to acknowledge policies.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold text-foreground">Create requirements</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Define what needs to be acknowledged—policies, NDAs, training, and more.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold text-foreground">Send & track</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Publish to send signing links, then track completion in real-time.
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="card-elevated p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/recipients" className="p-4 rounded-lg border border-border hover:border-accent/50 hover:bg-accent/5 transition-colors">
              <Users className="h-6 w-6 text-accent mb-2" />
              <h3 className="font-medium text-foreground">Manage Recipients</h3>
              <p className="text-sm text-muted-foreground">{stats.totalRecipients} total</p>
            </Link>
            <Link to="/requirements" className="p-4 rounded-lg border border-border hover:border-accent/50 hover:bg-accent/5 transition-colors">
              <FileText className="h-6 w-6 text-accent mb-2" />
              <h3 className="font-medium text-foreground">View Requirements</h3>
              <p className="text-sm text-muted-foreground">{stats.activeRequirements} active</p>
            </Link>
            <div className="p-4 rounded-lg border border-border">
              <BarChart3 className="h-6 w-6 text-accent mb-2" />
              <h3 className="font-medium text-foreground">Compliance Overview</h3>
              <p className="text-sm text-muted-foreground">
                {stats.complianceRate !== null ? `${stats.complianceRate}% complete` : 'No requests yet'}
              </p>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
