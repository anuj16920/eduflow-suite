import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserCircle,
  BookOpen,
  CreditCard,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  role: "admin" | "teacher" | "parent";
}

const adminLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Teachers", href: "/admin/teachers", icon: Users },
  { label: "Students", href: "/admin/students", icon: GraduationCap },
  { label: "Parents", href: "/admin/parents", icon: UserCircle },
  { label: "Academics", href: "/admin/academics", icon: BookOpen },
  { label: "Fees & Accounts", href: "/admin/fees", icon: CreditCard },
  { label: "Communication", href: "/admin/communication", icon: MessageSquare },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

const teacherLinks = [
  { label: "Dashboard", href: "/teacher", icon: LayoutDashboard },
  { label: "My Classes", href: "/teacher/classes", icon: BookOpen },
  { label: "Attendance", href: "/teacher/attendance", icon: Users },
  { label: "Homework", href: "/teacher/homework", icon: GraduationCap },
  { label: "Marks Entry", href: "/teacher/marks", icon: BarChart3 },
  { label: "Messages", href: "/teacher/messages", icon: MessageSquare },
  { label: "Profile", href: "/teacher/profile", icon: UserCircle },
];

const parentLinks = [
  { label: "Dashboard", href: "/parent", icon: LayoutDashboard },
  { label: "Student Profile", href: "/parent/student", icon: GraduationCap },
  { label: "Attendance", href: "/parent/attendance", icon: Users },
  { label: "Homework", href: "/parent/homework", icon: BookOpen },
  { label: "Results", href: "/parent/results", icon: BarChart3 },
  { label: "Fees", href: "/parent/fees", icon: CreditCard },
  { label: "Messages", href: "/parent/messages", icon: MessageSquare },
];

const roleLinks = {
  admin: adminLinks,
  teacher: teacherLinks,
  parent: parentLinks,
};

export function DashboardSidebar({ collapsed, onToggle, role }: DashboardSidebarProps) {
  const location = useLocation();
  const links = roleLinks[role];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary shadow-md shadow-primary/30">
              <GraduationCap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-sidebar-foreground">EduCore</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn(
            "h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent",
            collapsed && "mx-auto"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {links.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    collapsed && "justify-center px-2"
                  )}
                  title={collapsed ? link.label : undefined}
                >
                  <link.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span>{link.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="border-t border-sidebar-border p-3">
        <Link
          to="/login"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </Link>
      </div>
    </aside>
  );
}
