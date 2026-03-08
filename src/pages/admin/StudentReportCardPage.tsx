import { useState, useEffect, useMemo } from "react";
import { Download, Printer, FileText, GraduationCap, TrendingUp, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { SimpleCard, StatsCard } from "@/components/dashboard/StatsCard";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { StudentSummaryCard, SemesterSelector, MarksTable, PerformanceCharts } from "@/components/results";
import type { MarkRow } from "@/components/results";
import { useToast } from "@/hooks/use-toast";

function calcGrade(pct: number) {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B+";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C";
  return "D";
}

export default function StudentReportCardPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [marksRaw, setMarksRaw] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedExam, setSelectedExam] = useState("all");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [studentsRes, examsRes, marksRes] = await Promise.all([
      supabase.from("students").select("*, profiles(*), classes(name, section)"),
      supabase.from("exams").select("id, name"),
      supabase.from("marks").select("*, subjects(*), exams(id, name)"),
    ]);
    if (studentsRes.data) {
      setStudents(studentsRes.data);
      if (studentsRes.data.length > 0) setSelectedStudent(studentsRes.data[0].id);
    }
    if (examsRes.data) setExams(examsRes.data);
    if (marksRes.data) setMarksRaw(marksRes.data);
    setLoading(false);
  };

  const currentStudent = useMemo(
    () => students.find((s) => s.id === selectedStudent),
    [students, selectedStudent]
  );

  const marks: MarkRow[] = useMemo(() => {
    let filtered = marksRaw.filter((m) => m.student_id === selectedStudent);
    if (selectedExam !== "all") filtered = filtered.filter((m) => m.exam_id === selectedExam);
    return filtered.map((m) => {
      const obtained = m.marks_obtained || 0;
      const max = m.max_marks || 100;
      const pct = max > 0 ? (obtained / max) * 100 : 0;
      return {
        id: m.id,
        subjectName: m.subjects?.name || "Unknown",
        subjectCode: m.subjects?.code || null,
        marksObtained: obtained,
        maxMarks: max,
        grade: m.grade || calcGrade(pct),
        examName: m.exams?.name || "",
      };
    });
  }, [marksRaw, selectedStudent, selectedExam]);

  const stats = useMemo(() => {
    const total = marks.reduce((s, m) => s + m.marksObtained, 0);
    const max = marks.reduce((s, m) => s + m.maxMarks, 0);
    const pct = max > 0 ? (total / max) * 100 : 0;
    return {
      totalMarks: total,
      maxMarks: max,
      percentage: pct,
      overallGrade: calcGrade(pct),
      subjectCount: marks.length,
    };
  }, [marks]);

  const handlePrint = () => {
    window.print();
  };

  const handleCSV = () => {
    if (marks.length === 0) return;
    const header = "Subject,Code,Marks,Max,Percentage,Grade\n";
    const rows = marks
      .map((m) => `"${m.subjectName}","${m.subjectCode || ""}",${m.marksObtained},${m.maxMarks},${m.maxMarks > 0 ? ((m.marksObtained / m.maxMarks) * 100).toFixed(1) : 0},"${m.grade}"`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-card-${currentStudent?.profiles?.full_name || "student"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported", description: "CSV downloaded" });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Breadcrumb className="mb-2">
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink href="/admin/reports">Results</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>Report Card</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold">Student Report Card</h1>
          <p className="text-muted-foreground">View academic results, grades, and performance analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl" onClick={handleCSV}>
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
          <Button variant="outline" className="rounded-xl" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" /> Print
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="Overall Grade" value={stats.overallGrade} icon={Award} variant="success" />
        <StatsCard title="Percentage" value={`${stats.percentage.toFixed(1)}%`} icon={TrendingUp} variant="primary" />
        <StatsCard title="Subjects" value={stats.subjectCount} icon={GraduationCap} />
        <StatsCard title="Total Marks" value={`${stats.totalMarks}/${stats.maxMarks}`} icon={FileText} variant="warning" />
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={selectedStudent} onValueChange={setSelectedStudent}>
          <SelectTrigger className="w-[240px] rounded-xl bg-muted/40 border-0">
            <SelectValue placeholder="Select Student" />
          </SelectTrigger>
          <SelectContent>
            {students.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.profiles?.full_name || "Student"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <SemesterSelector
          exams={exams}
          selected={selectedExam}
          onChange={setSelectedExam}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      ) : (
        <>
          {/* Student Summary */}
          {currentStudent && (
            <StudentSummaryCard
              student={{
                name: currentStudent.profiles?.full_name || "Student",
                email: currentStudent.profiles?.email || "",
                avatarUrl: currentStudent.profiles?.avatar_url,
                admissionNumber: currentStudent.admission_number,
                className: currentStudent.classes
                  ? `${currentStudent.classes.name}${currentStudent.classes.section ? `-${currentStudent.classes.section}` : ""}`
                  : undefined,
                status: currentStudent.status,
              }}
              stats={stats}
            />
          )}

          {/* Marks Table */}
          <SimpleCard title="Subject Marks">
            <MarksTable marks={marks} />
          </SimpleCard>

          {/* Charts */}
          <PerformanceCharts marks={marks} />
        </>
      )}
    </div>
  );
}
