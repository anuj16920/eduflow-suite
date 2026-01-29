import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";

// Public Pages
import { PublicLayout } from "@/components/layout/PublicLayout";
import HomePage from "./pages/HomePage";
import FeaturesPage from "./pages/FeaturesPage";
import PricingPage from "./pages/PricingPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";

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

// Teacher Pages
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherProfile from "./pages/teacher/TeacherProfile";
import TeacherClasses from "./pages/teacher/TeacherClasses";
import TeacherAttendance from "./pages/teacher/TeacherAttendance";
import TeacherHomework from "./pages/teacher/TeacherHomework";
import TeacherMarks from "./pages/teacher/TeacherMarks";
import TeacherMessages from "./pages/teacher/TeacherMessages";

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

const adminUser = { name: "Admin User", email: "admin@school.edu", role: "admin" };
const teacherUser = { name: "Dr. Rajesh Kumar", email: "rajesh@school.edu", role: "teacher" };
const parentUser = { name: "Mr. Rakesh Sharma", email: "rakesh@school.edu", role: "parent" };

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />

            {/* Admin Routes */}
            <Route element={<DashboardLayout role="admin" user={adminUser} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/teachers" element={<TeachersManagement />} />
              <Route path="/admin/students" element={<StudentsManagement />} />
              <Route path="/admin/parents" element={<ParentsManagement />} />
              <Route path="/admin/academics" element={<AcademicsManagement />} />
              <Route path="/admin/fees" element={<FeesManagement />} />
              <Route path="/admin/communication" element={<CommunicationCenter />} />
              <Route path="/admin/reports" element={<ReportsAnalytics />} />
              <Route path="/admin/settings" element={<SettingsPage />} />
            </Route>

            {/* Teacher Routes */}
            <Route element={<DashboardLayout role="teacher" user={teacherUser} />}>
              <Route path="/teacher" element={<TeacherDashboard />} />
              <Route path="/teacher/profile" element={<TeacherProfile />} />
              <Route path="/teacher/classes" element={<TeacherClasses />} />
              <Route path="/teacher/attendance" element={<TeacherAttendance />} />
              <Route path="/teacher/homework" element={<TeacherHomework />} />
              <Route path="/teacher/marks" element={<TeacherMarks />} />
              <Route path="/teacher/messages" element={<TeacherMessages />} />
            </Route>

            {/* Parent Routes */}
            <Route element={<DashboardLayout role="parent" user={parentUser} />}>
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
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
