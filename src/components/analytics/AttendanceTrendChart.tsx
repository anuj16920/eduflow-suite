import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { SimpleCard } from "@/components/dashboard/StatsCard";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";

interface AttendanceTrendChartProps {
  attendance: any[];
}

function AttendanceTrendChartComponent({ attendance }: AttendanceTrendChartProps) {
  const data = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthly: Record<string, { present: number; absent: number; total: number }> = {};

    months.forEach((m) => (monthly[m] = { present: 0, absent: 0, total: 0 }));

    attendance.forEach((a) => {
      const m = months[new Date(a.date).getMonth()];
      if (m) {
        monthly[m].total++;
        if (a.status === "present") monthly[m].present++;
        else monthly[m].absent++;
      }
    });

    return months.map((month) => ({
      month,
      present: monthly[month].present,
      absent: monthly[month].absent,
    }));
  }, [attendance]);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
      <SimpleCard title="Monthly Attendance Statistics" description="Present vs absent student counts by month">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={2}>
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
              <Bar dataKey="present" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} name="Present" />
              <Bar dataKey="absent" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} name="Absent" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SimpleCard>
    </motion.div>
  );
}

export const AttendanceTrendChart = memo(AttendanceTrendChartComponent);
