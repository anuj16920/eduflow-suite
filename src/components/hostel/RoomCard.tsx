import { memo } from "react";
import { motion } from "framer-motion";
import { BedDouble, Users } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export interface RoomData {
  id: string;
  roomNumber: string;
  floor: number;
  totalBeds: number;
  occupiedBeds: number;
}

interface Props {
  room: RoomData;
  index: number;
  onClick: (room: RoomData) => void;
}

export const RoomCard = memo(function RoomCard({ room, index, onClick }: Props) {
  const available = room.totalBeds - room.occupiedBeds;
  const fillPercent = room.totalBeds > 0 ? (room.occupiedBeds / room.totalBeds) * 100 : 0;
  const status = available === 0 ? "full" : room.occupiedBeds > 0 ? "partial" : "available";
  const statusColor = status === "full" ? "border-destructive/40 bg-destructive/5" : status === "partial" ? "border-amber-500/40 bg-amber-500/5" : "border-green-500/40 bg-green-500/5";
  const dotColor = status === "full" ? "bg-destructive" : status === "partial" ? "bg-amber-500" : "bg-green-500";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.03, duration: 0.2 }}
          whileHover={{ scale: 1.05, y: -4 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onClick(room)}
          className={`w-full rounded-2xl border p-4 text-left transition-shadow hover:shadow-lg ${statusColor}`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold">{room.roomNumber}</span>
            <span className={`h-2.5 w-2.5 rounded-full ${dotColor}`} />
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" /> {room.totalBeds}</span>
            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {room.occupiedBeds}/{room.totalBeds}</span>
          </div>
          <div className="mt-2.5 h-1.5 rounded-full bg-muted overflow-hidden">
            <div className={`h-full rounded-full transition-all ${status === "full" ? "bg-destructive" : status === "partial" ? "bg-amber-500" : "bg-green-500"}`} style={{ width: `${fillPercent}%` }} />
          </div>
        </motion.button>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        <p className="font-semibold">Room {room.roomNumber}</p>
        <p>{available} bed{available !== 1 ? "s" : ""} available</p>
      </TooltipContent>
    </Tooltip>
  );
});
