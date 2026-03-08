import { useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { AttendanceDayCell, DayCellData } from "./AttendanceDayCell";

interface AttendanceRecord {
  date: string;
  status: string;
  check_in?: string | null;
  check_out?: string | null;
}

interface StudentAttendanceCalendarProps {
  year: number;
  month: number; // 0-indexed
  attendance: AttendanceRecord[];
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const StudentAttendanceCalendar = memo(function StudentAttendanceCalendar({
  year, month, attendance, onPrev, onNext, onToday,
}: StudentAttendanceCalendarProps) {
  const days = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const today = new Date();

    const attMap = new Map<string, AttendanceRecord>();
    attendance.forEach((a) => attMap.set(a.date, a));

    const cells: DayCellData[] = [];

    // Previous month padding
    for (let i = firstDay - 1; i >= 0; i--) {
      cells.push({ date: daysInPrevMonth - i, status: null, isCurrentMonth: false, isToday: false });
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const rec = attMap.get(dateStr);
      const dayOfWeek = new Date(year, month, d).getDay();
      const isSunday = dayOfWeek === 0;
      const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;

      cells.push({
        date: d,
        status: rec ? (rec.status as any) : isSunday ? "holiday" : null,
        check_in: rec?.check_in,
        check_out: rec?.check_out,
        isCurrentMonth: true,
        isToday,
      });
    }

    // Next month padding
    const remaining = 42 - cells.length;
    for (let i = 1; i <= remaining; i++) {
      cells.push({ date: i, status: null, isCurrentMonth: false, isToday: false });
    }

    return cells;
  }, [year, month, attendance]);

  const monthLabel = new Date(year, month).toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <div className="rounded-2xl bg-card border border-border/50 p-6">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-5">
        <AnimatePresence mode="wait">
          <motion.h3
            key={monthLabel}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="text-lg font-semibold"
          >
            {monthLabel}
          </motion.h3>
        </AnimatePresence>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onPrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={onToday}>
            <RotateCcw className="h-3 w-3 mr-1" />Today
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wider py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <motion.div
        key={`${year}-${month}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="grid grid-cols-7 gap-1"
      >
        {days.map((d, i) => (
          <div key={i} className="flex justify-center py-0.5">
            <AttendanceDayCell day={d} />
          </div>
        ))}
      </motion.div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-5 pt-4 border-t border-border/50">
        {[
          { label: "Present", color: "bg-emerald-500" },
          { label: "Absent", color: "bg-destructive" },
          { label: "Late", color: "bg-amber-500" },
          { label: "Holiday", color: "bg-muted-foreground/30" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className={`h-2.5 w-2.5 rounded-sm ${l.color}`} />
            <span className="text-xs text-muted-foreground">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
});
