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
import FeesManagement from "./pages/admin/FeesManagement";

// Teacher Pages
import TeacherDashboard from "./pages/teacher/TeacherDashboard";

// Parent Pages
import ParentDashboard from "./pages/parent/ParentDashboard";

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
              <Route path="/admin/fees" element={<FeesManagement />} />
            </Route>

            {/* Teacher Routes */}
            <Route element={<DashboardLayout role="teacher" user={teacherUser} />}>
              <Route path="/teacher" element={<TeacherDashboard />} />
            </Route>

            {/* Parent Routes */}
            <Route element={<DashboardLayout role="parent" user={parentUser} />}>
              <Route path="/parent" element={<ParentDashboard />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
