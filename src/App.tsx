import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Public Pages
import { PublicLayout } from "@/components/layout/PublicLayout";
import HomePage from "./pages/HomePage";
import FeaturesPage from "./pages/FeaturesPage";
import PricingPage from "./pages/PricingPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

// Dashboard Layouts
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import TeachersManagement from "./pages/admin/TeachersManagement";
import StudentsManagement from "./pages/admin/StudentsManagement";
import ParentsManagement from "./pages/admin/ParentsManagement";
import AcademicsManagement from "./pages/admin/AcademicsManagement";
import FeesManagement from "./pages/admin/FeesManagement";
import CommunicationCenter from "./pages/admin/CommunicationCenter";
import ReportsAnalytics from "./pages/admin/ReportsAnalytics";
import SettingsPage from "./pages/admin/SettingsPage";
import HostelManagement from "./pages/admin/HostelManagement";
import TransportManagement from "./pages/admin/TransportManagement";
import CafeteriaManagement from "./pages/admin/CafeteriaManagement";
import ELearningManagement from "./pages/admin/ELearningManagement";
import AttendanceManagement from "./pages/admin/AttendanceManagement";
import StudentProfilePage from "./pages/admin/StudentProfilePage";
import AddStudentPage from "./pages/admin/AddStudentPage";
import StudentAttendanceCalendarPage from "./pages/admin/StudentAttendanceCalendarPage";
import FaceAttendancePage from "./pages/admin/FaceAttendancePage";
import ExamSchedulePage from "./pages/admin/ExamSchedulePage";
import StudentReportCardPage from "./pages/admin/StudentReportCardPage";

// Teacher Pages
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherProfile from "./pages/teacher/TeacherProfile";
import TeacherClasses from "./pages/teacher/TeacherClasses";
import TeacherAttendance from "./pages/teacher/TeacherAttendance";
import TeacherHomework from "./pages/teacher/TeacherHomework";
import TeacherMarks from "./pages/teacher/TeacherMarks";
import TeacherMessages from "./pages/teacher/TeacherMessages";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentTimetable from "./pages/student/StudentTimetable";
import StudentAttendance from "./pages/student/StudentAttendance";
import StudentHomework from "./pages/student/StudentHomework";
import StudentResults from "./pages/student/StudentResults";
import StudentFees from "./pages/student/StudentFees";
import StudentProfile from "./pages/student/StudentProfile";

// Parent Pages
import ParentDashboard from "./pages/parent/ParentDashboard";
import ParentStudentProfile from "./pages/parent/ParentStudentProfile";
import ParentAttendance from "./pages/parent/ParentAttendance";
import ParentHomework from "./pages/parent/ParentHomework";
import ParentResults from "./pages/parent/ParentResults";
import ParentFees from "./pages/parent/ParentFees";
import ParentMessages from "./pages/parent/ParentMessages";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AuthRedirect() {
  const { user, role, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={`/${role || "student"}`} replace />;
}

function DashboardWithAuth({ role, children }: { role: string; children?: React.ReactNode }) {
  const { profile } = useAuth();
  const user = {
    name: profile?.full_name || "User",
    email: profile?.email || "",
    role: profile?.role || role,
    avatar: profile?.avatar_url || undefined,
  };
  return <DashboardLayout role={role as any} user={user} />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/features" element={<FeaturesPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Route>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/dashboard" element={<AuthRedirect />} />

              {/* Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={["admin"]}><DashboardWithAuth role="admin" /></ProtectedRoute>}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/teachers" element={<TeachersManagement />} />
                <Route path="/admin/students" element={<StudentsManagement />} />
                <Route path="/admin/students/add" element={<AddStudentPage />} />
                <Route path="/admin/students/admissions" element={<StudentsManagement />} />
                <Route path="/admin/students/:studentId" element={<StudentProfilePage />} />
                <Route path="/admin/students/promotions" element={<StudentsManagement />} />
                <Route path="/admin/parents" element={<ParentsManagement />} />
                <Route path="/admin/academics" element={<AcademicsManagement />} />
                <Route path="/admin/academics/timetable" element={<AcademicsManagement />} />
                <Route path="/admin/academics/subjects" element={<AcademicsManagement />} />
                <Route path="/admin/academics/exams" element={<AcademicsManagement />} />
                <Route path="/admin/exams/schedule" element={<ExamSchedulePage />} />
                <Route path="/admin/fees" element={<FeesManagement />} />
                <Route path="/admin/hostel" element={<HostelManagement />} />
                <Route path="/admin/transport" element={<TransportManagement />} />
                <Route path="/admin/cafeteria" element={<CafeteriaManagement />} />
                <Route path="/admin/communication" element={<CommunicationCenter />} />
                <Route path="/admin/homework" element={<AcademicsManagement />} />
                <Route path="/admin/elearning" element={<ELearningManagement />} />
                <Route path="/admin/attendance" element={<AttendanceManagement />} />
                <Route path="/admin/attendance/calendar" element={<StudentAttendanceCalendarPage />} />
                <Route path="/admin/attendance/face-scan" element={<FaceAttendancePage />} />
                <Route path="/admin/reports" element={<ReportsAnalytics />} />
                <Route path="/admin/reports/report-card" element={<StudentReportCardPage />} />
                <Route path="/admin/settings" element={<SettingsPage />} />
              </Route>

              {/* Teacher Routes */}
              <Route element={<ProtectedRoute allowedRoles={["teacher"]}><DashboardWithAuth role="teacher" /></ProtectedRoute>}>
                <Route path="/teacher" element={<TeacherDashboard />} />
                <Route path="/teacher/profile" element={<TeacherProfile />} />
                <Route path="/teacher/classes" element={<TeacherClasses />} />
                <Route path="/teacher/attendance" element={<TeacherAttendance />} />
                <Route path="/teacher/homework" element={<TeacherHomework />} />
                <Route path="/teacher/marks" element={<TeacherMarks />} />
                <Route path="/teacher/messages" element={<TeacherMessages />} />
              </Route>

              {/* Student Routes */}
              <Route element={<ProtectedRoute allowedRoles={["student"]}><DashboardWithAuth role="student" /></ProtectedRoute>}>
                <Route path="/student" element={<StudentDashboard />} />
                <Route path="/student/timetable" element={<StudentTimetable />} />
                <Route path="/student/attendance" element={<StudentAttendance />} />
                <Route path="/student/homework" element={<StudentHomework />} />
                <Route path="/student/results" element={<StudentResults />} />
                <Route path="/student/fees" element={<StudentFees />} />
                <Route path="/student/profile" element={<StudentProfile />} />
              </Route>

              {/* Parent Routes */}
              <Route element={<ProtectedRoute allowedRoles={["parent"]}><DashboardWithAuth role="parent" /></ProtectedRoute>}>
                <Route path="/parent" element={<ParentDashboard />} />
                <Route path="/parent/student" element={<ParentStudentProfile />} />
                <Route path="/parent/attendance" element={<ParentAttendance />} />
                <Route path="/parent/homework" element={<ParentHomework />} />
                <Route path="/parent/results" element={<ParentResults />} />
                <Route path="/parent/fees" element={<ParentFees />} />
                <Route path="/parent/messages" element={<ParentMessages />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
