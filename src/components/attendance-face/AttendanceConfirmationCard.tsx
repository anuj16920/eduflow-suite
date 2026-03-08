import { memo } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, Clock } from "lucide-react";

interface AttendanceConfirmationCardProps {
  student: {
    full_name: string;
    admission_number?: string | null;
    avatar_url?: string | null;
  };
  timestamp: string;
}

export const AttendanceConfirmationCard = memo(function AttendanceConfirmationCard({
  student, timestamp,
}: AttendanceConfirmationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="rounded-2xl bg-card border border-emerald-500/30 p-6 text-center shadow-lg shadow-emerald-500/5"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <Avatar className="h-20 w-20 border-4 border-emerald-500/30">
            <AvatarImage src={student.avatar_url || undefined} />
            <AvatarFallback className="bg-emerald-500/10 text-emerald-600 text-xl font-bold">
              {student.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-emerald-500 flex items-center justify-center"
          >
            <CalendarCheck className="h-4 w-4 text-white" />
          </motion.div>
        </div>

        <div>
          <h3 className="text-lg font-bold">{student.full_name}</h3>
          {student.admission_number && (
            <p className="text-sm text-muted-foreground font-mono">{student.admission_number}</p>
          )}
        </div>

        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
          Attendance Marked
        </Badge>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {timestamp}
        </div>
      </div>
    </motion.div>
  );
});
