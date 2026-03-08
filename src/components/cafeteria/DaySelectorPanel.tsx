import { memo } from "react";
import { motion } from "framer-motion";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface Props {
  selectedDay: number;
  onDayChange: (day: number) => void;
}

export const DaySelectorPanel = memo(function DaySelectorPanel({ selectedDay, onDayChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {DAYS.map((day, i) => {
        const dayNum = i + 1;
        const isActive = selectedDay === dayNum;
        return (
          <motion.button
            key={day}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onDayChange(dayNum)}
            className={`relative px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
              isActive
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-card border border-border hover:bg-accent/50 text-muted-foreground"
            }`}
          >
            {day}
          </motion.button>
        );
      })}
    </div>
  );
});
