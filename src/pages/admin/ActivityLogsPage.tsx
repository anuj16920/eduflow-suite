import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Download, FileSpreadsheet, Activity } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ActivityLogFiltersPanel, ActivityLogsTable, LogDetailDrawer } from "@/components/logs";

const PAGE_SIZE = 20;

interface LogEntry {
  id: string;
  user_name: string;
  user_role: string;
  action: string;
  module: string;
  description: string | null;
  ip_address: string | null;
  device_info: string | null;
  created_at: string;
}

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [roleFilter, setRoleFilter] = useState("all");
  const [activityType, setActivityType] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  // Drawer
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("activity_logs")
      .select("*", { count: "exact" })
      .order(sortField, { ascending: sortDir === "asc" })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

    if (roleFilter !== "all") query = query.eq("user_role", roleFilter);
    if (activityType !== "all") query = query.eq("module", activityType);
    if (dateFrom) query = query.gte("created_at", dateFrom.toISOString());
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      query = query.lte("created_at", end.toISOString());
    }
    if (search.trim()) query = query.ilike("user_name", `%${search.trim()}%`);

    const { data, count } = await query;
    setLogs((data as LogEntry[]) || []);
    setTotalCount(count || 0);
    setLoading(false);
  }, [roleFilter, activityType, dateFrom, dateTo, search, sortField, sortDir, page]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const handleSort = useCallback((field: string) => {
    setSortDir((prev) => (sortField === field ? (prev === "asc" ? "desc" : "asc") : "desc"));
    setSortField(field);
    setPage(1);
  }, [sortField]);

  const handleReset = useCallback(() => {
    setRoleFilter("all");
    setActivityType("all");
    setDateFrom(undefined);
    setDateTo(undefined);
    setSearch("");
    setPage(1);
  }, []);

  const handleRowClick = useCallback((log: LogEntry) => {
    setSelectedLog(log);
    setDrawerOpen(true);
  }, []);

  const handleExportCSV = useCallback(() => {
    const rows = [
      ["Timestamp", "User", "Role", "Action", "Module", "IP Address", "Description"],
      ...logs.map((l) => [
        format(new Date(l.created_at), "yyyy-MM-dd HH:mm:ss"),
        l.user_name, l.user_role, l.action, l.module, l.ip_address || "", l.description || "",
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity-logs-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [logs]);

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <span>Dashboard</span><span>/</span><span>Admin</span><span>/</span>
            <span className="text-foreground font-medium">Activity Logs</span>
          </div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Activity className="h-8 w-8 text-primary" />
            System Activity Logs
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl" onClick={handleExportCSV}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />Download CSV
          </Button>
          <Button className="gradient-primary border-0 text-primary-foreground hover:opacity-90 rounded-xl" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />Export Logs
          </Button>
        </div>
      </div>

      {/* Filters */}
      <ActivityLogFiltersPanel
        role={roleFilter}
        onRoleChange={(v) => { setRoleFilter(v); setPage(1); }}
        activityType={activityType}
        onActivityTypeChange={(v) => { setActivityType(v); setPage(1); }}
        dateFrom={dateFrom}
        onDateFromChange={(d) => { setDateFrom(d); setPage(1); }}
        dateTo={dateTo}
        onDateToChange={(d) => { setDateTo(d); setPage(1); }}
        onReset={handleReset}
      />

      {/* Logs Table */}
      <ActivityLogsTable
        logs={logs}
        loading={loading}
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        sortField={sortField}
        sortDir={sortDir}
        onSort={handleSort}
        onRowClick={handleRowClick}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Detail Drawer */}
      <LogDetailDrawer log={selectedLog} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
