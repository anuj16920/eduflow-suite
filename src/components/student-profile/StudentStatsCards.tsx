import { memo } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, BookOpen, FileCheck, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentStatsCardsProps {
  attendancePercent: number;
  subjectsEnrolled: number;
  assignmentsCompleted: number;
  upcomingExams: number;
}

const cards = [
  { key: "attendance", label: "Attendance", icon: CalendarCheck, suffix: "%", color: "from-emerald-500/20 to-emerald-500/5", text: "text-emerald-600" },
  { key: "subjects", label: "Subjects", icon: BookOpen, suffix: "", color: "from-primary/20 to-primary/5", text: "text-primary" },
  { key: "assignments", label: "Assignments Done", icon: FileCheck, suffix: "", color: "from-amber-500/20 to-amber-500/5", text: "text-amber-600" },
  { key: "exams", label: "Upcoming Exams", icon: ClipboardList, suffix: "", color: "from-violet-500/20 to-violet-500/5", text: "text-violet-600" },
] as const;

export const StudentStatsCards = memo(function StudentStatsCards(props: StudentStatsCardsProps) {
  const values: Record<string, number> = {
    attendance: props.attendancePercent,
    subjects: props.subjectsEnrolled,
    assignments: props.assignmentsCompleted,
    exams: props.upcomingExams,
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <motion.div
            key={c.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={cn(
              "p-5 rounded-2xl bg-gradient-to-br backdrop-blur-sm",
              c.color,
              "hover:shadow-lg transition-shadow"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center bg-gradient-to-br", c.color)}>
                <Icon className={cn("h-5 w-5", c.text)} />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{c.label}</p>
                <p className={cn("text-2xl font-bold tracking-tight", c.text)}>
                  {values[c.key]}{c.suffix}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
});
