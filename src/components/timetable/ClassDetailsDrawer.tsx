import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, User, MapPin, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TimetableEntry } from "./TimetableCell";

const DAYS = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function formatTime(t: string) {
  const [h, m] = t.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

interface Props {
  entry: TimetableEntry | null;
  onClose: () => void;
}

export const ClassDetailsDrawer = memo(function ClassDetailsDrawer({ entry, onClose }: Props) {
  return (
    <AnimatePresence>
      {entry && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background border-l border-border z-50 shadow-2xl overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Class Details</h2>
                <Button variant="ghost" size="icon" className="rounded-xl" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Subject</p>
                    <p className="font-semibold">{entry.subjectName}</p>
                    {entry.subjectCode && <p className="text-xs text-muted-foreground">{entry.subjectCode}</p>}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-secondary/50 flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Teacher</p>
                    <p className="font-semibold">{entry.teacherName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-accent/50 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Schedule</p>
                    <p className="font-semibold">{DAYS[entry.dayOfWeek]}</p>
                    <p className="text-sm text-muted-foreground">{formatTime(entry.startTime)} – {formatTime(entry.endTime)}</p>
                  </div>
                </div>

                {entry.room && (
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Classroom</p>
                      <p className="font-semibold">Room {entry.room}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Notes</p>
                    <p className="text-sm text-muted-foreground">No additional notes for this class.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
