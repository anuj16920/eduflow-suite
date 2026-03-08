import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
  BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ArrowLeft, User, CalendarCheck, FileText, CreditCard, Users } from "lucide-react";
import {
  StudentProfileHeader, StudentStatsCards, AttendanceChart,
  ResultsTable, FeeStatusCard, ParentDetails,
} from "@/components/student-profile";

interface StudentProfile {
  id: string;
  profile_id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  avatar_url?: string | null;
  gender?: string | null;
  address?: string | null;
  date_of_birth?: string | null;
  admission_number?: string | null;
  roll_number?: number | null;
  blood_group?: string | null;
  class_name?: string | null;
  section?: string | null;
  class_id?: string | null;
  status?: string | null;
  admission_date?: string | null;
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-48 w-full rounded-2xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
      </div>
      <Skeleton className="h-10 w-80 rounded-lg" />
      <Skeleton className="h-64 w-full rounded-2xl" />
    </div>
  );
}

export default function StudentProfilePage() {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();

  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Data states
  const [attendance, setAttendance] = useState<any[]>([]);
  const [marks, setMarks] = useState<any[]>([]);
  const [fees, setFees] = useState<any[]>([]);
  const [parents, setParents] = useState<any[]>([]);
  const [subjectCount, setSubjectCount] = useState(0);
  const [upcomingExams, setUpcomingExams] = useState(0);

  useEffect(() => {
    if (studentId) fetchStudent();
  }, [studentId]);

  const fetchStudent = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("students")
      .select("*, profiles(*), classes(name, section)")
      .eq("id", studentId!)
      .single();

    if (!error && data) {
      setStudent({
        id: data.id,
        profile_id: data.profile_id,
        full_name: data.profiles?.full_name || "Unknown",
        email: data.profiles?.email || "",
        phone: data.profiles?.phone,
        avatar_url: data.profiles?.avatar_url,
        gender: data.profiles?.gender,
        address: data.profiles?.address,
        date_of_birth: data.profiles?.date_of_birth,
        admission_number: data.admission_number,
        roll_number: data.roll_number,
        blood_group: data.blood_group,
        class_name: data.classes?.name,
        section: data.classes?.section,
        class_id: data.class_id,
        status: data.status,
        admission_date: data.admission_date,
      });

      // Fetch related data in parallel
      fetchAttendance(data.id);
      fetchMarks(data.id);
      fetchFees(data.id);
      fetchParents(data.id);
      fetchSubjectCount(data.class_id);
      fetchUpcomingExams(data.class_id);
    }
    setLoading(false);
  };

  const fetchAttendance = async (sid: string) => {
    const { data } = await supabase.from("attendance").select("*").eq("student_id", sid);
    if (data) setAttendance(data);
  };

  const fetchMarks = async (sid: string) => {
    const { data } = await supabase
      .from("marks")
      .select("*, subjects(name), exams(name)")
      .eq("student_id", sid);
    if (data) setMarks(data);
  };

  const fetchFees = async (sid: string) => {
    const { data } = await supabase
      .from("fee_payments")
      .select("*, fee_structure(name, amount, due_date)")
      .eq("student_id", sid);
    if (data) setFees(data);
  };

  const fetchParents = async (sid: string) => {
    const { data } = await supabase
      .from("parent_students")
      .select("parents(id, relationship, occupation, profiles(full_name, email, phone))")
      .eq("student_id", sid);
    if (data) {
      const mapped = data.map((ps: any) => ({
        id: ps.parents?.id || "",
        full_name: ps.parents?.profiles?.full_name || "Unknown",
        email: ps.parents?.profiles?.email || "",
        phone: ps.parents?.profiles?.phone,
        relationship: ps.parents?.relationship,
        occupation: ps.parents?.occupation,
      }));
      setParents(mapped);
    }
  };

  const fetchSubjectCount = async (classId: string | null) => {
    if (!classId) return;
    const { data } = await supabase
      .from("teacher_assignments")
      .select("subject_id")
      .eq("class_id", classId);
    if (data) {
      const unique = new Set(data.map((d: any) => d.subject_id));
      setSubjectCount(unique.size);
    }
  };

  const fetchUpcomingExams = async (classId: string | null) => {
    if (!classId) return;
    const { data } = await supabase
      .from("exams")
      .select("id")
      .eq("class_id", classId)
      .eq("status", "upcoming");
    if (data) setUpcomingExams(data.length);
  };

  // Computed attendance data
  const attendanceStats = useMemo(() => {
    const totalDays = attendance.length;
    const present = attendance.filter((a) => a.status === "present").length;
    const absent = totalDays - present;
    const pct = totalDays > 0 ? Math.round((present / totalDays) * 100) : 0;

    // Group by month
    const byMonth: Record<string, { present: number; absent: number; total: number }> = {};
    attendance.forEach((a) => {
      const d = new Date(a.date);
      const key = d.toLocaleString("default", { month: "short" });
      if (!byMonth[key]) byMonth[key] = { present: 0, absent: 0, total: 0 };
      byMonth[key].total++;
      if (a.status === "present") byMonth[key].present++;
      else byMonth[key].absent++;
    });
    const monthlyData = Object.entries(byMonth).map(([month, v]) => ({ month, ...v }));

    return { pct, present, absent, totalDays, monthlyData };
  }, [attendance]);

  const marksForTable = useMemo(() =>
    marks.map((m: any) => ({
      subject: m.subjects?.name || "Unknown",
      marks_obtained: m.marks_obtained,
      max_marks: m.max_marks,
      grade: m.grade,
      exam_name: m.exams?.name || "Exam",
    })),
  [marks]);

  const feeData = useMemo(() => {
    const records = fees.map((f: any) => ({
      id: f.id,
      name: f.fee_structure?.name || "Fee",
      amount: f.fee_structure?.amount || 0,
      paid: f.amount_paid || 0,
      status: f.status || "pending",
      due_date: f.fee_structure?.due_date,
    }));
    const totalPaid = records.filter((r) => r.status === "paid").reduce((s, r) => s + r.paid, 0);
    const totalPending = records.filter((r) => r.status !== "paid").reduce((s, r) => s + (r.amount - r.paid), 0);
    return { records, totalPaid, totalPending };
  }, [fees]);

  const completedAssignments = 0; // Would need homework_submissions query

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-5 w-48" />
        <ProfileSkeleton />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-20">
        <User className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Student Not Found</h2>
        <p className="text-muted-foreground mb-4">The student profile you're looking for doesn't exist.</p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />Go Back
        </Button>
      </div>
    );
  }

  const tabItems = [
    { value: "overview", label: "Overview", icon: User },
    { value: "attendance", label: "Attendance", icon: CalendarCheck },
    { value: "results", label: "Exam Results", icon: FileText },
    { value: "fees", label: "Fees", icon: CreditCard },
    { value: "parents", label: "Parent Details", icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href="/admin/students">Students</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>{student.full_name}</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header */}
      <StudentProfileHeader student={student} canEdit onEdit={() => {}} />

      {/* Stats */}
      <StudentStatsCards
        attendancePercent={attendanceStats.pct}
        subjectsEnrolled={subjectCount}
        assignmentsCompleted={completedAssignments}
        upcomingExams={upcomingExams}
      />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full justify-start overflow-x-auto bg-muted/50 p-1 rounded-xl">
          {tabItems.map((t) => {
            const Icon = t.icon;
            return (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{t.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="overview" className="mt-0">
              <div className="rounded-2xl bg-card border border-border/50 p-6">
                <h3 className="font-semibold text-lg mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
                  {[
                    { label: "Full Name", value: student.full_name },
                    { label: "Email", value: student.email },
                    { label: "Phone", value: student.phone || "—" },
                    { label: "Gender", value: student.gender || "—" },
                    { label: "Date of Birth", value: student.date_of_birth || "—" },
                    { label: "Blood Group", value: student.blood_group || "—" },
                    { label: "Address", value: student.address || "—" },
                    { label: "Admission Number", value: student.admission_number || "—" },
                    { label: "Admission Date", value: student.admission_date || "—" },
                    { label: "Roll Number", value: student.roll_number?.toString() || "—" },
                    { label: "Class", value: student.class_name ? `${student.class_name}${student.section ? ` - ${student.section}` : ""}` : "—" },
                    { label: "Status", value: student.status || "active" },
                  ].map((f) => (
                    <div key={f.label}>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">{f.label}</p>
                      <p className="text-sm font-medium capitalize">{f.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="attendance" className="mt-0">
              <div className="rounded-2xl bg-card border border-border/50 p-6">
                <h3 className="font-semibold text-lg mb-4">Attendance Record</h3>
                <AttendanceChart
                  monthlyData={attendanceStats.monthlyData}
                  overallPercent={attendanceStats.pct}
                  totalPresent={attendanceStats.present}
                  totalAbsent={attendanceStats.absent}
                  totalDays={attendanceStats.totalDays}
                />
              </div>
            </TabsContent>

            <TabsContent value="results" className="mt-0">
              <div className="rounded-2xl bg-card border border-border/50 p-6">
                <h3 className="font-semibold text-lg mb-4">Examination Results</h3>
                <ResultsTable marks={marksForTable} />
              </div>
            </TabsContent>

            <TabsContent value="fees" className="mt-0">
              <div className="rounded-2xl bg-card border border-border/50 p-6">
                <h3 className="font-semibold text-lg mb-4">Fee Status</h3>
                <FeeStatusCard
                  fees={feeData.records}
                  totalPaid={feeData.totalPaid}
                  totalPending={feeData.totalPending}
                />
              </div>
            </TabsContent>

            <TabsContent value="parents" className="mt-0">
              <div className="rounded-2xl bg-card border border-border/50 p-6">
                <h3 className="font-semibold text-lg mb-4">Parent / Guardian Details</h3>
                <ParentDetails parents={parents} />
              </div>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
