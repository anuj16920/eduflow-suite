import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface FeeBreakdownChartProps {
  paid: number;
  pending: number;
}

export const FeeBreakdownChart = memo(function FeeBreakdownChart({
  paid,
  pending,
}: FeeBreakdownChartProps) {
  const data = useMemo(
    () => [
      { name: "Paid", value: paid, color: "hsl(160, 60%, 45%)" },
      { name: "Pending", value: Math.max(0, pending), color: "hsl(40, 80%, 50%)" },
    ],
    [paid, pending]
  );

  const total = paid + Math.max(0, pending);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
        No fee data available
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="h-64"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            dataKey="value"
            nameKey="name"
            paddingAngle={4}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Legend />
          <Tooltip
            formatter={(value: number) => `₹${value.toLocaleString()}`}
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
});
