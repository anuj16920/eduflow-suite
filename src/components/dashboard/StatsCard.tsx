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

const variantIconBg = {
  default: "from-primary/20 to-primary/5",
  primary: "from-primary/30 to-amber-500/10",
  success: "from-emerald-500/20 to-emerald-500/5",
  warning: "from-amber-500/20 to-orange-500/5",
  destructive: "from-red-500/20 to-red-500/5",
};

const variantIconColor = {
  default: "text-primary",
  primary: "text-primary",
  success: "text-emerald-500",
  warning: "text-amber-500",
  destructive: "text-red-500",
};

const variantValueColor = {
  default: "text-foreground",
  primary: "bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent",
  success: "bg-gradient-to-r from-emerald-500 to-emerald-400 bg-clip-text text-transparent",
  warning: "bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent",
  destructive: "bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent",
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        "group relative p-5 rounded-2xl bg-gradient-to-br",
        variantIconBg[variant],
        "backdrop-blur-sm transition-all duration-300",
        "hover:shadow-lg hover:shadow-primary/5",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br",
          variantIconBg[variant],
          "group-hover:scale-110 transition-transform duration-300"
        )}>
          <Icon className={cn("h-5 w-5", variantIconColor[variant])} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
            {title}
          </p>
          <p className={cn("text-2xl font-bold tracking-tight", variantValueColor[variant])}>
            {value}
          </p>
        </div>
      </div>
      {change && (
        <div className="mt-3 flex items-center gap-1.5">
          <span className={cn(
            "text-xs font-semibold",
            change.positive ? "text-emerald-500" : "text-red-500"
          )}>
            {change.positive ? "↑" : "↓"} {change.value}
          </span>
          <span className="text-xs text-muted-foreground">from last month</span>
        </div>
      )}
    </motion.div>
  );
}

interface SimpleCardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
  action?: ReactNode;
}

export function SimpleCard({
  title,
  description,
  children,
  className,
  headerAction,
  action,
}: SimpleCardProps) {
  const actionElement = action || headerAction;
  return (
    <div className={cn(
      "rounded-2xl bg-muted/30 backdrop-blur-sm",
      className
    )}>
      {(title || actionElement) && (
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            {title && <h3 className="font-semibold text-lg">{title}</h3>}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {actionElement}
        </div>
      )}
      <div className="px-6 pb-6">{children}</div>
    </div>
  );
}

export function GlassCard({
  children,
  className,
  ...props
}: { children: ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-card/20 backdrop-blur-xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
