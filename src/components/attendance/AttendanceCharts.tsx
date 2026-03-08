import { memo } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

interface AttendanceChartsProps {
  monthlyTrend: { month: string; percentage: number }[];
  breakdown: { present: number; absent: number; late: number };
}

const PIE_COLORS = ["hsl(142, 76%, 36%)", "hsl(0, 84%, 60%)", "hsl(38, 92%, 50%)"];

export const AttendanceCharts = memo(function AttendanceCharts({ monthlyTrend, breakdown }: AttendanceChartsProps) {
  const pieData = [
    { name: "Present", value: breakdown.present },
    { name: "Absent", value: breakdown.absent },
    { name: "Late", value: breakdown.late },
  ].filter((d) => d.value > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Trend chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-2xl bg-card border border-border/50 p-6"
      >
        <h4 className="text-sm font-semibold mb-4">Monthly Attendance Trend</h4>
        {monthlyTrend.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(v: number) => [`${v}%`, "Attendance"]}
              />
              <Line
                type="monotone"
                dataKey="percentage"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "hsl(var(--primary))" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* Donut chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-2xl bg-card border border-border/50 p-6"
      >
        <h4 className="text-sm font-semibold mb-4">Status Breakdown</h4>
        {pieData.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">No data available</div>
        ) : (
          <div className="flex items-center justify-center gap-6">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {[
                { label: "Present", value: breakdown.present, color: PIE_COLORS[0] },
                { label: "Absent", value: breakdown.absent, color: PIE_COLORS[1] },
                { label: "Late", value: breakdown.late, color: PIE_COLORS[2] },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-semibold ml-auto">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
});
