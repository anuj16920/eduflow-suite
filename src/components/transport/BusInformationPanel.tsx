import { memo } from "react";
import { motion } from "framer-motion";
import { Bus, Phone, User, Users, Armchair } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { RouteOption } from "./RouteSelectorPanel";

interface StudentInfo {
  id: string;
  fullName: string;
  admissionNumber: string | null;
  stopName: string | null;
}

interface Props {
  route: RouteOption;
  students: StudentInfo[];
}

export const BusInformationPanel = memo(function BusInformationPanel({ route, students }: Props) {
  const occupied = students.length;
  const total = route.capacity || 40;
  const available = Math.max(0, total - occupied);
  const fillPercent = Math.min(100, (occupied / total) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Bus Info */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
            <Bus className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{route.routeName}</h3>
            <p className="text-xs text-muted-foreground">{route.busNumber ? `Bus ${route.busNumber}` : "No bus assigned"}</p>
          </div>
          <Badge variant={route.status === "active" ? "default" : "secondary"} className="ml-auto text-[10px]">
            {route.status || "active"}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Driver</p>
              <p className="font-medium text-xs">{route.driverName || "Not assigned"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Contact</p>
              <p className="font-medium text-xs">{route.driverPhone || "—"}</p>
            </div>
          </div>
        </div>

        {/* Capacity bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-muted-foreground flex items-center gap-1"><Armchair className="h-3 w-3" /> Seats</span>
            <span className="font-medium">{occupied}/{total} <span className="text-muted-foreground">({available} available)</span></span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${fillPercent}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`h-full rounded-full ${fillPercent > 90 ? "bg-destructive" : fillPercent > 70 ? "bg-amber-500" : "bg-primary"}`}
            />
          </div>
        </div>
      </div>

      {/* Assigned Students */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" /> Assigned Students
          </h4>
          <Badge variant="secondary" className="text-[10px]">{students.length}</Badge>
        </div>

        {students.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No students assigned to this route.</p>
        ) : (
          <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
            {students.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/30 hover:bg-accent/30 transition-colors"
              >
                <div>
                  <p className="text-xs font-medium">{s.fullName}</p>
                  {s.admissionNumber && <p className="text-[10px] text-muted-foreground">{s.admissionNumber}</p>}
                </div>
                {s.stopName && <span className="text-[10px] text-muted-foreground">{s.stopName}</span>}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
});
