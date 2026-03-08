import { memo, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface MarkRow {
  id: string;
  subjectName: string;
  subjectCode: string | null;
  marksObtained: number;
  maxMarks: number;
  grade: string;
  examName: string;
}

const gradeColors: Record<string, string> = {
  "A+": "bg-emerald-500/10 text-emerald-500",
  A: "bg-emerald-500/10 text-emerald-500",
  "B+": "bg-primary/10 text-primary",
  B: "bg-primary/10 text-primary",
  C: "bg-amber-500/10 text-amber-500",
  D: "bg-destructive/10 text-destructive",
  F: "bg-destructive/10 text-destructive",
};

type SortKey = "subjectName" | "marksObtained" | "grade";

export const MarksTable = memo(function MarksTable({ marks }: { marks: MarkRow[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("subjectName");
  const [sortAsc, setSortAsc] = useState(true);

  const sorted = useMemo(() => {
    return [...marks].sort((a, b) => {
      const av = sortKey === "marksObtained" ? a.marksObtained : a[sortKey];
      const bv = sortKey === "marksObtained" ? b.marksObtained : b[sortKey];
      if (typeof av === "number" && typeof bv === "number") {
        return sortAsc ? av - bv : bv - av;
      }
      return sortAsc ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
  }, [marks, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  // Totals
  const totalObtained = marks.reduce((s, m) => s + m.marksObtained, 0);
  const totalMax = marks.reduce((s, m) => s + m.maxMarks, 0);

  if (marks.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No marks data available for this selection.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl">
      <table className="w-full text-sm">
        <thead className="sticky top-0 z-10 bg-muted/60 backdrop-blur-sm">
          <tr className="border-b border-border/50">
            {[
              { key: "subjectName" as SortKey, label: "Subject" },
              { key: "marksObtained" as SortKey, label: "Marks" },
              { key: "grade" as SortKey, label: "Grade" },
            ].map((col) => (
              <th
                key={col.key}
                className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                onClick={() => toggleSort(col.key)}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label} <ArrowUpDown className="h-3 w-3" />
                </span>
              </th>
            ))}
            <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Percentage
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((m, i) => {
            const pct = m.maxMarks > 0 ? ((m.marksObtained / m.maxMarks) * 100).toFixed(1) : "0";
            return (
              <motion.tr
                key={m.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className="border-b border-border/30 hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3 font-medium">
                  {m.subjectName}
                  <span className="block text-xs text-muted-foreground">{m.subjectCode}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-semibold">{m.marksObtained}</span>
                  <span className="text-muted-foreground">/{m.maxMarks}</span>
                </td>
                <td className="px-4 py-3">
                  <Badge className={gradeColors[m.grade] || "bg-muted text-foreground"}>
                    {m.grade}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{pct}%</td>
              </motion.tr>
            );
          })}
          {/* Total row */}
          <tr className="bg-muted/40 font-semibold">
            <td className="px-4 py-3">Total</td>
            <td className="px-4 py-3">{totalObtained}/{totalMax}</td>
            <td className="px-4 py-3" />
            <td className="px-4 py-3">
              {totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(1) : "0"}%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});
