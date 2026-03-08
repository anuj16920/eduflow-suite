import { useMemo, memo } from "react";
import { motion } from "framer-motion";
import { TimetableCell, type TimetableEntry } from "./TimetableCell";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface Props {
  entries: TimetableEntry[];
  onCellClick: (entry: TimetableEntry) => void;
}

function formatTime(t: string) {
  const [h, m] = t.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

export const WeeklyTimetableGrid = memo(function WeeklyTimetableGrid({ entries, onCellClick }: Props) {
  // Build unique sorted time slots
  const timeSlots = useMemo(() => {
    const set = new Set<string>();
    entries.forEach((e) => set.add(`${e.startTime}|${e.endTime}`));
    return Array.from(set).sort((a, b) => a.localeCompare(b)).map((s) => {
      const [start, end] = s.split("|");
      return { key: s, start, end };
    });
  }, [entries]);

  // Map entries by day+slot
  const grid = useMemo(() => {
    const map: Record<string, TimetableEntry> = {};
    entries.forEach((e) => {
      map[`${e.dayOfWeek}-${e.startTime}|${e.endTime}`] = e;
    });
    return map;
  }, [entries]);

  // Color mapping per subject
  const colorMap = useMemo(() => {
    const subjects = [...new Set(entries.map((e) => e.subjectName))];
    const map: Record<string, number> = {};
    subjects.forEach((s, i) => { map[s] = i; });
    return map;
  }, [entries]);

  if (entries.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-sm">No timetable data available for this class.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {/* Desktop grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="hidden md:block min-w-[700px]"
      >
        <div className="grid gap-1" style={{ gridTemplateColumns: `80px repeat(6, 1fr)` }}>
          {/* Header */}
          <div />
          {DAYS.map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
              {day}
            </div>
          ))}

          {/* Rows */}
          {timeSlots.map((slot, rowIdx) => (
            <>
              <div key={`label-${slot.key}`} className="flex flex-col justify-center text-[10px] text-muted-foreground pr-2 text-right">
                <span>{formatTime(slot.start)}</span>
                <span>{formatTime(slot.end)}</span>
              </div>
              {[1, 2, 3, 4, 5, 6].map((dayNum) => {
                const entry = grid[`${dayNum}-${slot.key}`];
                return (
                  <motion.div
                    key={`${dayNum}-${slot.key}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: rowIdx * 0.03 + dayNum * 0.02 }}
                    className="min-h-[70px]"
                  >
                    {entry ? (
                      <TimetableCell entry={entry} colorIndex={colorMap[entry.subjectName] || 0} onClick={onCellClick} />
                    ) : (
                      <div className="h-full min-h-[70px] rounded-xl border border-dashed border-border/50" />
                    )}
                  </motion.div>
                );
              })}
            </>
          ))}
        </div>
      </motion.div>

      {/* Mobile list view */}
      <div className="md:hidden space-y-4">
        {DAYS.map((day, dayIdx) => {
          const dayEntries = entries.filter((e) => e.dayOfWeek === dayIdx + 1).sort((a, b) => a.startTime.localeCompare(b.startTime));
          if (dayEntries.length === 0) return null;
          return (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dayIdx * 0.05 }}
            >
              <h4 className="text-sm font-semibold mb-2">{day}</h4>
              <div className="space-y-2">
                {dayEntries.map((entry) => (
                  <TimetableCell key={entry.id} entry={entry} colorIndex={colorMap[entry.subjectName] || 0} onClick={onCellClick} />
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});
