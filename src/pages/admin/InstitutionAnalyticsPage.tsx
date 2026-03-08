import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Download, FileSpreadsheet, GraduationCap, Users, CalendarCheck, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AnalyticsFiltersPanel,
  MetricCard,
  StudentGrowthChart,
  AttendanceTrendChart,
  AcademicPerformanceChart,
} from "@/components/analytics";

export default function InstitutionAnalyticsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [marks, setMarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [academicYear, setAcademicYear] = useState("2025-2026");
  const [semester, setSemester] = useState("all");

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [studentsRes, teachersRes, attendanceRes, marksRes] = await Promise.all([
      supabase.from("students").select("*, profiles(full_name)"),
      supabase.from("teachers").select("id"),
      supabase.from("attendance").select("date, status"),
      supabase.from("marks").select("marks_obtained, max_marks, subjects(name)"),
    ]);
    if (studentsRes.data) setStudents(studentsRes.data);
    if (teachersRes.data) setTeachers(teachersRes.data);
    if (attendanceRes.data) setAttendance(attendanceRes.data);
    if (marksRes.data) setMarks(marksRes.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const avgAttendance = useMemo(() => {
    if (!attendance.length) return "0%";
    const present = attendance.filter((a) => a.status === "present").length;
    return `${((present / attendance.length) * 100).toFixed(1)}%`;
  }, [attendance]);

  const avgPerformance = useMemo(() => {
    if (!marks.length) return "0%";
    const total = marks.reduce((s, m) => s + (Number(m.marks_obtained) || 0), 0);
    const max = marks.reduce((s, m) => s + (Number(m.max_marks) || 100), 0);
    return `${((total / max) * 100).toFixed(1)}%`;
  }, [marks]);

  const handleReset = useCallback(() => {
    setAcademicYear("2025-2026");
    setSemester("all");
  }, []);

  const handleExportCSV = useCallback(() => {
    const rows = [
      ["Metric", "Value"],
      ["Total Students", students.length.toString()],
      ["Total Teachers", teachers.length.toString()],
      ["Avg Attendance", avgAttendance],
      ["Avg Performance", avgPerformance],
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "analytics-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [students, teachers, avgAttendance, avgPerformance]);

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <span>Dashboard</span>
            <span>/</span>
            <span>Analytics</span>
            <span>/</span>
            <span className="text-foreground font-medium">Overview</span>
          </div>
          <h1 className="text-3xl font-bold">Institution Analytics</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl" onClick={handleExportCSV}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />Download CSV
          </Button>
          <Button className="gradient-primary border-0 text-primary-foreground hover:opacity-90 rounded-xl" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <AnalyticsFiltersPanel
        academicYear={academicYear}
        onAcademicYearChange={setAcademicYear}
        semester={semester}
        onSemesterChange={setSemester}
        onReset={handleReset}
      />

      {/* KPI Metrics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Students"
          value={loading ? "—" : students.length.toLocaleString()}
          icon={GraduationCap}
          trend={{ value: "12%", positive: true }}
          variant="primary"
          loading={loading}
          index={0}
        />
        <MetricCard
          title="Total Teachers"
          value={loading ? "—" : teachers.length.toLocaleString()}
          icon={Users}
          trend={{ value: "3%", positive: true }}
          variant="default"
          loading={loading}
          index={1}
        />
        <MetricCard
          title="Avg Attendance"
          value={loading ? "—" : avgAttendance}
          icon={CalendarCheck}
          trend={{ value: "2.1%", positive: true }}
          variant="success"
          loading={loading}
          index={2}
        />
        <MetricCard
          title="Avg Performance"
          value={loading ? "—" : avgPerformance}
          icon={BarChart3}
          trend={{ value: "5%", positive: true }}
          variant="warning"
          loading={loading}
          index={3}
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <StudentGrowthChart students={students} />
        <AttendanceTrendChart attendance={attendance} />
      </div>

      <AcademicPerformanceChart marks={marks} />
    </div>
  );
}
