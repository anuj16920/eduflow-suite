import { memo } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MarkRow {
  subject: string;
  marks_obtained: number | null;
  max_marks: number | null;
  grade: string | null;
  exam_name: string;
}

interface ResultsTableProps {
  marks: MarkRow[];
}

function gradeColor(grade: string | null) {
  if (!grade) return "bg-muted text-muted-foreground";
  const g = grade.toUpperCase();
  if (g === "A+" || g === "A") return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
  if (g === "B+" || g === "B") return "bg-primary/10 text-primary border-primary/20";
  if (g === "C+" || g === "C") return "bg-amber-500/10 text-amber-600 border-amber-500/20";
  return "bg-destructive/10 text-destructive border-destructive/20";
}

export const ResultsTable = memo(function ResultsTable({ marks }: ResultsTableProps) {
  if (marks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No exam results available yet</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="overflow-x-auto rounded-xl border border-border/50"
    >
      <table className="w-full text-sm">
        <thead className="bg-muted/80">
          <tr className="border-b border-border">
            <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subject</th>
            <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Exam</th>
            <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Marks</th>
            <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Percentage</th>
            <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Grade</th>
          </tr>
        </thead>
        <tbody>
          {marks.map((m, i) => {
            const pct = m.max_marks ? Math.round(((m.marks_obtained || 0) / m.max_marks) * 100) : 0;
            return (
              <motion.tr
                key={`${m.subject}-${m.exam_name}-${i}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
                className="border-b border-border/50 hover:bg-muted/30 transition-colors"
              >
                <td className="py-3 px-4 font-medium">{m.subject}</td>
                <td className="py-3 px-4 text-muted-foreground">{m.exam_name}</td>
                <td className="py-3 px-4 text-center font-mono">
                  {m.marks_obtained ?? "—"} / {m.max_marks ?? "—"}
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn("h-full rounded-full", pct >= 75 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-destructive")}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{pct}%</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <Badge variant="outline" className={cn("text-xs", gradeColor(m.grade))}>
                    {m.grade || "—"}
                  </Badge>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </motion.div>
  );
});
