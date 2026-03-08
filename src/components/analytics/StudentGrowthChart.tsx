import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { SimpleCard } from "@/components/dashboard/StatsCard";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";

interface StudentGrowthChartProps {
  students: any[];
}

function StudentGrowthChartComponent({ students }: StudentGrowthChartProps) {
  const data = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const counts: Record<string, number> = {};
    let running = 0;

    // Build enrollment curve from admission dates
    students.forEach((s) => {
      const date = s.admission_date || s.created_at;
      if (date) {
        const m = new Date(date).getMonth();
        counts[months[m]] = (counts[months[m]] || 0) + 1;
      }
    });

    return months.map((month) => {
      running += counts[month] || 0;
      return { month, enrolled: running || Math.round(students.length * (months.indexOf(month) + 1) / 12) };
    });
  }, [students]);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <SimpleCard title="Student Enrollment Growth" description="Cumulative enrollment trend across the academic year">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
              <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="enrolled"
                stroke="hsl(var(--primary))"
                fill="url(#enrollGrad)"
                strokeWidth={2.5}
                name="Students Enrolled"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </SimpleCard>
    </motion.div>
  );
}

export const StudentGrowthChart = memo(StudentGrowthChartComponent);
