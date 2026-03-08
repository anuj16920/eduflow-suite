import { useState, useEffect, useMemo } from "react";
import { FileText, Download, Calendar, Table2, BookOpen, Clock, GraduationCap, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SimpleCard, StatsCard } from "@/components/dashboard/StatsCard";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ExamFiltersPanel, UpcomingExamCards, ExamTimetableGrid, ExamCalendarView } from "@/components/exams";
import type { ExamCardData } from "@/components/exams/UpcomingExamCards";
import { useToast } from "@/hooks/use-toast";

export default function ExamSchedulePage() {
  const [classes, setClasses] = useState<{ id: string; name: string; section: string | null }[]>([]);
  const [examData, setExamData] = useState<ExamCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedExamType, setSelectedExamType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchClasses();
    fetchExamSchedules();
  }, []);

  const fetchClasses = async () => {
    const { data } = await supabase.from("classes").select("id, name, section").order("name");
    if (data) setClasses(data);
  };

  const fetchExamSchedules = async () => {
    setLoading(true);
    const { data: schedules, error } = await supabase
      .from("exam_schedules")
      .select(`
        id, exam_date, start_time, end_time, max_marks, room,
        subjects ( id, name, code ),
        exams ( id, name, exam_type, status, class_id, classes ( name, section ) )
      `)
      .order("exam_date", { ascending: true });

    if (error) {
      toast({ title: "Error", description: "Failed to load exam schedules", variant: "destructive" });
      setLoading(false);
      return;
    }

    const mapped: ExamCardData[] = (schedules || []).map((s: any) => ({
      id: s.id,
      subjectName: s.subjects?.name || "Unknown",
      subjectCode: s.subjects?.code || null,
      examDate: s.exam_date,
      startTime: s.start_time,
      endTime: s.end_time,
      room: s.room,
      maxMarks: s.max_marks,
      examName: s.exams?.name || "",
      examType: s.exams?.exam_type || null,
      status: s.exams?.status || "upcoming",
      className: s.exams?.classes ? `${s.exams.classes.name}${s.exams.classes.section ? `-${s.exams.classes.section}` : ""}` : "—",
    }));

    setExamData(mapped);
    setLoading(false);
  };

  const filtered = useMemo(() => {
    return examData.filter((e) => {
      if (selectedClass !== "all") {
        // Match by className containing class name
        const cls = classes.find((c) => c.id === selectedClass);
        if (cls && !e.className.startsWith(cls.name)) return false;
      }
      if (selectedExamType !== "all" && e.examType !== selectedExamType) return false;
      if (selectedStatus !== "all" && e.status !== selectedStatus) return false;
      return true;
    });
  }, [examData, selectedClass, selectedExamType, selectedStatus, classes]);

  const stats = useMemo(() => {
    const upcoming = examData.filter((e) => e.status === "upcoming").length;
    const ongoing = examData.filter((e) => e.status === "ongoing").length;
    const completed = examData.filter((e) => e.status === "completed").length;
    const subjects = new Set(examData.map((e) => e.subjectName)).size;
    return { upcoming, ongoing, completed, subjects };
  }, [examData]);

  const resetFilters = () => {
    setSelectedClass("all");
    setSelectedExamType("all");
    setSelectedStatus("all");
  };

  const handleExportCSV = () => {
    if (filtered.length === 0) return;
    const header = "Subject,Code,Date,Start,End,Room,Max Marks,Status\n";
    const rows = filtered.map((e) =>
      `"${e.subjectName}","${e.subjectCode || ""}","${e.examDate}","${e.startTime || ""}","${e.endTime || ""}","${e.room || ""}","${e.maxMarks || ""}","${e.status || ""}"`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "exam-schedule.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported", description: "CSV downloaded successfully" });
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
              <BreadcrumbItem><BreadcrumbLink href="/admin/academics/exams">Exams</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>Schedule</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold">Exam Schedule</h1>
          <p className="text-muted-foreground">View upcoming exams, timetables, and subject-wise schedules</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="Upcoming" value={stats.upcoming} icon={Clock} variant="warning" />
        <StatsCard title="Ongoing" value={stats.ongoing} icon={BookOpen} variant="primary" />
        <StatsCard title="Completed" value={stats.completed} icon={CheckCircle2} variant="success" />
        <StatsCard title="Subjects" value={stats.subjects} icon={GraduationCap} />
      </div>

      {/* Filters */}
      <ExamFiltersPanel
        classes={classes}
        selectedClass={selectedClass}
        onClassChange={setSelectedClass}
        selectedExamType={selectedExamType}
        onExamTypeChange={setSelectedExamType}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        onReset={resetFilters}
      />

      {/* Content */}
      <Tabs defaultValue="cards" className="space-y-6">
        <TabsList className="bg-muted/40 rounded-xl">
          <TabsTrigger value="cards" className="rounded-lg gap-1.5">
            <FileText className="h-4 w-4" /> Cards
          </TabsTrigger>
          <TabsTrigger value="table" className="rounded-lg gap-1.5">
            <Table2 className="h-4 w-4" /> Timetable
          </TabsTrigger>
          <TabsTrigger value="calendar" className="rounded-lg gap-1.5">
            <Calendar className="h-4 w-4" /> Calendar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cards">
          <SimpleCard title="Exam Schedule">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              </div>
            ) : (
              <UpcomingExamCards exams={filtered} />
            )}
          </SimpleCard>
        </TabsContent>

        <TabsContent value="table">
          <SimpleCard title="Exam Timetable">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              </div>
            ) : (
              <ExamTimetableGrid exams={filtered} />
            )}
          </SimpleCard>
        </TabsContent>

        <TabsContent value="calendar">
          <SimpleCard title="Calendar View">
            <ExamCalendarView exams={filtered} />
          </SimpleCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
