import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { CheckCircle2, Clock, XCircle, TrendingUp } from "lucide-react";

interface SignatureMetricsProps {
  organizationId: string;
}

interface MetricsData {
  pending: number;
  completed: number;
  expired: number;
  total: number;
}

export function SignatureMetrics({ organizationId }: SignatureMetricsProps) {
  const [metrics, setMetrics] = useState<MetricsData>({
    pending: 0,
    completed: 0,
    expired: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, [organizationId]);

  const fetchMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from("signing_requests")
        .select("status, expires_at")
        .eq("organization_id", organizationId);

      if (error) throw error;

      const now = new Date();
      let pending = 0;
      let completed = 0;
      let expired = 0;

      (data || []).forEach((req) => {
        if (req.status === "completed") {
          completed++;
        } else if (req.expires_at && new Date(req.expires_at) < now) {
          expired++;
        } else {
          pending++;
        }
      });

      setMetrics({
        pending,
        completed,
        expired,
        total: pending + completed + expired,
      });
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card-elevated p-6">
        <div className="animate-pulse text-muted-foreground text-center py-8">
          Loading metrics...
        </div>
      </div>
    );
  }

  if (metrics.total === 0) {
    return null;
  }

  const completionRate = Math.round((metrics.completed / metrics.total) * 100);

  const chartData = [
    { name: "Completed", value: metrics.completed, color: "hsl(173, 58%, 39%)" },
    { name: "Pending", value: metrics.pending, color: "hsl(38, 92%, 50%)" },
    { name: "Expired", value: metrics.expired, color: "hsl(0, 72%, 51%)" },
  ].filter((item) => item.value > 0);

  const statusCards = [
    {
      label: "Completed",
      value: metrics.completed,
      icon: CheckCircle2,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      label: "Pending",
      value: metrics.pending,
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      label: "Expired",
      value: metrics.expired,
      icon: XCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Completion Rate Card */}
      <div className="card-elevated p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Completion Rate</h3>
            <p className="text-sm text-muted-foreground">Overall signature progress</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <span className="text-4xl font-bold text-foreground">{completionRate}%</span>
            <span className="text-sm text-muted-foreground">
              {metrics.completed} of {metrics.total} signed
            </span>
          </div>
          <Progress value={completionRate} className="h-3" />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
          {statusCards.map((status) => (
            <div key={status.label} className="text-center">
              <div className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${status.bgColor} mb-2`}>
                <status.icon className={`h-4 w-4 ${status.color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">{status.value}</p>
              <p className="text-xs text-muted-foreground">{status.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pie Chart Card */}
      <div className="card-elevated p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Status Breakdown</h3>
            <p className="text-sm text-muted-foreground">Signature request distribution</p>
          </div>
        </div>

        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "var(--shadow-md)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span className="text-sm text-muted-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
