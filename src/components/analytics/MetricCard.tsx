import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  variant?: "default" | "primary" | "success" | "warning";
  loading?: boolean;
  index?: number;
}

const variantStyles = {
  default: {
    bg: "from-primary/15 to-primary/5",
    icon: "text-primary",
    iconBg: "from-primary/20 to-primary/5",
  },
  primary: {
    bg: "from-primary/20 to-accent/10",
    icon: "text-primary",
    iconBg: "from-primary/25 to-accent/10",
  },
  success: {
    bg: "from-emerald-500/15 to-emerald-500/5",
    icon: "text-emerald-500",
    iconBg: "from-emerald-500/20 to-emerald-500/5",
  },
  warning: {
    bg: "from-amber-500/15 to-amber-500/5",
    icon: "text-amber-500",
    iconBg: "from-amber-500/20 to-amber-500/5",
  },
};

function MetricCardComponent({ title, value, icon: Icon, trend, variant = "default", loading, index = 0 }: MetricCardProps) {
  const styles = variantStyles[variant];

  if (loading) {
    return (
      <div className="p-5 rounded-2xl bg-muted/30">
        <Skeleton className="h-11 w-11 rounded-xl mb-3" />
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-8 w-16" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        "group relative p-5 rounded-2xl bg-gradient-to-br backdrop-blur-sm",
        "transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/5",
        styles.bg
      )}
    >
      <div className={cn(
        "flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br mb-3",
        styles.iconBg,
        "group-hover:scale-110 transition-transform duration-300"
      )}>
        <Icon className={cn("h-5 w-5", styles.icon)} />
      </div>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
        {title}
      </p>
      <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
      {trend && (
        <div className="mt-2 flex items-center gap-1.5">
          {trend.positive ? (
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-red-500" />
          )}
          <span className={cn("text-xs font-semibold", trend.positive ? "text-emerald-500" : "text-red-500")}>
            {trend.value}
          </span>
          <span className="text-xs text-muted-foreground">vs last year</span>
        </div>
      )}
    </motion.div>
  );
}

export const MetricCard = memo(MetricCardComponent);
