import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronDown,
  Calendar,
  ClipboardList,
  FileText,
  Building2,
  Bus,
  UtensilsCrossed,
  Megaphone,
  BookOpenCheck,
  Monitor,
  UserCheck,
  Clock,
  Bell,
  Home,
  Briefcase,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItem {
  label: string;
  href?: string;
  icon: any;
  children?: { label: string; href: string }[];
}

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  role: "admin" | "teacher" | "student" | "parent";
}

const adminLinks: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  {
    label: "Student Management",
    icon: GraduationCap,
    children: [
      { label: "All Students", href: "/admin/students" },
      { label: "Admissions", href: "/admin/students?tab=admissions" },
      { label: "Promotions", href: "/admin/students?tab=promotions" },
    ],
  },
  {
    label: "Staff Management",
    icon: Briefcase,
    children: [
      { label: "Teachers", href: "/admin/teachers" },
      { label: "Parents", href: "/admin/parents" },
    ],
  },
  {
    label: "Academics",
    icon: BookOpen,
    children: [
      { label: "Class Groups", href: "/admin/academics" },
      { label: "Timetable", href: "/admin/academics?tab=timetable" },
      { label: "Subjects", href: "/admin/academics?tab=subjects" },
    ],
  },
  {
    label: "Examinations",
    icon: ClipboardList,
    children: [
      { label: "Exams", href: "/admin/academics?tab=exams" },
      { label: "Report Cards", href: "/admin/reports" },
    ],
  },
  { label: "Fees & Accounts", href: "/admin/fees", icon: CreditCard },
  { label: "Hostel Management", href: "/admin/hostel", icon: Building2 },
  { label: "Transport", href: "/admin/transport", icon: Bus },
  { label: "Cafeteria", href: "/admin/cafeteria", icon: UtensilsCrossed },
  { label: "Announcements", href: "/admin/communication", icon: Megaphone },
  { label: "Homework", href: "/admin/homework", icon: BookOpenCheck },
  { label: "E-Learning", href: "/admin/elearning", icon: Monitor },
  { label: "Attendance", href: "/admin/attendance", icon: UserCheck },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

const teacherLinks: NavItem[] = [
  { label: "Dashboard", href: "/teacher", icon: LayoutDashboard },
  { label: "My Classes", href: "/teacher/classes", icon: BookOpen },
  { label: "Timetable", href: "/teacher/timetable", icon: Calendar },
  { label: "Attendance", href: "/teacher/attendance", icon: UserCheck },
  { label: "Homework", href: "/teacher/homework", icon: BookOpenCheck },
  { label: "Marks Entry", href: "/teacher/marks", icon: BarChart3 },
  { label: "E-Learning", href: "/teacher/elearning", icon: Monitor },
  { label: "Announcements", href: "/teacher/announcements", icon: Megaphone },
  { label: "Messages", href: "/teacher/messages", icon: MessageSquare },
  { label: "Profile", href: "/teacher/profile", icon: UserCircle },
];

const parentLinks: NavItem[] = [
  { label: "Dashboard", href: "/parent", icon: LayoutDashboard },
  { label: "Student Profile", href: "/parent/student", icon: GraduationCap },
  { label: "Attendance", href: "/parent/attendance", icon: UserCheck },
  { label: "Homework", href: "/parent/homework", icon: BookOpenCheck },
  { label: "Results", href: "/parent/results", icon: Trophy },
  { label: "Timetable", href: "/parent/timetable", icon: Calendar },
  { label: "Fees", href: "/parent/fees", icon: CreditCard },
  { label: "E-Learning", href: "/parent/elearning", icon: Monitor },
  { label: "Messages", href: "/parent/messages", icon: MessageSquare },
];

const studentLinks: NavItem[] = [
  { label: "Dashboard", href: "/student", icon: LayoutDashboard },
  { label: "Timetable", href: "/student/timetable", icon: Calendar },
  { label: "Attendance", href: "/student/attendance", icon: UserCheck },
  { label: "Homework", href: "/student/homework", icon: BookOpenCheck },
  { label: "Results", href: "/student/results", icon: Trophy },
  { label: "Fees", href: "/student/fees", icon: CreditCard },
  { label: "E-Learning", href: "/student/elearning", icon: Monitor },
  { label: "Announcements", href: "/student/announcements", icon: Megaphone },
  { label: "Profile", href: "/student/profile", icon: UserCircle },
];

const roleLinks = {
  admin: adminLinks,
  teacher: teacherLinks,
  parent: parentLinks,
  student: studentLinks,
};

function SidebarNavItem({
  item,
  collapsed,
  pathname,
}: {
  item: NavItem;
  collapsed: boolean;
  pathname: string;
}) {
  const hasChildren = item.children && item.children.length > 0;
  const isChildActive = hasChildren
    ? item.children!.some((c) => pathname === c.href || pathname.startsWith(c.href.split("?")[0]))
    : false;
  const isActive = item.href ? pathname === item.href : isChildActive;
  const [open, setOpen] = useState(isChildActive);

  if (hasChildren && !collapsed) {
    return (
      <li>
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors w-full",
            isActive
              ? "bg-sidebar-primary/10 text-sidebar-primary-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
        >
          <item.icon className="h-5 w-5 flex-shrink-0" />
          <span className="flex-1 text-left">{item.label}</span>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4 opacity-60" />
          </motion.div>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden ml-4 mt-1 space-y-0.5 border-l-2 border-sidebar-border pl-3"
            >
              {item.children!.map((child) => {
                const childActive = pathname === child.href || pathname.startsWith(child.href.split("?")[0]);
                return (
                  <li key={child.href}>
                    <Link
                      to={child.href}
                      className={cn(
                        "flex items-center rounded-md px-3 py-2 text-sm transition-colors",
                        childActive
                          ? "text-primary font-medium bg-primary/5"
                          : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                      )}
                    >
                      {child.label}
                    </Link>
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </li>
    );
  }

  const linkContent = (
    <Link
      to={item.href || "#"}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-sidebar-primary text-sidebar-primary-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        collapsed && "justify-center px-2"
      )}
      title={collapsed ? item.label : undefined}
    >
      <item.icon className="h-5 w-5 flex-shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );

  if (collapsed) {
    return (
      <li>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {item.label}
          </TooltipContent>
        </Tooltip>
      </li>
    );
  }

  return <li>{linkContent}</li>;
}

export function DashboardSidebar({ collapsed, onToggle, role }: DashboardSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const links = roleLinks[role];

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 z-40 h-screen border-r border-sidebar-border bg-sidebar flex flex-col"
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Link to="/" className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary shadow-md shadow-primary/30">
                  <GraduationCap className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-sidebar-foreground">EduCore</span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
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

      {/* Role Badge */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-sidebar-border">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary/10">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold text-primary capitalize">{role} Portal</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 py-3 px-3">
        <ul className="space-y-1">
          {links.map((link) => (
            <SidebarNavItem
              key={link.label}
              item={link}
              collapsed={collapsed}
              pathname={location.pathname}
            />
          ))}
        </ul>
      </ScrollArea>

      {/* Logout */}
      <div className="border-t border-sidebar-border p-3">
        {collapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center rounded-lg px-2 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full"
              >
                <LogOut className="h-5 w-5 flex-shrink-0" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Logout</TooltipContent>
          </Tooltip>
        ) : (
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span>Logout</span>
          </button>
        )}
      </div>
    </motion.aside>
  );
}
