import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { monitorApi, type Monitor } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Plus, Trash2, ExternalLink, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const [newUrl, setNewUrl] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["monitors"],
    queryFn: async () => {
      const res = await monitorApi.getAll();
      return res.data.result;
    },
  });

  const createMutation = useMutation({
    mutationFn: (url: string) => monitorApi.create(url),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monitors"] });
      setNewUrl("");
      toast.success("Monitor added");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => monitorApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monitors"] });
      toast.success("Monitor deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const monitors = data || [];
  const upCount = monitors.filter((m) => {
    const latest = m.results?.[0];
    return latest?.status === "Up";
  }).length;
  const downCount = monitors.length - upCount;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;
    createMutation.mutate(newUrl.trim());
  };

  const getMonitorStatus = (m: Monitor): "Up" | "Down" | "Unknown" => {
    const latest = m.results?.[0];
    return latest?.status || "Unknown";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">Monitor your websites in real-time</p>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary">
                <Activity className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Monitors</p>
                <p className="text-xl font-semibold">{isLoading ? "—" : monitors.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-success/10">
                <ArrowUpRight className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Up</p>
                <p className="text-xl font-semibold text-success">{isLoading ? "—" : upCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-destructive/10">
                <ArrowDownRight className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Down</p>
                <p className="text-xl font-semibold text-destructive">{isLoading ? "—" : downCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add monitor */}
        <form onSubmit={handleAdd} className="mb-6 flex gap-2">
          <Input
            placeholder="https://example.com"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={createMutation.isPending} className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </form>

        {/* Monitor list */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : monitors.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
            <Activity className="mb-3 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No monitors yet. Add one above.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {monitors.map((m) => {
              const status = getMonitorStatus(m);
              const latestResult = m.results?.[0];
              return (
                <Link
                  key={m.id}
                  to={`/monitor/${m.id}`}
                  className="group flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:border-muted-foreground/30"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        status === "Up"
                          ? "bg-success animate-pulse-dot"
                          : status === "Down"
                          ? "bg-destructive"
                          : "bg-muted-foreground"
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{m.url}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge
                          variant={status === "Up" ? "default" : status === "Down" ? "destructive" : "secondary"}
                          className="text-[10px] px-1.5 py-0"
                        >
                          {status}
                        </Badge>
                        {latestResult && (
                          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Clock className="h-2.5 w-2.5" />
                            {latestResult.responseTimeMs ? `${latestResult.responseTimeMs}ms` : "—"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        deleteMutation.mutate(m.id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                    </Button>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
