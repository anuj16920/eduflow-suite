import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
  BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Plus, Download, Upload, GraduationCap, UserPlus, Users, ArrowUpDown,
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import {
  StudentSearchBar, StudentFilters, StudentTable, StudentPagination,
} from "@/components/students";
import type { StudentRow } from "@/components/students/StudentRowCard";

const PAGE_SIZE = 10;

export default function StudentsManagement() {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "all";
  const navigate = useNavigate();
  const { toast } = useToast();

  const [students, setStudents] = useState<StudentRow[]>([]);
  const [classes, setClasses] = useState<{ id: string; name: string; section: string | null }[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");

  // Sort
  const [sortField, setSortField] = useState<"full_name" | "admission_number" | "class_name" | "roll_number" | "status">("full_name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // Pagination
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("students")
      .select("id, profile_id, admission_number, roll_number, status, class_id, profiles(full_name, email, avatar_url, gender), classes(name, section)");

    if (!error && data) {
      const mapped: StudentRow[] = data.map((s: any) => ({
        id: s.id,
        profile_id: s.profile_id,
        full_name: s.profiles?.full_name || "Unknown",
        email: s.profiles?.email || "",
        avatar_url: s.profiles?.avatar_url,
        gender: s.profiles?.gender,
        admission_number: s.admission_number,
        roll_number: s.roll_number,
        class_name: s.classes?.name,
        class_id: s.class_id,
        section: s.classes?.section,
        status: s.status || "active",
      }));
      setStudents(mapped);
    }
    setLoading(false);
  };

  const fetchClasses = async () => {
    const { data } = await supabase.from("classes").select("id, name, section");
    if (data) setClasses(data);
  };

  // Filter + sort + paginate
  const filtered = useMemo(() => {
    let result = students;
    const q = search.toLowerCase();
    if (q) {
      result = result.filter(
        (s) =>
          s.full_name.toLowerCase().includes(q) ||
          (s.admission_number || "").toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
      );
    }
    if (classFilter !== "all") result = result.filter((s) => (s as any).class_id === classFilter);
    if (statusFilter !== "all") result = result.filter((s) => s.status === statusFilter);
    if (genderFilter !== "all") result = result.filter((s) => s.gender === genderFilter);

    result = [...result].sort((a, b) => {
      const aVal = (a[sortField] ?? "") as string | number;
      const bVal = (b[sortField] ?? "") as string | number;
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [students, search, classFilter, statusFilter, genderFilter, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [search, classFilter, statusFilter, genderFilter]);

  const handleSort = useCallback((field: typeof sortField) => {
    setSortDir((prev) => (sortField === field ? (prev === "asc" ? "desc" : "asc") : "asc"));
    setSortField(field);
  }, [sortField]);

  const totalBoys = students.filter((s) => s.gender === "male").length;
  const totalGirls = students.filter((s) => s.gender === "female").length;
  const activeCount = students.filter((s) => s.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Breadcrumb + Header */}
      <div className="space-y-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Students</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Students</h1>
            <p className="text-sm text-muted-foreground">Manage student records, admissions, and promotions</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm"><Upload className="h-4 w-4 mr-2" />Import</Button>
            <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Export</Button>
            <Button className="gradient-primary border-0 text-primary-foreground hover:opacity-90" size="sm">
              <Plus className="h-4 w-4 mr-2" />Add Student
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Students" value={students.length} icon={GraduationCap} />
        <StatsCard title="Boys" value={totalBoys} icon={Users} variant="primary" />
        <StatsCard title="Girls" value={totalGirls} icon={Users} variant="success" />
        <StatsCard title="Active" value={activeCount} icon={UserPlus} variant="warning" />
      </div>

      {/* Tabs */}
      <Tabs defaultValue={defaultTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
          <TabsTrigger value="all">All Students</TabsTrigger>
          <TabsTrigger value="admissions">Admissions</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Search + Filters */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center gap-3"
          >
            <StudentSearchBar value={search} onChange={setSearch} className="flex-1 max-w-sm" />
            <StudentFilters
              classes={classes}
              selectedClass={classFilter}
              onClassChange={setClassFilter}
              selectedStatus={statusFilter}
              onStatusChange={setStatusFilter}
              selectedGender={genderFilter}
              onGenderChange={setGenderFilter}
            />
          </motion.div>

          {/* Table */}
          <StudentTable
            students={paginated}
            loading={loading}
            sortField={sortField}
            sortDir={sortDir}
            onSort={handleSort}
            onClick={(id) => navigate(`/admin/students/${id}`)}
            onView={(id) => navigate(`/admin/students/${id}`)}
            onEdit={(id) => toast({ title: "Edit", description: "Edit functionality coming soon" })}
            onDelete={(id) => toast({ title: "Delete", description: "Delete functionality coming soon" })}
          />

          {/* Pagination */}
          {!loading && filtered.length > 0 && (
            <StudentPagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={filtered.length}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          )}
        </TabsContent>

        <TabsContent value="admissions">
          <div className="rounded-2xl bg-muted/30 p-6">
            <div className="text-center py-12">
              <UserPlus className="h-12 w-12 mx-auto text-primary/50 mb-3" />
              <h3 className="font-semibold text-lg mb-1">Admission Portal</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                New admissions are processed through the student signup flow.
              </p>
              <Button className="mt-4 gradient-primary border-0 text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />Register New Student
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="promotions">
          <div className="rounded-2xl bg-muted/30 p-6">
            <div className="text-center py-12">
              <ArrowUpDown className="h-12 w-12 mx-auto text-primary/50 mb-3" />
              <h3 className="font-semibold text-lg mb-1">Bulk Promotion</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Select a class and promote all eligible students to the next level.
              </p>
              <div className="flex items-center gap-3 justify-center mt-4">
                <Select>
                  <SelectTrigger className="w-48"><SelectValue placeholder="From Class" /></SelectTrigger>
                  <SelectContent>
                    {classes.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-muted-foreground">→</span>
                <Select>
                  <SelectTrigger className="w-48"><SelectValue placeholder="To Class" /></SelectTrigger>
                  <SelectContent>
                    {classes.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="mt-4 gradient-primary border-0 text-primary-foreground">
                Promote Students
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
