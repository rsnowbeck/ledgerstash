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
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { CheckCircle2, Clock, XCircle, TrendingUp, Activity, FileText } from "lucide-react";
import { format, subDays, startOfDay, eachDayOfInterval } from "date-fns";

interface SignatureMetricsProps {
  organizationId: string;
  timeRangeDays?: number | null;
}

interface MetricsData {
  pending: number;
  completed: number;
  expired: number;
  total: number;
}

interface TrendData {
  date: string;
  completed: number;
  sent: number;
}

interface RequirementStats {
  title: string;
  completed: number;
  total: number;
  rate: number;
}

interface RecentActivity {
  id: string;
  type: "completed" | "sent";
  recipientName: string;
  requirementTitle: string;
  timestamp: string;
}

export function SignatureMetrics({ organizationId, timeRangeDays = 14 }: SignatureMetricsProps) {
  const [metrics, setMetrics] = useState<MetricsData>({
    pending: 0,
    completed: 0,
    expired: 0,
    total: 0,
  });
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [requirementStats, setRequirementStats] = useState<RequirementStats[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const effectiveDays = timeRangeDays ?? 14;

  useEffect(() => {
    fetchAllData();
  }, [organizationId, timeRangeDays]);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchMetrics(),
      fetchTrendData(),
      fetchRequirementStats(),
      fetchRecentActivity(),
    ]);
    setLoading(false);
  };

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
    }
  };

  const fetchTrendData = async () => {
    try {
      const endDate = new Date();
      const startDate = subDays(endDate, effectiveDays - 1);

      const { data, error } = await supabase
        .from("signing_requests")
        .select("sent_at, completed_at, status")
        .eq("organization_id", organizationId)
        .gte("sent_at", startDate.toISOString());

      if (error) throw error;

      // Create date range
      const days = eachDayOfInterval({ start: startDate, end: endDate });
      
      const trend: TrendData[] = days.map((day) => {
        const dayStart = startOfDay(day);
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);

        const sent = (data || []).filter((req) => {
          if (!req.sent_at) return false;
          const sentDate = new Date(req.sent_at);
          return sentDate >= dayStart && sentDate < dayEnd;
        }).length;

        const completed = (data || []).filter((req) => {
          if (!req.completed_at) return false;
          const completedDate = new Date(req.completed_at);
          return completedDate >= dayStart && completedDate < dayEnd;
        }).length;

        return {
          date: format(day, "MMM d"),
          sent,
          completed,
        };
      });

      setTrendData(trend);
    } catch (error) {
      console.error("Error fetching trend data:", error);
    }
  };

  const fetchRequirementStats = async () => {
    try {
      const { data, error } = await supabase
        .from("signing_requests")
        .select(`
          status,
          requirement:requirements(id, title)
        `)
        .eq("organization_id", organizationId);

      if (error) throw error;

      // Group by requirement
      const reqMap = new Map<string, { title: string; completed: number; total: number }>();

      (data || []).forEach((req: any) => {
        const reqId = req.requirement?.id;
        const title = req.requirement?.title;
        if (!reqId || !title) return;

        if (!reqMap.has(reqId)) {
          reqMap.set(reqId, { title, completed: 0, total: 0 });
        }
        const stats = reqMap.get(reqId)!;
        stats.total++;
        if (req.status === "completed") {
          stats.completed++;
        }
      });

      const sorted = Array.from(reqMap.values())
        .map((s) => ({
          title: s.title.length > 20 ? s.title.substring(0, 20) + "..." : s.title,
          completed: s.completed,
          total: s.total,
          rate: Math.round((s.completed / s.total) * 100),
        }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);

      setRequirementStats(sorted);
    } catch (error) {
      console.error("Error fetching requirement stats:", error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const { data, error } = await supabase
        .from("signing_requests")
        .select(`
          id,
          status,
          sent_at,
          completed_at,
          recipient:recipients(full_name),
          requirement:requirements(title)
        `)
        .eq("organization_id", organizationId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      const activities: RecentActivity[] = [];

      (data || []).forEach((req: any) => {
        if (req.completed_at) {
          activities.push({
            id: `${req.id}-completed`,
            type: "completed",
            recipientName: req.recipient?.full_name || "Unknown",
            requirementTitle: req.requirement?.title || "Unknown",
            timestamp: req.completed_at,
          });
        }
        if (req.sent_at) {
          activities.push({
            id: `${req.id}-sent`,
            type: "sent",
            recipientName: req.recipient?.full_name || "Unknown",
            requirementTitle: req.requirement?.title || "Unknown",
            timestamp: req.sent_at,
          });
        }
      });

      // Sort by timestamp and take top 5
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setRecentActivity(activities.slice(0, 5));
    } catch (error) {
      console.error("Error fetching recent activity:", error);
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

  const hasTrendData = trendData.some((d) => d.sent > 0 || d.completed > 0);

  return (
    <div className="space-y-6 mb-8">
      {/* Row 1: Completion Rate + Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

      {/* Row 2: Trend Chart + Requirement Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 14-Day Trend Chart */}
        {hasTrendData && (
          <div className="card-elevated p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{effectiveDays}-Day Activity</h3>
                <p className="text-sm text-muted-foreground">Signatures sent vs completed</p>
              </div>
            </div>

            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(173, 58%, 39%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(173, 58%, 39%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sent"
                    stroke="hsl(38, 92%, 50%)"
                    fillOpacity={1}
                    fill="url(#colorSent)"
                    name="Sent"
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stroke="hsl(173, 58%, 39%)"
                    fillOpacity={1}
                    fill="url(#colorCompleted)"
                    name="Completed"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Top Requirements by Volume */}
        {requirementStats.length > 0 && (
          <div className="card-elevated p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Top Requirements</h3>
                <p className="text-sm text-muted-foreground">By signature volume</p>
              </div>
            </div>

            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={requirementStats}
                  layout="vertical"
                  margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis 
                    type="number"
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="title"
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={false}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number, name: string) => [value, name === "completed" ? "Completed" : "Total"]}
                  />
                  <Bar dataKey="total" fill="hsl(var(--muted))" name="Total" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="completed" fill="hsl(173, 58%, 39%)" name="Completed" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Recent Activity Feed (show if no trend data) */}
        {!hasTrendData && recentActivity.length > 0 && (
          <div className="card-elevated p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Recent Activity</h3>
                <p className="text-sm text-muted-foreground">Latest signature events</p>
              </div>
            </div>

            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 py-2">
                  <div className={`mt-0.5 h-6 w-6 rounded-full flex items-center justify-center ${
                    activity.type === "completed" ? "bg-accent/10" : "bg-warning/10"
                  }`}>
                    {activity.type === "completed" ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                    ) : (
                      <Clock className="h-3.5 w-3.5 text-warning" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{activity.recipientName}</span>
                      {" "}
                      {activity.type === "completed" ? "signed" : "was sent"}
                      {" "}
                      <span className="text-muted-foreground">{activity.requirementTitle}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(activity.timestamp), "MMM d, h:mm a")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Row 3: Recent Activity (when we have trend data) */}
      {hasTrendData && recentActivity.length > 0 && (
        <div className="card-elevated p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Recent Activity</h3>
              <p className="text-sm text-muted-foreground">Latest signature events</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <div className={`mt-0.5 h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${
                  activity.type === "completed" ? "bg-accent/10" : "bg-warning/10"
                }`}>
                  {activity.type === "completed" ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                  ) : (
                    <Clock className="h-3.5 w-3.5 text-warning" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {activity.recipientName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {activity.type === "completed" ? "Signed" : "Sent"}: {activity.requirementTitle}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(activity.timestamp), "MMM d")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
