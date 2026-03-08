import { memo } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";

export interface ExamCardData {
  id: string;
  subjectName: string;
  subjectCode: string | null;
  examDate: string;
  startTime: string | null;
  endTime: string | null;
  room: string | null;
  maxMarks: number | null;
  examName: string;
  examType: string | null;
  status: string | null;
  className: string;
}

const statusColors: Record<string, string> = {
  upcoming: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  ongoing: "bg-primary/10 text-primary border-primary/20",
  completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
};

export const UpcomingExamCards = memo(function UpcomingExamCards({
  exams,
}: {
  exams: ExamCardData[];
}) {
  if (exams.length === 0) {
    return (
      <div className="text-center py-16">
        <BookOpen className="h-14 w-14 mx-auto text-muted-foreground/20 mb-4" />
        <p className="text-muted-foreground font-medium">No exams found</p>
        <p className="text-sm text-muted-foreground/60">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {exams.map((exam, i) => (
        <Tooltip key={exam.id}>
          <TooltipTrigger asChild>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              whileHover={{ y: -4, transition: { duration: 0.15 } }}
              className="group p-5 rounded-2xl bg-muted/30 hover:bg-muted/50 backdrop-blur-sm transition-colors cursor-default"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold truncate">{exam.subjectName}</h4>
                    <p className="text-xs text-muted-foreground">{exam.subjectCode}</p>
                  </div>
                </div>
                <Badge variant="outline" className={statusColors[exam.status || "upcoming"]}>
                  {exam.status}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{format(new Date(exam.examDate), "EEE, MMM d yyyy")}</span>
                </div>
                {exam.startTime && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{exam.startTime}{exam.endTime ? ` – ${exam.endTime}` : ""}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-1">
                  <Badge variant="secondary" className="text-xs">{exam.className}</Badge>
                  {exam.maxMarks && (
                    <span className="text-xs text-muted-foreground">Max: {exam.maxMarks}</span>
                  )}
                </div>
              </div>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" />
              <span>{exam.room || "Room TBA"}</span>
            </div>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
});
