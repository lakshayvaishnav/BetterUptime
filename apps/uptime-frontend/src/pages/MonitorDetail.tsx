import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { monitorApi, resultsApi, type CheckResult } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Trash2,
  Clock,
  Globe,
  Activity,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { useMemo, useState } from "react";

const MonitorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [cleanupDays, setCleanupDays] = useState(90);

  const { data: monitor, isLoading: monitorLoading } = useQuery({
    queryKey: ["monitor", id],
    queryFn: async () => {
      const res = await monitorApi.getOne(id!);
      return res.data.result;
    },
    enabled: !!id,
  });

  const { data: resultsData, isLoading: resultsLoading } = useQuery({
    queryKey: ["results", id],
    queryFn: async () => {
      const res = await resultsApi.getAll(id!);
      return res.data.results;
    },
    enabled: !!id,
  });

  const { data: latestResult } = useQuery({
    queryKey: ["latest-result", id],
    queryFn: async () => {
      const res = await resultsApi.getLatest(id!);
      return res.data.result;
    },
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => monitorApi.delete(id!),
    onSuccess: () => {
      toast.success("Monitor deleted");
      navigate("/dashboard");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const cleanupMutation = useMutation({
    mutationFn: () => resultsApi.cleanup(id!, cleanupDays),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["results", id] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const results = resultsData || [];

  // Charts data
  const responseTimeData = useMemo(() => {
    return results
      .filter((r) => r.responseTimeMs != null)
      .map((r) => ({
        time: new Date(r.checkedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        ms: r.responseTimeMs,
        location: r.Location,
      }))
      .reverse();
  }, [results]);

  const uptimeData = useMemo(() => {
    return results
      .map((r) => ({
        time: new Date(r.checkedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: r.status === "Up" ? 1 : 0,
        location: r.Location,
      }))
      .reverse();
  }, [results]);

  const usaResults = useMemo(() => results.filter((r) => r.Location === "USA"), [results]);
  const indiaResults = useMemo(() => results.filter((r) => r.Location === "INDIA"), [results]);

  const regionStats = (regionResults: CheckResult[]) => {
    const up = regionResults.filter((r) => r.status === "Up").length;
    const total = regionResults.length;
    const avgMs =
      regionResults.filter((r) => r.responseTimeMs).reduce((a, r) => a + (r.responseTimeMs || 0), 0) /
        (regionResults.filter((r) => r.responseTimeMs).length || 1);
    return { upPercent: total ? ((up / total) * 100).toFixed(1) : "0", avgMs: Math.round(avgMs), total };
  };

  const usaStats = regionStats(usaResults);
  const indiaStats = regionStats(indiaResults);

  const isLoading = monitorLoading || resultsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold tracking-tight truncate max-w-md">
                {monitor?.url}
              </h1>
              <p className="text-xs text-muted-foreground">
                Created {monitor?.createdAt ? new Date(monitor.createdAt).toLocaleDateString() : "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => cleanupMutation.mutate()}
              disabled={cleanupMutation.isPending}
            >
              <RefreshCw className="h-3 w-3" />
              Cleanup ({cleanupDays}d)
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="h-3 w-3" />
              Delete
            </Button>
          </div>
        </div>

        {/* Latest result */}
        {latestResult && (
          <Card className="mb-6">
            <CardContent className="flex items-center gap-4 p-4">
              <div
                className={`h-3 w-3 rounded-full ${
                  latestResult.status === "Up" ? "bg-success animate-pulse-dot" : "bg-destructive"
                }`}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant={latestResult.status === "Up" ? "default" : "destructive"}>
                    {latestResult.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    <Globe className="inline h-3 w-3 mr-0.5" />
                    {latestResult.Location}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    <Clock className="inline h-3 w-3 mr-0.5" />
                    {latestResult.responseTimeMs ? `${latestResult.responseTimeMs}ms` : "—"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Last checked: {new Date(latestResult.checkedAt).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Region breakdown */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          {[
            { label: "USA", stats: usaStats, flag: "🇺🇸" },
            { label: "India", stats: indiaStats, flag: "🇮🇳" },
          ].map((region) => (
            <Card key={region.label}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <span>{region.flag}</span> {region.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Uptime</span>
                  <span className="font-mono text-success">{region.stats.upPercent}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Avg Response</span>
                  <span className="font-mono">{region.stats.avgMs}ms</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Checks</span>
                  <span className="font-mono">{region.stats.total}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Response time chart */}
        {responseTimeData.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Response Time (ms)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 15%)" />
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 10, fill: "hsl(0 0% 55%)" }}
                      axisLine={{ stroke: "hsl(0 0% 15%)" }}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "hsl(0 0% 55%)" }}
                      axisLine={{ stroke: "hsl(0 0% 15%)" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(0 0% 4%)",
                        border: "1px solid hsl(0 0% 15%)",
                        borderRadius: "6px",
                        fontSize: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="ms"
                      stroke="hsl(212 100% 48%)"
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Uptime timeline */}
        {uptimeData.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Uptime Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={uptimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 15%)" />
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 10, fill: "hsl(0 0% 55%)" }}
                      axisLine={{ stroke: "hsl(0 0% 15%)" }}
                    />
                    <YAxis
                      domain={[0, 1]}
                      ticks={[0, 1]}
                      tickFormatter={(v) => (v === 1 ? "Up" : "Down")}
                      tick={{ fontSize: 10, fill: "hsl(0 0% 55%)" }}
                      axisLine={{ stroke: "hsl(0 0% 15%)" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(0 0% 4%)",
                        border: "1px solid hsl(0 0% 15%)",
                        borderRadius: "6px",
                        fontSize: "12px",
                      }}
                      formatter={(value: number) => [value === 1 ? "Up" : "Down", "Status"]}
                    />
                    <Area
                      type="stepAfter"
                      dataKey="status"
                      stroke="hsl(142 71% 45%)"
                      fill="hsl(142 71% 45% / 0.1)"
                      strokeWidth={1.5}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {results.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
            <Activity className="mb-3 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No check results yet. Results will appear once monitoring begins.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonitorDetail;
