import { memo } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock, User, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import type { TeacherOption } from "./TeacherSelector";
import type { TimeSlot } from "./TimeSlotCard";

function formatTime(t: string) {
  const [h, m] = t.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

interface Props {
  teacher: TeacherOption | null;
  date: Date | null;
  slot: TimeSlot | null;
  onBook: () => void;
  loading: boolean;
}

export const BookingPanel = memo(function BookingPanel({ teacher, date, slot, onBook, loading }: Props) {
  const ready = teacher && date && slot;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card p-5 space-y-4"
    >
      <h3 className="font-semibold text-sm flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-primary" /> Booking Summary
      </h3>

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <User className="h-4 w-4 text-muted-foreground shrink-0" />
          <div>
            <p className="text-muted-foreground text-xs">Teacher</p>
            <p className="font-medium">{teacher?.fullName || "—"}</p>
            {teacher && <p className="text-xs text-muted-foreground">{teacher.subjects.join(", ") || teacher.department}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
          <div>
            <p className="text-muted-foreground text-xs">Date</p>
            <p className="font-medium">{date ? format(date, "EEEE, MMMM d, yyyy") : "—"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
          <div>
            <p className="text-muted-foreground text-xs">Time Slot</p>
            <p className="font-medium">
              {slot ? `${formatTime(slot.startTime)} – ${formatTime(slot.endTime)}` : "—"}
            </p>
          </div>
        </div>
      </div>

      <Button
        onClick={onBook}
        disabled={!ready || loading}
        className="w-full rounded-xl"
        size="lg"
      >
        {loading ? "Booking..." : "Book Meeting"}
      </Button>
    </motion.div>
  );
});
