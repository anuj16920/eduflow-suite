import { memo } from "react";
import { motion } from "framer-motion";
import { Mail, Hash, GraduationCap } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface StudentFeeSummaryCardProps {
  student: {
    name: string;
    email: string;
    avatarUrl?: string | null;
    admissionNumber?: string | null;
    className?: string;
  };
}

export const StudentFeeSummaryCard = memo(function StudentFeeSummaryCard({
  student,
}: StudentFeeSummaryCardProps) {
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
      <div className="flex items-center gap-5">
        <Avatar className="h-14 w-14 rounded-xl">
          <AvatarImage src={student.avatarUrl || undefined} />
          <AvatarFallback className="rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary text-lg font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h2 className="text-xl font-bold">{student.name}</h2>
          <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" /> {student.email}
            </span>
            {student.admissionNumber && (
              <span className="inline-flex items-center gap-1">
                <Hash className="h-3.5 w-3.5" /> {student.admissionNumber}
              </span>
            )}
            {student.className && (
              <Badge variant="secondary" className="rounded-lg">
                <GraduationCap className="h-3 w-3 mr-1" /> {student.className}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});
