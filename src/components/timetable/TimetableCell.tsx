import { memo } from "react";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export interface TimetableEntry {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  subjectName: string;
  teacherName: string;
  room: string | null;
  subjectCode: string | null;
}

const SUBJECT_COLORS = [
  "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300",
  "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300",
  "bg-violet-500/10 border-violet-500/30 text-violet-700 dark:text-violet-300",
  "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300",
  "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300",
  "bg-cyan-500/10 border-cyan-500/30 text-cyan-700 dark:text-cyan-300",
  "bg-orange-500/10 border-orange-500/30 text-orange-700 dark:text-orange-300",
  "bg-pink-500/10 border-pink-500/30 text-pink-700 dark:text-pink-300",
];

interface Props {
  entry: TimetableEntry;
  colorIndex: number;
  onClick: (entry: TimetableEntry) => void;
}

export const TimetableCell = memo(function TimetableCell({ entry, colorIndex, onClick }: Props) {
  const color = SUBJECT_COLORS[colorIndex % SUBJECT_COLORS.length];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onClick(entry)}
          className={`w-full h-full min-h-[70px] rounded-xl border p-2 text-left transition-shadow hover:shadow-md ${color}`}
        >
          <p className="text-xs font-semibold truncate">{entry.subjectName}</p>
          <p className="text-[10px] opacity-70 truncate mt-0.5">{entry.teacherName}</p>
          {entry.room && <p className="text-[10px] opacity-60 mt-0.5">📍 {entry.room}</p>}
        </motion.button>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs space-y-1 max-w-[200px]">
        <p className="font-semibold">{entry.subjectName}</p>
        <p>👤 {entry.teacherName}</p>
        {entry.room && <p>📍 Room {entry.room}</p>}
        <p>🕐 {entry.startTime.slice(0, 5)} – {entry.endTime.slice(0, 5)}</p>
      </TooltipContent>
    </Tooltip>
  );
});
