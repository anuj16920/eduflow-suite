import { memo } from "react";
import { motion } from "framer-motion";

interface Props {
  floors: number;
  selectedFloor: number;
  onFloorChange: (floor: number) => void;
}

const FLOOR_LABELS: Record<number, string> = { 0: "Ground Floor", 1: "First Floor", 2: "Second Floor", 3: "Third Floor", 4: "Fourth Floor", 5: "Fifth Floor" };

export const FloorTabs = memo(function FloorTabs({ floors, selectedFloor, onFloorChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {Array.from({ length: floors }, (_, i) => (
        <motion.button
          key={i}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onFloorChange(i)}
          className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
            selectedFloor === i
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-card border border-border hover:bg-accent/50 text-muted-foreground"
          }`}
        >
          {FLOOR_LABELS[i] || `Floor ${i}`}
        </motion.button>
      ))}
    </div>
  );
});
