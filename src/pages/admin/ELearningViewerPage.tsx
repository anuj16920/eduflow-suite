import { useState, useEffect, useMemo } from "react";
import { BookOpen, Video, FileText, Monitor } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SimpleCard, StatsCard } from "@/components/dashboard/StatsCard";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CourseFiltersPanel, CourseCard, CourseDetailDrawer } from "@/components/elearning";
import type { CourseCardData } from "@/components/elearning";

export default function ELearningViewerPage() {
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const [classes, setClasses] = useState<{ id: string; name: string; section: string | null }[]>([]);
  const [materialsRaw, setMaterialsRaw] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState<CourseCardData | null>(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    const [subRes, clsRes, matRes] = await Promise.all([
      supabase.from("subjects").select("id, name"),
      supabase.from("classes").select("id, name, section"),
      supabase.from("study_materials").select("*, subjects(name), classes(name, section), teachers(profiles(full_name))").order("created_at", { ascending: false }),
    ]);
    if (subRes.data) setSubjects(subRes.data);
    if (clsRes.data) setClasses(clsRes.data);
    if (matRes.data) setMaterialsRaw(matRes.data);
    setLoading(false);
  };

  const allMaterials: CourseCardData[] = useMemo(
    () =>
      materialsRaw.map((m: any) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        subjectName: m.subjects?.name || "General",
        className: m.classes ? `${m.classes.name}${m.classes.section ? `-${m.classes.section}` : ""}` : "All",
        teacherName: m.teachers?.profiles?.full_name || "Unknown",
        materialType: m.material_type,
        fileUrl: m.file_url,
        createdAt: m.created_at,
      })),
    [materialsRaw]
  );

  const filtered = useMemo(() => {
    return allMaterials.filter((m) => {
      if (selectedSubject !== "all") {
        const sub = subjects.find((s) => s.id === selectedSubject);
        if (sub && m.subjectName !== sub.name) return false;
      }
      if (selectedClass !== "all") {
        const cls = classes.find((c) => c.id === selectedClass);
        if (cls && !m.className.startsWith(cls.name)) return false;
      }
      if (selectedType !== "all" && m.materialType !== selectedType) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!m.title.toLowerCase().includes(q) && !m.subjectName.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [allMaterials, selectedSubject, selectedClass, selectedType, search, subjects, classes]);

  const relatedMaterials = useMemo(() => {
    if (!selectedMaterial) return [];
    return allMaterials.filter(
      (m) => m.subjectName === selectedMaterial.subjectName && m.id !== selectedMaterial.id
    );
  }, [allMaterials, selectedMaterial]);

  const stats = useMemo(() => ({
    total: allMaterials.length,
    videos: allMaterials.filter((m) => m.materialType === "video").length,
    documents: allMaterials.filter((m) => m.materialType === "document").length,
    subjects: new Set(allMaterials.map((m) => m.subjectName)).size,
  }), [allMaterials]);

  const resetFilters = () => {
    setSelectedSubject("all");
    setSelectedClass("all");
    setSelectedType("all");
    setSearch("");
  };

  return (
    <div className="space-y-8">
      <div>
        <Breadcrumb className="mb-2">
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href="/admin/elearning">E-Learning</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Courses</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-3xl font-bold">E-Learning</h1>
        <p className="text-muted-foreground">Access courses, video lessons, and study materials</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="Total Materials" value={stats.total} icon={BookOpen} />
        <StatsCard title="Videos" value={stats.videos} icon={Video} variant="success" />
        <StatsCard title="Documents" value={stats.documents} icon={FileText} variant="primary" />
        <StatsCard title="Subjects" value={stats.subjects} icon={Monitor} variant="warning" />
      </div>

      <CourseFiltersPanel
        subjects={subjects}
        classes={classes}
        selectedSubject={selectedSubject}
        onSubjectChange={setSelectedSubject}
        selectedClass={selectedClass}
        onClassChange={setSelectedClass}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        search={search}
        onSearchChange={setSearch}
        onReset={resetFilters}
      />

      <SimpleCard title={`Course Materials (${filtered.length})`}>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-14 w-14 mx-auto text-muted-foreground/20 mb-4" />
            <p className="text-muted-foreground font-medium">No materials found</p>
            <p className="text-sm text-muted-foreground/60">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((m, i) => (
              <CourseCard
                key={m.id}
                material={m}
                index={i}
                onClick={() => setSelectedMaterial(m)}
              />
            ))}
          </div>
        )}
      </SimpleCard>

      <CourseDetailDrawer
        material={selectedMaterial}
        relatedMaterials={relatedMaterials}
        onClose={() => setSelectedMaterial(null)}
        onSelectLesson={setSelectedMaterial}
      />
    </div>
  );
}
