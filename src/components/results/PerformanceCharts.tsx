import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import type { MarkRow } from "./MarksTable";

const GRADE_COLORS: Record<string, string> = {
  "A+": "hsl(160, 60%, 45%)",
  A: "hsl(160, 50%, 50%)",
  "B+": "hsl(220, 70%, 55%)",
  B: "hsl(220, 60%, 60%)",
  C: "hsl(40, 80%, 50%)",
  D: "hsl(0, 70%, 55%)",
  F: "hsl(0, 60%, 45%)",
};

export const PerformanceCharts = memo(function PerformanceCharts({
  marks,
}: {
  marks: MarkRow[];
}) {
  const barData = useMemo(
    () =>
      marks.map((m) => ({
        subject: m.subjectName.length > 12 ? m.subjectName.slice(0, 12) + "…" : m.subjectName,
        marks: m.marksObtained,
        max: m.maxMarks,
      })),
    [marks]
  );

  const donutData = useMemo(() => {
    const counts: Record<string, number> = {};
    marks.forEach((m) => {
      counts[m.grade] = (counts[m.grade] || 0) + 1;
    });
    return Object.entries(counts).map(([grade, count]) => ({
      name: grade,
      value: count,
      color: GRADE_COLORS[grade] || "hsl(var(--muted))",
    }));
  }, [marks]);

  if (marks.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No data to visualize.
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-2xl bg-muted/30"
      >
        <h4 className="font-semibold mb-4">Subject Performance</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="subject" className="text-xs" tick={{ fontSize: 10 }} />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="marks" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Marks" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Donut Chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-5 rounded-2xl bg-muted/30"
      >
        <h4 className="font-semibold mb-4">Grade Distribution</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
                nameKey="name"
                paddingAngle={3}
              >
                {donutData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
});
