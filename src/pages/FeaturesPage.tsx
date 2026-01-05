import { motion } from "framer-motion";
import {
  Shield,
  Users,
  GraduationCap,
  BookOpen,
  CreditCard,
  MessageSquare,
  BarChart3,
  Calendar,
  Bell,
  FileText,
  Settings,
  Globe,
} from "lucide-react";

const featureCategories = [
  {
    icon: Shield,
    title: "Admin Management",
    description: "Complete administrative control with powerful tools",
    features: [
      "Role-based access control",
      "Staff management & scheduling",
      "Academic year configuration",
      "Branch & department management",
      "Audit logs & activity tracking",
    ],
  },
  {
    icon: Users,
    title: "Teacher Portal",
    description: "Empowering educators with smart tools",
    features: [
      "Class & timetable management",
      "Attendance marking",
      "Homework & assignment upload",
      "Grade entry & report cards",
      "Parent communication",
    ],
  },
  {
    icon: GraduationCap,
    title: "Parent Portal",
    description: "Keep parents connected and informed",
    features: [
      "Real-time attendance alerts",
      "Homework & progress tracking",
      "Fee payment & receipts",
      "Direct messaging with teachers",
      "Event notifications",
    ],
  },
  {
    icon: BookOpen,
    title: "Academic Management",
    description: "Comprehensive curriculum and exam management",
    features: [
      "Curriculum planning",
      "Exam scheduling & grading",
      "Report card generation",
      "Study material distribution",
      "Performance analytics",
    ],
  },
  {
    icon: CreditCard,
    title: "Fees & Accounts",
    description: "Streamlined financial management",
    features: [
      "Fee structure configuration",
      "Installment plans",
      "Online payment gateway",
      "Receipt generation",
      "Financial reports & analytics",
    ],
  },
  {
    icon: MessageSquare,
    title: "Communication Hub",
    description: "Seamless multi-channel communication",
    features: [
      "Announcements & notices",
      "SMS & email notifications",
      "Push notifications",
      "Parent-teacher messaging",
      "Event reminders",
    ],
  },
  {
    icon: BarChart3,
    title: "Reports & Analytics",
    description: "Data-driven insights for better decisions",
    features: [
      "Attendance reports",
      "Academic performance charts",
      "Fee collection analytics",
      "Custom report builder",
      "Export to PDF/Excel",
    ],
  },
  {
    icon: Calendar,
    title: "Timetable & Calendar",
    description: "Efficient scheduling and planning",
    features: [
      "Class timetable builder",
      "Teacher schedule management",
      "Event calendar",
      "Exam schedule",
      "Holiday calendar",
    ],
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Keep everyone informed in real-time",
    features: [
      "Real-time push notifications",
      "Email & SMS alerts",
      "Custom notification rules",
      "Attendance alerts",
      "Fee due reminders",
    ],
  },
  {
    icon: FileText,
    title: "Document Management",
    description: "Centralized document storage and access",
    features: [
      "Secure document storage",
      "Student records management",
      "Certificate generation",
      "Digital signatures",
      "Document sharing",
    ],
  },
  {
    icon: Settings,
    title: "Settings & Configuration",
    description: "Customize the platform to your needs",
    features: [
      "School profile setup",
      "Grade system configuration",
      "Academic year settings",
      "Role permissions",
      "Branding customization",
    ],
  },
  {
    icon: Globe,
    title: "Multi-Branch Support",
    description: "Manage multiple campuses efficiently",
    features: [
      "Centralized dashboard",
      "Branch-wise reports",
      "Inter-branch transfers",
      "Unified fee management",
      "Cross-campus communication",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="py-20 md:py-32">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful Features for Modern Schools
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover all the tools you need to run your school efficiently,
            from admissions to alumni management.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
                <category.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {category.description}
              </p>
              <ul className="space-y-2">
                {category.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
