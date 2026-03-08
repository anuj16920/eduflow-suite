import { memo } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, BookOpen, User, Paperclip } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { format, isPast, isToday } from "date-fns";

export interface HomeworkCardData {
  id: string;
  title: string;
  description: string | null;
  subjectName: string;
  className: string;
  teacherName: string;
  dueDate: string;
  createdAt: string;
  status: string | null;
  attachmentUrl: string | null;
  submissionCount: number;
}

const statusStyles: Record<string, string> = {
  active: "bg-primary/10 text-primary border-primary/20",
  completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  overdue: "bg-destructive/10 text-destructive border-destructive/20",
};

function getEffectiveStatus(hw: HomeworkCardData): string {
  if (hw.status === "completed") return "completed";
  if (isPast(new Date(hw.dueDate)) && !isToday(new Date(hw.dueDate))) return "overdue";
  return "active";
}

export const HomeworkAssignmentCard = memo(function HomeworkAssignmentCard({
  homework,
  index,
  onClick,
}: {
  homework: HomeworkCardData;
  index: number;
  onClick: () => void;
}) {
  const effectiveStatus = getEffectiveStatus(homework);
  const dueDate = new Date(homework.dueDate);
  const isOverdue = effectiveStatus === "overdue";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04, duration: 0.3 }}
          whileHover={{ y: -4, transition: { duration: 0.15 } }}
          onClick={onClick}
          className="group p-5 rounded-2xl bg-muted/30 hover:bg-muted/50 backdrop-blur-sm transition-colors cursor-pointer"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold truncate">{homework.title}</h4>
                <p className="text-xs text-muted-foreground">{homework.subjectName}</p>
              </div>
            </div>
            <Badge variant="outline" className={statusStyles[effectiveStatus]}>
              {effectiveStatus}
            </Badge>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              <span className="truncate">{homework.teacherName}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span className={isOverdue ? "text-destructive font-medium" : ""}>
                Due: {format(dueDate, "EEE, MMM d yyyy")}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <Badge variant="secondary" className="text-xs">{homework.className}</Badge>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {homework.attachmentUrl && <Paperclip className="h-3 w-3" />}
                <span>{homework.submissionCount} submissions</span>
              </div>
            </div>
          </div>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p className="text-sm">{homework.description || "No description provided"}</p>
      </TooltipContent>
    </Tooltip>
  );
});

export { getEffectiveStatus };
