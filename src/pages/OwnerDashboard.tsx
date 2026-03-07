import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Loader2, Users, FileSignature, CreditCard, Clock, TrendingUp, Mail } from "lucide-react";
import { format } from "date-fns";

interface Metrics {
  totalOrgs: number;
  activeTrials: number;
  expiredTrials: number;
  paidUsers: number;
  totalDocumentRequests: number;
  documentsSubmitted: number;
  documentsPending: number;
  recentOrgs: { id: string; name: string; plan: string | null; created_at: string; trial_ends_at: string | null }[];
}

export default function OwnerDashboard() {
  usePageTitle("Owner Dashboard");
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const [orgsRes, sigReqRes] = await Promise.all([
        supabase.from("organizations").select("id, name, plan, created_at, trial_ends_at"),
        supabase.from("signing_requests").select("id, status"),
      ]);

      const orgs = orgsRes.data || [];
      const sigReqs = sigReqRes.data || [];
      const now = new Date();

      setMetrics({
        totalOrgs: orgs.length,
        activeTrials: orgs.filter((o) => o.plan === "trial" && o.trial_ends_at && new Date(o.trial_ends_at) > now).length,
        expiredTrials: orgs.filter((o) => o.plan === "trial" && o.trial_ends_at && new Date(o.trial_ends_at) <= now).length,
        paidUsers: orgs.filter((o) => o.plan && o.plan !== "trial").length,
        totalDocumentRequests: sigReqs.length,
        documentsSubmitted: sigReqs.filter((s) => s.status === "completed").length,
        documentsPending: sigReqs.filter((s) => s.status === "pending").length,
        recentOrgs: orgs
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 10),
      });
    } catch (error) {
      console.error("Error fetching owner metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (!metrics) return null;

  const cards = [
    { label: "Total Organizations", value: metrics.totalOrgs, icon: Users, color: "text-primary" },
    { label: "Active Trials", value: metrics.activeTrials, icon: Clock, color: "text-warning" },
    { label: "Expired Trials", value: metrics.expiredTrials, icon: Clock, color: "text-destructive" },
    { label: "Paid Users", value: metrics.paidUsers, icon: CreditCard, color: "text-success" },
    { label: "Total Document Requests", value: metrics.totalSigningRequests, icon: FileSignature, color: "text-accent" },
    { label: "Documents Submitted", value: metrics.completedSignatures, icon: TrendingUp, color: "text-success" },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Owner Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Business metrics — only visible to you
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="card-elevated p-5 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{card.label}</span>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <p className="text-3xl font-bold text-foreground">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Organizations */}
      <div className="card-elevated p-6 rounded-xl">
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Signups</h2>
        {metrics.recentOrgs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No organizations yet.</p>
        ) : (
          <div className="space-y-3">
            {metrics.recentOrgs.map((org) => (
              <div key={org.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{org.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(org.created_at), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    org.plan === "trial"
                      ? org.trial_ends_at && new Date(org.trial_ends_at) > new Date()
                        ? "bg-warning/10 text-warning"
                        : "bg-destructive/10 text-destructive"
                      : "bg-success/10 text-success"
                  }`}>
                    {org.plan === "trial"
                      ? org.trial_ends_at && new Date(org.trial_ends_at) > new Date()
                        ? "Trial"
                        : "Expired"
                      : org.plan || "Unknown"}
                  </span>
                  {org.trial_ends_at && org.plan === "trial" && (
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {new Date(org.trial_ends_at) > new Date() ? "Expires" : "Expired"}{" "}
                      {format(new Date(org.trial_ends_at), "MMM d")}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
