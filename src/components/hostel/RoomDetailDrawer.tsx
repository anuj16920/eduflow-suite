import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BedDouble, Users, User, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { RoomData } from "./RoomCard";

interface StudentAlloc {
  id: string;
  fullName: string;
  admissionNumber: string | null;
  bedNumber: number | null;
}

interface Props {
  room: RoomData | null;
  students: StudentAlloc[];
  onClose: () => void;
}

export const RoomDetailDrawer = memo(function RoomDetailDrawer({ room, students, onClose }: Props) {
  const available = room ? room.totalBeds - room.occupiedBeds : 0;
  const status = !room ? "" : available === 0 ? "Full" : room.occupiedBeds > 0 ? "Partial" : "Available";
  const statusVariant = status === "Full" ? "destructive" : status === "Partial" ? "secondary" : "default";

  return (
    <AnimatePresence>
      {room && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background border-l border-border z-50 shadow-2xl overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Room {room.roomNumber}</h2>
                <Button variant="ghost" size="icon" className="rounded-xl" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={statusVariant as any} className="text-xs">{status}</Badge>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-muted/30 border border-border p-3 text-center">
                  <BedDouble className="h-5 w-5 mx-auto text-primary mb-1" />
                  <p className="text-lg font-bold">{room.totalBeds}</p>
                  <p className="text-[10px] text-muted-foreground">Total Beds</p>
                </div>
                <div className="rounded-xl bg-muted/30 border border-border p-3 text-center">
                  <Users className="h-5 w-5 mx-auto text-amber-500 mb-1" />
                  <p className="text-lg font-bold">{room.occupiedBeds}</p>
                  <p className="text-[10px] text-muted-foreground">Occupied</p>
                </div>
                <div className="rounded-xl bg-muted/30 border border-border p-3 text-center">
                  <BedDouble className="h-5 w-5 mx-auto text-green-500 mb-1" />
                  <p className="text-lg font-bold">{available}</p>
                  <p className="text-[10px] text-muted-foreground">Available</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" /> Assigned Students
                </h3>
                {students.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">No students assigned.</p>
                ) : (
                  <div className="space-y-2">
                    {students.map((s, i) => (
                      <motion.div
                        key={s.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-muted/30 border border-border"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{s.fullName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{s.fullName}</p>
                          {s.admissionNumber && <p className="text-[10px] text-muted-foreground">{s.admissionNumber}</p>}
                        </div>
                        {s.bedNumber && (
                          <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            <Hash className="h-3 w-3" /> Bed {s.bedNumber}
                          </span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
