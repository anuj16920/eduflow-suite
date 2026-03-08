import { memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday, isSameDay, isBefore, startOfDay,
} from "date-fns";

interface Props {
  currentMonth: Date;
  onMonthChange: (d: Date) => void;
  selectedDate: Date | null;
  onDateSelect: (d: Date) => void;
  availableDates: Set<string>;
  bookedDates: Set<string>;
}

export const MeetingCalendar = memo(function MeetingCalendar({
  currentMonth, onMonthChange, selectedDate, onDateSelect, availableDates, bookedDates,
}: Props) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPad = getDay(monthStart);
  const today = startOfDay(new Date());

  const prev = () => onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const next = () => onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" className="rounded-xl" onClick={prev}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-semibold text-sm">{format(currentMonth, "MMMM yyyy")}</h3>
        <Button variant="ghost" size="icon" className="rounded-xl" onClick={next}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={format(currentMonth, "yyyy-MM")}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-7 gap-1"
        >
          {Array.from({ length: startPad }).map((_, i) => <div key={`pad-${i}`} />)}
          {days.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const isPast = isBefore(day, today) && !isToday(day);
            const isAvailable = availableDates.has(key);
            const isFullyBooked = bookedDates.has(key);
            const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
            const isClickable = !isPast && (isAvailable || !isFullyBooked);

            return (
              <motion.button
                key={key}
                whileHover={isClickable ? { scale: 1.1 } : {}}
                onClick={() => isClickable && onDateSelect(day)}
                disabled={isPast}
                className={`relative flex flex-col items-center justify-center h-10 rounded-xl text-sm transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground font-bold shadow-md"
                    : isToday(day)
                    ? "bg-primary/10 text-primary font-bold"
                    : isPast
                    ? "text-muted-foreground/30 cursor-not-allowed"
                    : isFullyBooked
                    ? "text-muted-foreground/50 cursor-not-allowed"
                    : "hover:bg-accent/50"
                }`}
              >
                {format(day, "d")}
                {isAvailable && !isPast && (
                  <div className={`h-1 w-1 rounded-full mt-0.5 ${isSelected ? "bg-primary-foreground" : "bg-green-500"}`} />
                )}
                {isFullyBooked && !isPast && !isAvailable && (
                  <div className="h-1 w-1 rounded-full mt-0.5 bg-muted-foreground/40" />
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-500" /> Available</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-muted-foreground/40" /> Fully booked</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> Selected</span>
      </div>
    </div>
  );
});
