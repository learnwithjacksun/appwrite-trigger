import { Activity, Clock3, Gauge, Server } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Loader } from "@/components/ui/Loader";
import { useDashboardStats, useHealth } from "@/hooks/useStats";
import { cn, formatDate, formatRelative } from "@/lib/utils";
import { formatNumber } from "@/helpers/formatNumber";

export default function DashboardPage() {
  const stats = useDashboardStats();
  const health = useHealth();

  if (stats.isLoading) {
    return <Loader label="Loading dashboard" className="py-16" />;
  }

  if (stats.isError || !stats.data) {
    return (
      <p className="text-sm text-red-500">
        Unable to load dashboard statistics.
      </p>
    );
  }

  const s = stats.data;

  const metricCards = [
    {
      label: "Projects",
      value: s.totalProjects.toString(),
      hint: `${s.activeProjects} active · ${s.failedProjects} failed`,
      icon: Server,
      iconColor: "text-primary bg-primary/10",
    },
    {
      label: "Auto ping",
      value: s.autoPingEnabledCount.toString(),
      hint: "Projects with schedules on",
      icon: Activity,
      iconColor: "text-green-500 bg-green-500/10",
    },
    {
      label: "24h pings",
      value: s.pingsLast24h.toString(),
      hint: `${s.successfulPingsLast24h} succeeded`,
      icon: Clock3,
      iconColor: "text-blue-500 bg-blue-500/10",
    },
    {
      label: "Avg response",
      value: `${formatNumber(s.avgResponseTimeMs)} ms`,
      hint: `Success rate ${formatNumber(s.successRateLast24h)}%`,
      icon: Gauge,
      iconColor: "text-yellow-500 bg-yellow-500/10",
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-main">Overview</h1>
        <p className="text-xs text-muted">
          Activity snapshot for your workspace.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map(({ label, value, hint, icon: Icon, iconColor }) => (
          <Card key={label} className="bg-background/60">
            <CardHeader className="space-y-0 pb-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-xs font-medium text-muted">
                  {label}
                </CardTitle>
                <Icon className={cn("h-6 w-6 shrink-0 rounded-lg p-1", iconColor)} aria-hidden />
              </div>
            </CardHeader>
            <CardContent className="space-y-1 pt-0">
              <p className="text-2xl font-semibold text-main">{value}</p>
              <p className="text-[11px] text-muted">{hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pulse</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted">
            <div className="flex items-center justify-between gap-3">
              <span>Last ping</span>
              <span className="text-main">{formatRelative(s.lastPinged)}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Exact timestamp</span>
              <span className="text-main">{formatDate(s.lastPinged)}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>API health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted">
            {health.isLoading ? (
              <Loader label="Checking health" />
            ) : health.isError ? (
              <span className="text-red-500">Health check failed.</span>
            ) : (
              <>
                <div className="flex items-center justify-between gap-3">
                  <span>Database</span>
                  <span className="text-main">
                    {health.data?.database ?? "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Uptime</span>
                  <span className="text-main">
                    {health.data ? `${Math.floor(health.data.uptime)}s` : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Timestamp</span>
                  <span className="text-main">
                    {health.data ? formatDate(health.data.timestamp) : "—"}
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
