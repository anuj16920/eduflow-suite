import { memo } from "react";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface DayCellData {
  date: number;
  status: "present" | "absent" | "late" | "holiday" | null;
  check_in?: string | null;
  check_out?: string | null;
  isCurrentMonth: boolean;
  isToday: boolean;
}

interface AttendanceDayCellProps {
  day: DayCellData;
}

const statusBg: Record<string, string> = {
  present: "bg-emerald-500",
  absent: "bg-destructive",
  late: "bg-amber-500",
  holiday: "bg-muted-foreground/30",
};

const statusLabel: Record<string, string> = {
  present: "Present",
  absent: "Absent",
  late: "Late",
  holiday: "Holiday",
};

export const AttendanceDayCell = memo(function AttendanceDayCell({ day }: AttendanceDayCellProps) {
  const content = (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className={cn(
        "relative flex flex-col items-center justify-center h-10 w-10 rounded-lg text-xs font-medium transition-colors cursor-default",
        !day.isCurrentMonth && "opacity-30",
        day.isToday && "ring-2 ring-primary/50",
        day.status && day.isCurrentMonth ? "text-white" : "text-foreground"
      )}
    >
      {day.status && day.isCurrentMonth ? (
        <div className={cn("absolute inset-0 rounded-lg", statusBg[day.status], "opacity-80")} />
      ) : day.isCurrentMonth ? (
        <div className="absolute inset-0 rounded-lg bg-muted/40" />
      ) : null}
      <span className="relative z-10">{day.date}</span>
    </motion.div>
  );

  if (!day.status || !day.isCurrentMonth) return content;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent side="top" className="text-xs space-y-1">
        <p className="font-semibold">{statusLabel[day.status]}</p>
        {day.check_in && <p>Check-in: {day.check_in}</p>}
        {day.check_out && <p>Check-out: {day.check_out}</p>}
        {!day.check_in && !day.check_out && day.status !== "holiday" && <p>No time recorded</p>}
      </TooltipContent>
    </Tooltip>
  );
});
