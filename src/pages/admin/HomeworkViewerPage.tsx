import { useState, useEffect, useMemo } from "react";
import { BookOpen, FileText, CheckCircle2, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SimpleCard, StatsCard } from "@/components/dashboard/StatsCard";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  HomeworkFiltersPanel, HomeworkAssignmentCard, AssignmentDetailDrawer,
} from "@/components/homework";
import type { HomeworkCardData } from "@/components/homework";
import { isPast, isToday } from "date-fns";

export default function HomeworkViewerPage() {
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const [classes, setClasses] = useState<{ id: string; name: string; section: string | null }[]>([]);
  const [homeworkRaw, setHomeworkRaw] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedHomework, setSelectedHomework] = useState<HomeworkCardData | null>(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    const [subRes, clsRes, hwRes, submsRes] = await Promise.all([
      supabase.from("subjects").select("id, name"),
      supabase.from("classes").select("id, name, section"),
      supabase.from("homework").select("*, subjects(name), classes(name, section), teachers(profiles(full_name))").order("due_date", { ascending: false }),
      supabase.from("homework_submissions").select("homework_id"),
    ]);
    if (subRes.data) setSubjects(subRes.data);
    if (clsRes.data) setClasses(clsRes.data);
    if (hwRes.data) setHomeworkRaw(hwRes.data);
    if (submsRes.data) setSubmissions(submsRes.data);
    setLoading(false);
  };

  const submissionCounts = useMemo(() => {
    const map: Record<string, number> = {};
    submissions.forEach((s) => {
      map[s.homework_id] = (map[s.homework_id] || 0) + 1;
    });
    return map;
  }, [submissions]);

  const allHomework: HomeworkCardData[] = useMemo(
    () =>
      homeworkRaw.map((hw: any) => ({
        id: hw.id,
        title: hw.title,
        description: hw.description,
        subjectName: hw.subjects?.name || "Unknown",
        className: hw.classes ? `${hw.classes.name}${hw.classes.section ? `-${hw.classes.section}` : ""}` : "—",
        teacherName: hw.teachers?.profiles?.full_name || "Unknown",
        dueDate: hw.due_date,
        createdAt: hw.created_at,
        status: hw.status,
        attachmentUrl: hw.attachment_url,
        submissionCount: submissionCounts[hw.id] || 0,
      })),
    [homeworkRaw, submissionCounts]
  );

  const filtered = useMemo(() => {
    return allHomework.filter((hw) => {
      if (selectedSubject !== "all") {
        const sub = subjects.find((s) => s.id === selectedSubject);
        if (sub && hw.subjectName !== sub.name) return false;
      }
      if (selectedClass !== "all") {
        const cls = classes.find((c) => c.id === selectedClass);
        if (cls && !hw.className.startsWith(cls.name)) return false;
      }
      if (selectedStatus !== "all") {
        const effective = hw.status === "completed" ? "completed"
          : (isPast(new Date(hw.dueDate)) && !isToday(new Date(hw.dueDate))) ? "overdue" : "active";
        if (effective !== selectedStatus) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        if (!hw.title.toLowerCase().includes(q) && !hw.subjectName.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [allHomework, selectedSubject, selectedClass, selectedStatus, search, subjects, classes]);

  const stats = useMemo(() => {
    const active = allHomework.filter(
      (h) => h.status !== "completed" && !(isPast(new Date(h.dueDate)) && !isToday(new Date(h.dueDate)))
    ).length;
    const overdue = allHomework.filter(
      (h) => h.status !== "completed" && isPast(new Date(h.dueDate)) && !isToday(new Date(h.dueDate))
    ).length;
    const completed = allHomework.filter((h) => h.status === "completed").length;
    return { total: allHomework.length, active, overdue, completed };
  }, [allHomework]);

  const resetFilters = () => {
    setSelectedSubject("all");
    setSelectedClass("all");
    setSelectedStatus("all");
    setSearch("");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Breadcrumb className="mb-2">
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href="/admin/homework">Homework</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Assignments</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-3xl font-bold">Homework Assignments</h1>
        <p className="text-muted-foreground">View and track homework assignments across classes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="Total" value={stats.total} icon={BookOpen} />
        <StatsCard title="Active" value={stats.active} icon={Clock} variant="primary" />
        <StatsCard title="Overdue" value={stats.overdue} icon={FileText} variant="warning" />
        <StatsCard title="Completed" value={stats.completed} icon={CheckCircle2} variant="success" />
      </div>

      {/* Filters */}
      <HomeworkFiltersPanel
        subjects={subjects}
        classes={classes}
        selectedSubject={selectedSubject}
        onSubjectChange={setSelectedSubject}
        selectedClass={selectedClass}
        onClassChange={setSelectedClass}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        search={search}
        onSearchChange={setSearch}
        onReset={resetFilters}
      />

      {/* Cards */}
      <SimpleCard title={`Assignments (${filtered.length})`}>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-14 w-14 mx-auto text-muted-foreground/20 mb-4" />
            <p className="text-muted-foreground font-medium">No assignments found</p>
            <p className="text-sm text-muted-foreground/60">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((hw, i) => (
              <HomeworkAssignmentCard
                key={hw.id}
                homework={hw}
                index={i}
                onClick={() => setSelectedHomework(hw)}
              />
            ))}
          </div>
        )}
      </SimpleCard>

      {/* Detail Drawer */}
      <AssignmentDetailDrawer
        homework={selectedHomework}
        onClose={() => setSelectedHomework(null)}
      />
    </div>
  );
}
