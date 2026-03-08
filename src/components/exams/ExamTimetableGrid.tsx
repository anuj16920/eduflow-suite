import { memo, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { ExamCardData } from "./UpcomingExamCards";

type SortKey = "subjectName" | "examDate" | "startTime";

export const ExamTimetableGrid = memo(function ExamTimetableGrid({
  exams,
}: {
  exams: ExamCardData[];
}) {
  const [sortKey, setSortKey] = useState<SortKey>("examDate");
  const [sortAsc, setSortAsc] = useState(true);

  const sorted = useMemo(() => {
    return [...exams].sort((a, b) => {
      const av = a[sortKey] || "";
      const bv = b[sortKey] || "";
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [exams, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const statusColors: Record<string, string> = {
    upcoming: "bg-amber-500/10 text-amber-500",
    ongoing: "bg-primary/10 text-primary",
    completed: "bg-emerald-500/10 text-emerald-500",
  };

  if (exams.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50">
            {[
              { key: "subjectName" as SortKey, label: "Subject" },
              { key: "examDate" as SortKey, label: "Date" },
              { key: "startTime" as SortKey, label: "Time" },
            ].map((col) => (
              <th
                key={col.key}
                className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                onClick={() => toggleSort(col.key)}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  <ArrowUpDown className="h-3 w-3" />
                </span>
              </th>
            ))}
            <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Room</th>
            <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Max Marks</th>
            <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((exam, i) => (
            <motion.tr
              key={exam.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.02 }}
              className="border-b border-border/30 hover:bg-muted/30 transition-colors"
            >
              <td className="px-4 py-3 font-medium">
                {exam.subjectName}
                <span className="block text-xs text-muted-foreground">{exam.subjectCode}</span>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {format(new Date(exam.examDate), "MMM d, yyyy")}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {exam.startTime || "—"}{exam.endTime ? ` – ${exam.endTime}` : ""}
              </td>
              <td className="px-4 py-3 text-muted-foreground">{exam.room || "TBA"}</td>
              <td className="px-4 py-3 text-muted-foreground">{exam.maxMarks ?? "—"}</td>
              <td className="px-4 py-3">
                <Badge className={statusColors[exam.status || "upcoming"]}>{exam.status}</Badge>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
