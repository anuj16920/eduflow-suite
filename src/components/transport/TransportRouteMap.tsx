import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Users, School } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export interface StopData {
  id: string;
  stopName: string;
  stopOrder: number | null;
  pickupTime: string | null;
  dropTime: string | null;
  studentCount?: number;
}

interface Props {
  stops: StopData[];
  onStopClick: (stop: StopData) => void;
}

function formatTime(t: string | null) {
  if (!t) return "—";
  const [h, m] = t.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${m} ${ampm}`;
}

export const TransportRouteMap = memo(function TransportRouteMap({ stops, onStopClick }: Props) {
  const sorted = useMemo(() => [...stops].sort((a, b) => (a.stopOrder || 0) - (b.stopOrder || 0)), [stops]);

  if (sorted.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <p className="text-sm">No stops defined for this route.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Visual route path */}
      <div className="space-y-0">
        {sorted.map((stop, i) => {
          const isFirst = i === 0;
          const isLast = i === sorted.length - 1;

          return (
            <motion.div
              key={stop.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-stretch gap-4"
            >
              {/* Timeline */}
              <div className="flex flex-col items-center w-8 shrink-0">
                <div className={`h-3 w-3 rounded-full border-2 z-10 ${
                  isFirst ? "bg-green-500 border-green-400" :
                  isLast ? "bg-primary border-primary/70" :
                  "bg-card border-primary"
                }`} />
                {!isLast && <div className="w-0.5 flex-1 bg-border" />}
              </div>

              {/* Stop card */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.01, x: 4 }}
                    onClick={() => onStopClick(stop)}
                    className={`flex-1 flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-accent/30 hover:border-primary/30 transition-colors text-left mb-2 ${
                      isFirst ? "border-green-500/30" : isLast ? "border-primary/30" : ""
                    }`}
                  >
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isFirst ? "bg-green-500/10" : isLast ? "bg-primary/10" : "bg-muted"
                    }`}>
                      {isLast ? <School className="h-4 w-4 text-primary" /> : <MapPin className={`h-4 w-4 ${isFirst ? "text-green-500" : "text-muted-foreground"}`} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{stop.stopName}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        {stop.pickupTime && (
                          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Clock className="h-3 w-3" /> {formatTime(stop.pickupTime)}
                          </span>
                        )}
                        {stop.studentCount !== undefined && (
                          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Users className="h-3 w-3" /> {stop.studentCount} students
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      #{stop.stopOrder || i + 1}
                    </span>
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs space-y-1">
                  <p className="font-semibold">{stop.stopName}</p>
                  <p>Pickup: {formatTime(stop.pickupTime)}</p>
                  <p>Drop: {formatTime(stop.dropTime)}</p>
                  {stop.studentCount !== undefined && <p>{stop.studentCount} students assigned</p>}
                </TooltipContent>
              </Tooltip>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});
