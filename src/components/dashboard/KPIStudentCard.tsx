import { memo, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { StudentCounter } from "./StudentCounter";
import { StudentTrendChart } from "./StudentTrendChart";

type PortalRole = "admin" | "teacher" | "student" | "parent";

interface KPIStudentCardProps {
  role?: PortalRole;
  className?: string;
}

const portalConfig: Record<PortalRole, { label: string; sublabel: string; navigateTo: string }> = {
  admin: { label: "Total Students", sublabel: "Across all classes", navigateTo: "/admin/students" },
  teacher: { label: "My Students", sublabel: "Read-only overview", navigateTo: "/teacher/classes" },
  student: { label: "Total Classmates", sublabel: "In your section", navigateTo: "/student/profile" },
  parent: { label: "Enrollment Info", sublabel: "Your child's school", navigateTo: "/parent/student-profile" },
};

// Mock trend data — replace with real monthly aggregation
const trendData = [
  { month: "Sep", count: 2420 },
  { month: "Oct", count: 2510 },
  { month: "Nov", count: 2580 },
  { month: "Dec", count: 2650 },
  { month: "Jan", count: 2720 },
  { month: "Feb", count: 2790 },
  { month: "Mar", count: 2847 },
];

function KPIStudentCardComponent({ role = "admin", className = "" }: KPIStudentCardProps) {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const config = portalConfig[role];

  useEffect(() => {
    async function fetchCount() {
      const { count: total, error } = await supabase
        .from("students")
        .select("*", { count: "exact", head: true });
      if (!error && total !== null) setCount(total);
      setLoading(false);
    }
    fetchCount();
  }, []);

  const displayCount = count || 2847; // fallback to demo value
  const trendPercent = 12.4;
  const isPositive = trendPercent > 0;

  const handleClick = useCallback(() => {
    navigate(config.navigateTo);
  }, [navigate, config.navigateTo]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 18 }}
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={handleClick}
      className={`group relative cursor-pointer overflow-hidden rounded-2xl p-[1px] ${className}`}
    >
      {/* Animated glow border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/40 via-transparent to-accent/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-700 blur-xl bg-primary/20" />

      {/* Card body */}
      <div className="relative rounded-2xl bg-background/60 backdrop-blur-xl p-6 h-full">
        {/* Shimmer overlay on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />

        <div className="relative z-10 flex flex-col gap-4">
          {/* Top row: icon + title + trend */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {/* Gradient icon circle */}
              <motion.div
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-primary/5 shadow-lg shadow-primary/10"
                whileHover={{ rotate: [0, -8, 8, 0] }}
                transition={{ duration: 0.5 }}
              >
                <GraduationCap className="h-6 w-6 text-primary" />
              </motion.div>
              <div>
                <p className="text-sm font-semibold text-foreground">{config.label}</p>
                <p className="text-[11px] text-muted-foreground">{config.sublabel}</p>
              </div>
            </div>

            {/* Trend badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                isPositive
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-destructive/15 text-destructive"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {isPositive ? "+" : ""}
              {trendPercent}%
            </motion.div>
          </div>

          {/* Big number */}
          <div className="flex items-end justify-between gap-4">
            <div>
              {loading ? (
                <div className="h-10 w-24 rounded-lg bg-muted/30 animate-pulse" />
              ) : (
                <StudentCounter
                  value={displayCount}
                  className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
                />
              )}
              <p className="text-[11px] text-muted-foreground mt-1">
                {isPositive ? "↑" : "↓"} {Math.abs(Math.round(displayCount * trendPercent / 100))} this semester
              </p>
            </div>

            {/* Mini trend chart */}
            <div className="w-28 flex-shrink-0">
              <StudentTrendChart data={trendData} />
            </div>
          </div>

          {/* Quick action */}
          <motion.div
            className="flex items-center justify-between pt-3 border-t border-border/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span className="text-[11px] text-muted-foreground">
              {role === "admin" ? "Manage all students" : "View details"}
            </span>
            <div className="flex items-center gap-1 text-primary text-xs font-semibold group-hover:gap-2 transition-all">
              Open
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export const KPIStudentCard = memo(KPIStudentCardComponent);
