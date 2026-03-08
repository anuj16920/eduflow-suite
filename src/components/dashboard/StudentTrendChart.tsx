import { memo, lazy, Suspense } from "react";
import { motion } from "framer-motion";

const LazyChart = lazy(() =>
  import("recharts").then((mod) => {
    const { ResponsiveContainer, AreaChart, Area, Tooltip } = mod;
    
    function TrendChart({ data }: { data: { month: string; count: number }[] }) {
      return (
        <ResponsiveContainer width="100%" height={60}>
          <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="studentTrend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(24, 100%, 50%)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(24, 100%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip
              contentStyle={{
                background: "hsl(0 0% 10% / 0.9)",
                border: "1px solid hsl(24 100% 50% / 0.3)",
                borderRadius: "12px",
                fontSize: "12px",
                backdropFilter: "blur(12px)",
                color: "white",
              }}
              labelStyle={{ color: "hsl(24, 100%, 50%)" }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="hsl(24, 100%, 50%)"
              strokeWidth={2}
              fill="url(#studentTrend)"
              animationDuration={2000}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      );
    }
    
    return { default: TrendChart };
  })
);

interface StudentTrendChartProps {
  data: { month: string; count: number }[];
}

function StudentTrendChartComponent({ data }: StudentTrendChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="w-full"
    >
      <Suspense
        fallback={
          <div className="h-[60px] w-full rounded-xl bg-muted/20 animate-pulse" />
        }
      >
        <LazyChart data={data} />
      </Suspense>
    </motion.div>
  );
}

export const StudentTrendChart = memo(StudentTrendChartComponent);
