import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameMonth, isToday,
} from "date-fns";
import type { ExamCardData } from "./UpcomingExamCards";

export function ExamCalendarView({ exams }: { exams: ExamCardData[] }) {
  const [current, setCurrent] = useState(new Date());

  const examsByDate = useMemo(() => {
    const map: Record<string, ExamCardData[]> = {};
    exams.forEach((e) => {
      const key = e.examDate;
      if (!map[key]) map[key] = [];
      map[key].push(e);
    });
    return map;
  }, [exams]);

  const monthStart = startOfMonth(current);
  const monthEnd = endOfMonth(current);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPad = getDay(monthStart);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setCurrent(subMonths(current, 1))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-semibold">{format(current, "MMMM yyyy")}</h3>
        <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setCurrent(addMonths(current, 1))}>
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
          key={format(current, "yyyy-MM")}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-7 gap-1"
        >
          {Array.from({ length: startPad }).map((_, i) => (
            <div key={`pad-${i}`} />
          ))}
          {days.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const dayExams = examsByDate[key] || [];
            const hasExams = dayExams.length > 0;

            return (
              <Popover key={key}>
                <PopoverTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    className={`relative flex flex-col items-center justify-center h-10 rounded-xl text-sm transition-colors ${
                      isToday(day) ? "bg-primary/10 text-primary font-bold" :
                      !isSameMonth(day, current) ? "text-muted-foreground/30" :
                      "hover:bg-muted/50"
                    } ${hasExams ? "font-semibold" : ""}`}
                  >
                    {format(day, "d")}
                    {hasExams && (
                      <div className="flex gap-0.5 mt-0.5">
                        {dayExams.slice(0, 3).map((_, i) => (
                          <div key={i} className="h-1 w-1 rounded-full bg-primary" />
                        ))}
                      </div>
                    )}
                  </motion.button>
                </PopoverTrigger>
                {hasExams && (
                  <PopoverContent className="w-64 p-3" align="center">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">
                      {format(day, "EEE, MMM d")}
                    </p>
                    <div className="space-y-2">
                      {dayExams.map((e) => (
                        <div key={e.id} className="flex items-center justify-between text-sm">
                          <span className="font-medium truncate mr-2">{e.subjectName}</span>
                          <Badge variant="secondary" className="text-[10px] shrink-0">
                            {e.startTime || "TBA"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                )}
              </Popover>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
