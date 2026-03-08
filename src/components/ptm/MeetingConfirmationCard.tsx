import { memo } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, CalendarDays, Clock, User, Link2, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

function formatTime(t: string) {
  const [h, m] = t.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

interface Props {
  meetingId: string;
  teacherName: string;
  date: Date;
  startTime: string;
  endTime: string;
  meetingLink?: string | null;
  onClose: () => void;
}

export const MeetingConfirmationCard = memo(function MeetingConfirmationCard({
  meetingId, teacherName, date, startTime, endTime, meetingLink, onClose,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 20 }}
      className="rounded-2xl border border-border bg-card p-6 text-center space-y-5"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", damping: 12 }}
        className="mx-auto w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center"
      >
        <CheckCircle2 className="h-8 w-8 text-green-500" />
      </motion.div>

      <div>
        <h3 className="text-lg font-bold">Meeting Booked!</h3>
        <p className="text-sm text-muted-foreground mt-1">Your meeting has been successfully scheduled.</p>
      </div>

      <div className="text-left space-y-3 bg-muted/30 rounded-xl p-4">
        <div className="flex items-center gap-3 text-sm">
          <Hash className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Meeting ID</p>
            <p className="font-mono text-xs">{meetingId.slice(0, 8).toUpperCase()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Teacher</p>
            <p className="font-medium">{teacherName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Date</p>
            <p className="font-medium">{format(date, "EEEE, MMMM d, yyyy")}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Time</p>
            <p className="font-medium">{formatTime(startTime)} – {formatTime(endTime)}</p>
          </div>
        </div>
        {meetingLink && (
          <div className="flex items-center gap-3 text-sm">
            <Link2 className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Meeting Link</p>
              <a href={meetingLink} target="_blank" rel="noreferrer" className="text-primary text-xs underline">{meetingLink}</a>
            </div>
          </div>
        )}
      </div>

      <Button onClick={onClose} variant="outline" className="rounded-xl w-full">
        Book Another Meeting
      </Button>
    </motion.div>
  );
});
