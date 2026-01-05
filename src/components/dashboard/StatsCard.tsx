import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    positive: boolean;
  };
  icon: LucideIcon;
  variant?: "default" | "primary" | "success" | "warning" | "destructive";
  className?: string;
}

const variantStyles = {
  default: "bg-card",
  primary: "gradient-primary text-primary-foreground",
  success: "gradient-success text-success-foreground",
  warning: "gradient-warning text-warning-foreground",
  destructive: "bg-destructive text-destructive-foreground",
};

const iconVariantStyles = {
  default: "bg-primary/10 text-primary",
  primary: "bg-primary-foreground/20 text-primary-foreground",
  success: "bg-success-foreground/20 text-success-foreground",
  warning: "bg-warning-foreground/20 text-warning-foreground",
  destructive: "bg-destructive-foreground/20 text-destructive-foreground",
};

export function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  variant = "default",
  className,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-xl p-6 shadow-card border border-border/50",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className={cn(
            "text-sm font-medium",
            variant === "default" ? "text-muted-foreground" : "opacity-80"
          )}>
            {title}
          </p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {change && (
            <p className={cn(
              "text-xs font-medium flex items-center gap-1",
              variant === "default"
                ? change.positive
                  ? "text-success"
                  : "text-destructive"
                : "opacity-80"
            )}>
              {change.positive ? "↑" : "↓"} {change.value}
              <span className="opacity-70">from last month</span>
            </p>
          )}
        </div>
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl",
          iconVariantStyles[variant]
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
}

interface SimpleCardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
}

export function SimpleCard({
  title,
  description,
  children,
  className,
  headerAction,
}: SimpleCardProps) {
  return (
    <div className={cn(
      "rounded-xl border border-border bg-card shadow-card",
      className
    )}>
      {(title || headerAction) && (
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            {title && <h3 className="font-semibold">{title}</h3>}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {headerAction}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
