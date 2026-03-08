import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { SimpleCard } from "@/components/dashboard/StatsCard";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from "recharts";

interface AcademicPerformanceChartProps {
  marks: any[];
}

function AcademicPerformanceChartComponent({ marks }: AcademicPerformanceChartProps) {
  const data = useMemo(() => {
    const subjectMap: Record<string, { total: number; count: number; name: string }> = {};

    marks.forEach((m) => {
      const name = m.subjects?.name || "Unknown";
      if (!subjectMap[name]) subjectMap[name] = { total: 0, count: 0, name };
      subjectMap[name].total += Number(m.marks_obtained || 0);
      subjectMap[name].count += 1;
    });

    return Object.values(subjectMap)
      .map((s) => ({
        subject: s.name.length > 10 ? s.name.slice(0, 10) + "…" : s.name,
        average: Math.round(s.total / s.count),
        fullName: s.name,
      }))
      .sort((a, b) => b.average - a.average);
  }, [marks]);

  const getBarColor = (avg: number) => {
    if (avg >= 80) return "hsl(var(--success))";
    if (avg >= 60) return "hsl(var(--primary))";
    if (avg >= 40) return "hsl(var(--warning))";
    return "hsl(var(--destructive))";
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
      <SimpleCard title="Average Subject Performance" description="Mean marks by subject across all exams">
        {data.length === 0 ? (
          <div className="h-72 flex items-center justify-center text-muted-foreground text-sm">
            No marks data available yet
          </div>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis type="category" dataKey="subject" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [`${value}%`, "Average"]}
                />
                <Bar dataKey="average" radius={[0, 6, 6, 0]} name="Average Marks">
                  {data.map((entry, i) => (
                    <Cell key={i} fill={getBarColor(entry.average)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </SimpleCard>
    </motion.div>
  );
}

export const AcademicPerformanceChart = memo(AcademicPerformanceChartComponent);
