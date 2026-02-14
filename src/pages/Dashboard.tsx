import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  FileText, 
  BarChart3, 
  Plus,
  Clock,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useOrganization } from "@/hooks/useOrganization";
import { SignatureMetrics } from "@/components/dashboard/SignatureMetrics";
import { DashboardRequirementsTable } from "@/components/dashboard/DashboardRequirementsTable";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { OnboardingTour } from "@/components/onboarding/OnboardingTour";
import { subDays } from "date-fns";

type TimeRange = "7" | "30" | "all";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { organization, loading: orgLoading } = useOrganization(user);
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<TimeRange>("30");
  const [stats, setStats] = useState({
    totalRecipients: 0,
    totalRequirements: 0, // All requirements (draft + published)
    activeRequirements: 0, // Published only
    pendingSignatures: 0,
    overdueSignatures: 0,
    complianceRate: null as number | null,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (organization?.id) {
      fetchStats();
    }
  }, [organization?.id, timeRange]);

  const getDateFilter = () => {
    if (timeRange === "all") return null;
    return subDays(new Date(), parseInt(timeRange)).toISOString();
  };

  const fetchStats = async () => {
    if (!organization?.id) return;
    
    try {
      const dateFilter = getDateFilter();

      // Fetch recipients count
      const { count: recipientsCount } = await supabase
        .from('recipients')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', organization.id)
        .eq('is_deleted', false);

      // Fetch all requirements count (for determining onboarding vs operating mode)
      const { count: totalRequirementsCount } = await supabase
        .from('requirements')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', organization.id);

      // Fetch published requirements count (for stats display)
      const { count: publishedRequirementsCount } = await supabase
        .from('requirements')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', organization.id)
        .eq('status', 'published');

      // Fetch signing requests with date filter
      let signingQuery = supabase
        .from('signing_requests')
        .select('status, expires_at, created_at')
        .eq('organization_id', organization.id);

      if (dateFilter) {
        signingQuery = signingQuery.gte('created_at', dateFilter);
      }

      const { data: signingRequests } = await signingQuery;

      const now = new Date();
      let pending = 0;
      let completed = 0;
      let overdue = 0;

      (signingRequests || []).forEach((req) => {
        if (req.status === 'completed') {
          completed++;
        } else if (req.status === 'pending') {
          if (req.expires_at && new Date(req.expires_at) < now) {
            overdue++;
          } else {
            pending++;
          }
        }
      });

      const totalRequests = pending + completed + overdue;
      const complianceRate = totalRequests > 0 
        ? Math.round(completed / totalRequests * 100) 
        : null;

      setStats({
        totalRecipients: recipientsCount || 0,
        totalRequirements: totalRequirementsCount || 0,
        activeRequirements: publishedRequirementsCount || 0,
        pendingSignatures: pending,
        overdueSignatures: overdue,
        complianceRate,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Show loading while auth is being determined, or redirect is happening
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

  // If no user after auth loaded, the useAuth hook will redirect to login
  // Show nothing while redirect is happening
  if (!user) {
    return null;
  }

  if (orgLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          {/* Header skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-40 rounded-lg" />
              <Skeleton className="h-10 w-36" />
            </div>
          </div>

          {/* Stats skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="stat-card">
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                </div>
                <Skeleton className="h-8 w-12 mb-1" />
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>

          {/* Chart skeleton */}
          <div className="card-elevated p-6">
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Determine next action based on state
  const getNextAction = () => {
    if (stats.totalRecipients === 0) {
      return {
        title: "Add your first recipient",
        description: "Start by adding people who need to sign your requirements",
        action: "/recipients",
        buttonText: "Add Recipients",
        icon: Users,
      };
    }
    if (stats.totalRequirements === 0) {
      return {
        title: "Create a requirement",
        description: "Define what needs to be acknowledged—policies, NDAs, training",
        action: "/requirements",
        buttonText: "Create Requirement",
        icon: FileText,
      };
    }
    if (stats.activeRequirements === 0 && stats.totalRequirements > 0) {
      return {
        title: "Publish your requirement",
        description: "Your requirement is ready—publish it to start collecting signatures",
        action: "/requirements",
        buttonText: "View Requirements",
        icon: Sparkles,
      };
    }
    if (stats.overdueSignatures > 0) {
      return {
        title: `${stats.overdueSignatures} overdue completion${stats.overdueSignatures !== 1 ? 's' : ''}`,
        description: "Send reminders to recipients who haven't responded",
        action: "/signatures?status=overdue",
        buttonText: "View Overdue",
        icon: AlertTriangle,
        variant: "warning" as const,
      };
    }
    if (stats.pendingSignatures > 0) {
      return {
        title: `${stats.pendingSignatures} pending completion${stats.pendingSignatures !== 1 ? 's' : ''}`,
        description: "Track progress and send reminders as needed",
        action: "/signatures?status=pending",
        buttonText: "View Pending",
        icon: Clock,
      };
    }
    return null;
  };

  const nextAction = getNextAction();

  const handleStatClick = (type: string) => {
    switch (type) {
      case 'recipients':
        navigate('/recipients');
        break;
      case 'requirements':
        navigate('/requirements');
        break;
      case 'pending':
        navigate('/signatures?status=pending');
        break;
      case 'overdue':
        navigate('/signatures?status=overdue');
        break;
      case 'compliance':
        navigate('/signatures');
        break;
    }
  };

  const statCards = [
    { 
      label: "Total Recipients", 
      value: stats.totalRecipients.toString(), 
      icon: Users, 
      change: stats.totalRecipients === 0 ? "Add your first" : `${stats.totalRecipients} people`,
      clickAction: 'recipients',
    },
    { 
      label: "Active Requirements", 
      value: stats.activeRequirements.toString(), 
      icon: FileText, 
      change: stats.activeRequirements === 0 ? "Create one" : `${stats.activeRequirements} published`,
      clickAction: 'requirements',
    },
    { 
      label: "Pending Completions", 
      value: stats.pendingSignatures.toString(), 
      icon: Clock, 
      change: stats.overdueSignatures > 0 
        ? `${stats.overdueSignatures} overdue` 
        : stats.pendingSignatures === 0 ? "All caught up!" : "Awaiting response",
      clickAction: 'pending',
      highlight: stats.overdueSignatures > 0 ? 'warning' : undefined,
    },
    { 
      label: "Compliance Rate", 
      value: stats.complianceRate !== null ? `${stats.complianceRate}%` : "—", 
      icon: BarChart3, 
      change: stats.complianceRate !== null ? "Overall compliance completion" : "No data yet",
      clickAction: 'compliance',
    },
  ];

  return (
    <DashboardLayout>
      {/* Header with Time Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back{organization?.name ? ` to ${organization.name}` : ''}! Here's an overview of your compliance status.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ToggleGroup 
            type="single" 
            value={timeRange} 
            onValueChange={(value) => value && setTimeRange(value as TimeRange)}
            className="bg-muted rounded-lg p-1"
          >
            <ToggleGroupItem value="7" className="text-xs px-3 data-[state=on]:bg-background data-[state=on]:shadow-sm">
              7 days
            </ToggleGroupItem>
            <ToggleGroupItem value="30" className="text-xs px-3 data-[state=on]:bg-background data-[state=on]:shadow-sm">
              30 days
            </ToggleGroupItem>
            <ToggleGroupItem value="all" className="text-xs px-3 data-[state=on]:bg-background data-[state=on]:shadow-sm">
              All time
            </ToggleGroupItem>
          </ToggleGroup>
          <Button variant="hero" asChild>
            <Link to="/requirements">
              <Plus className="h-4 w-4" />
              New Requirement
            </Link>
          </Button>
        </div>
      </div>

      {/* Next Action Banner */}
      {nextAction && (
        <div className={`mb-6 p-4 rounded-xl border ${
          nextAction.variant === 'warning' 
            ? 'bg-warning/5 border-warning/20' 
            : 'bg-accent/5 border-accent/20'
        }`}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                nextAction.variant === 'warning' ? 'bg-warning/10' : 'bg-accent/10'
              }`}>
                <nextAction.icon className={`h-5 w-5 ${
                  nextAction.variant === 'warning' ? 'text-warning' : 'text-accent'
                }`} />
              </div>
              <div>
                <p className="font-medium text-foreground">{nextAction.title}</p>
                <p className="text-sm text-muted-foreground">{nextAction.description}</p>
              </div>
            </div>
            <Button variant={nextAction.variant === 'warning' ? 'outline' : 'hero'} size="sm" asChild>
              <Link to={nextAction.action}>
                {nextAction.buttonText}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Stats Grid - Clickable */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <button
            key={stat.label}
            onClick={() => handleStatClick(stat.clickAction)}
            className={`stat-card text-left transition-all hover:shadow-md hover:border-accent/30 group ${
              stat.highlight === 'warning' ? 'border-warning/30 bg-warning/5' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                stat.highlight === 'warning' ? 'bg-warning/10' : 'bg-accent/10'
              }`}>
                <stat.icon className={`h-5 w-5 ${
                  stat.highlight === 'warning' ? 'text-warning' : 'text-accent'
                }`} />
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className={`text-xs mt-2 ${
              stat.highlight === 'warning' ? 'text-warning' : 'text-muted-foreground'
            }`}>
              {stat.change}
            </p>
          </button>
        ))}
      </div>

      {/* Signature Metrics Charts */}
      {organization?.id && (
        <SignatureMetrics organizationId={organization.id} timeRangeDays={timeRange === 'all' ? null : parseInt(timeRange)} />
      )}

      {/* Empty State (Onboarding Mode) or Requirements Table (Operating Mode) */}
      {stats.totalRequirements === 0 ? (
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
              <Button variant="hero" asChild>
                <Link to="/requirements">
                  <FileText className="h-4 w-4" />
                  Create Requirement
                </Link>
              </Button>
              <Button variant="heroOutline" asChild>
                <Link to="/recipients">
                  <Users className="h-4 w-4" />
                  Add Recipients
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
        /* Operating Mode: Requirements Table */
        organization?.id && <DashboardRequirementsTable organizationId={organization.id} />
      )}

      {/* Onboarding Tour */}
      <OnboardingTour organizationId={organization?.id} />
    </DashboardLayout>
  );
}
