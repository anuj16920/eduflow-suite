import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
  BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Download, FileSpreadsheet, CalendarCheck } from "lucide-react";
import { motion } from "framer-motion";
import {
  StudentSelector, AttendanceSummaryCards, StudentAttendanceCalendar, AttendanceCharts,
} from "@/components/attendance";

interface SelectedStudent {
  id: string;
  profile_id: string;
  full_name: string;
  email: string;
  avatar_url?: string | null;
  admission_number?: string | null;
}

interface AttendanceRecord {
  date: string;
  status: string;
  check_in?: string | null;
  check_out?: string | null;
}

export default function StudentAttendanceCalendarPage() {
  const [selected, setSelected] = useState<SelectedStudent | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  useEffect(() => {
    if (selected) fetchAttendance(selected.id);
  }, [selected]);

  const fetchAttendance = async (studentId: string) => {
    setLoading(true);
    const { data } = await supabase
      .from("attendance")
      .select("date, status, check_in, check_out")
      .eq("student_id", studentId)
      .order("date", { ascending: true });
    if (data) setAttendance(data);
    setLoading(false);
  };

  // Filter for current month view
  const monthAttendance = useMemo(() =>
    attendance.filter((a) => {
      const d = new Date(a.date);
      return d.getFullYear() === year && d.getMonth() === month;
    }),
  [attendance, year, month]);

  // Stats
  const stats = useMemo(() => {
    const total = attendance.length;
    const present = attendance.filter((a) => a.status === "present").length;
    const absent = attendance.filter((a) => a.status === "absent").length;
    const late = attendance.filter((a) => a.status === "late").length;
    const pct = total > 0 ? Math.round((present / total) * 100) : 0;
    return { present, absent, late, pct };
  }, [attendance]);

  // Monthly trend
  const monthlyTrend = useMemo(() => {
    const byMonth: Record<string, { total: number; present: number }> = {};
    attendance.forEach((a) => {
      const d = new Date(a.date);
      const key = d.toLocaleString("default", { month: "short" });
      if (!byMonth[key]) byMonth[key] = { total: 0, present: 0 };
      byMonth[key].total++;
      if (a.status === "present") byMonth[key].present++;
    });
    return Object.entries(byMonth).map(([m, v]) => ({
      month: m,
      percentage: Math.round((v.present / v.total) * 100),
    }));
  }, [attendance]);

  const prev = () => { if (month === 0) { setMonth(11); setYear((y) => y - 1); } else setMonth((m) => m - 1); };
  const next = () => { if (month === 11) { setMonth(0); setYear((y) => y + 1); } else setMonth((m) => m + 1); };
  const today = () => { setYear(now.getFullYear()); setMonth(now.getMonth()); };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href="/admin/attendance">Attendance</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Student Calendar</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Attendance Overview</h1>
            <p className="text-sm text-muted-foreground">View and analyze student attendance with calendar and charts</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Export Report</Button>
            <Button variant="outline" size="sm"><FileSpreadsheet className="h-4 w-4 mr-2" />Download CSV</Button>
          </div>
        </div>
      </div>

      {/* Student Selector */}
      <div className="rounded-2xl bg-card border border-border/50 p-5">
        <p className="text-sm font-medium mb-2">Select Student</p>
        <StudentSelector selected={selected} onSelect={setSelected} />
      </div>

      {selected ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Summary Cards */}
          <AttendanceSummaryCards
            present={stats.present}
            absent={stats.absent}
            late={stats.late}
            percentage={stats.pct}
          />

          {/* Calendar + Charts layout */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
            {/* Calendar takes 3 cols on xl */}
            <div className="xl:col-span-3">
              <StudentAttendanceCalendar
                year={year}
                month={month}
                attendance={monthAttendance}
                onPrev={prev}
                onNext={next}
                onToday={today}
              />
            </div>

            {/* Quick stats sidebar */}
            <div className="xl:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-2xl bg-card border border-border/50 p-6"
              >
                <h4 className="text-sm font-semibold mb-4">
                  {new Date(year, month).toLocaleString("default", { month: "long" })} Summary
                </h4>
                <div className="space-y-3">
                  {[
                    { label: "Present", value: monthAttendance.filter((a) => a.status === "present").length, color: "bg-emerald-500" },
                    { label: "Absent", value: monthAttendance.filter((a) => a.status === "absent").length, color: "bg-destructive" },
                    { label: "Late", value: monthAttendance.filter((a) => a.status === "late").length, color: "bg-amber-500" },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                      <div className="flex items-center gap-2">
                        <div className={`h-2.5 w-2.5 rounded-full ${s.color}`} />
                        <span className="text-sm text-muted-foreground">{s.label}</span>
                      </div>
                      <span className="text-sm font-semibold">{s.value} days</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Charts */}
          <AttendanceCharts
            monthlyTrend={monthlyTrend}
            breakdown={{ present: stats.present, absent: stats.absent, late: stats.late }}
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl bg-card border border-border/50 p-12 text-center"
        >
          <CalendarCheck className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold mb-1">Select a Student</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Choose a student from the selector above to view their attendance calendar, trends, and analytics.
          </p>
        </motion.div>
      )}
    </div>
  );
}
