import { memo } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  status: "available" | "booked" | "selected";
}

interface Props {
  slot: TimeSlot;
  onSelect: (slot: TimeSlot) => void;
  index: number;
}

function formatTime(t: string) {
  const [h, m] = t.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

export const TimeSlotCard = memo(function TimeSlotCard({ slot, onSelect, index }: Props) {
  const isBooked = slot.status === "booked";
  const isSelected = slot.status === "selected";

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      whileHover={!isBooked ? { scale: 1.03 } : {}}
      whileTap={!isBooked ? { scale: 0.97 } : {}}
      disabled={isBooked}
      onClick={() => !isBooked && onSelect(slot)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left w-full ${
        isSelected
          ? "border-primary bg-primary/10 shadow-md"
          : isBooked
          ? "border-border bg-muted/50 opacity-50 cursor-not-allowed"
          : "border-border bg-card hover:border-primary/50 hover:shadow-sm cursor-pointer"
      }`}
    >
      <Clock className={`h-4 w-4 shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
      <div className="flex-1">
        <p className={`text-sm font-medium ${isSelected ? "text-primary" : ""}`}>
          {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
        </p>
      </div>
      {isBooked && (
        <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Booked</span>
      )}
      {isSelected && (
        <span className="text-[10px] font-medium text-primary bg-primary/20 px-2 py-0.5 rounded-full">Selected</span>
      )}
    </motion.button>
  );
});
