import { memo } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Mail, Hash } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface StudentSummaryCardProps {
  student: {
    name: string;
    email: string;
    avatarUrl?: string | null;
    admissionNumber?: string | null;
    className?: string;
    status?: string;
  };
  stats: {
    totalMarks: number;
    maxMarks: number;
    percentage: number;
    overallGrade: string;
    subjectCount: number;
  };
}

const gradeColor: Record<string, string> = {
  "A+": "text-emerald-500",
  A: "text-emerald-500",
  "B+": "text-primary",
  B: "text-primary",
  C: "text-amber-500",
  D: "text-destructive",
  F: "text-destructive",
};

export const StudentSummaryCard = memo(function StudentSummaryCard({
  student,
  stats,
}: StudentSummaryCardProps) {
  const initials = student.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-muted/30 backdrop-blur-sm"
    >
      <div className="flex flex-col sm:flex-row items-start gap-5">
        <Avatar className="h-16 w-16 rounded-xl">
          <AvatarImage src={student.avatarUrl || undefined} />
          <AvatarFallback className="rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary text-lg font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold">{student.name}</h2>
          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" /> {student.email}
            </span>
            {student.admissionNumber && (
              <span className="inline-flex items-center gap-1">
                <Hash className="h-3.5 w-3.5" /> {student.admissionNumber}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {student.className && (
              <Badge variant="secondary" className="rounded-lg">
                <GraduationCap className="h-3 w-3 mr-1" /> {student.className}
              </Badge>
            )}
            <Badge className="bg-emerald-500/10 text-emerald-500 rounded-lg">
              {student.status || "active"}
            </Badge>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 text-center shrink-0">
          <div>
            <p className={`text-2xl font-bold ${gradeColor[stats.overallGrade] || "text-foreground"}`}>
              {stats.overallGrade}
            </p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Grade</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.percentage.toFixed(1)}%</p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Percentage</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.subjectCount}</p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Subjects</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
