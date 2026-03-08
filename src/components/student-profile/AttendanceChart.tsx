import { memo } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AttendanceChartProps {
  monthlyData: { month: string; present: number; absent: number; total: number }[];
  overallPercent: number;
  totalPresent: number;
  totalAbsent: number;
  totalDays: number;
}

export const AttendanceChart = memo(function AttendanceChart({
  monthlyData, overallPercent, totalPresent, totalAbsent, totalDays,
}: AttendanceChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Overall", value: `${overallPercent}%`, color: overallPercent >= 75 ? "text-emerald-600" : "text-destructive" },
          { label: "Present", value: totalPresent, color: "text-emerald-600" },
          { label: "Absent", value: totalAbsent, color: "text-destructive" },
          { label: "Total Days", value: totalDays, color: "text-foreground" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-muted/40 p-4 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{s.label}</p>
            <p className={cn("text-xl font-bold", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-xl bg-muted/30 p-4">
        <h4 className="text-sm font-semibold mb-4">Monthly Attendance</h4>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={monthlyData} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Bar dataKey="present" name="Present" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="absent" name="Absent" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
});
