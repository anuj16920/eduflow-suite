import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Building2, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { HostelBuildingSelector, FloorTabs, RoomCard, RoomDetailDrawer } from "@/components/hostel";
import type { BuildingOption } from "@/components/hostel/HostelBuildingSelector";
import type { RoomData } from "@/components/hostel/RoomCard";

interface StudentAlloc {
  id: string;
  fullName: string;
  admissionNumber: string | null;
  bedNumber: number | null;
}

export default function HostelRoomViewerPage() {
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingOption | null>(null);
  const [selectedFloor, setSelectedFloor] = useState(0);
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [allocations, setAllocations] = useState<Record<string, StudentAlloc[]>>({});
  const [loading, setLoading] = useState(false);
  const [drawerRoom, setDrawerRoom] = useState<RoomData | null>(null);

  useEffect(() => {
    if (!selectedBuilding) { setRooms([]); setAllocations({}); return; }
    (async () => {
      setLoading(true);
      const { data: roomData } = await supabase
        .from("hostel_rooms")
        .select("*")
        .eq("building_id", selectedBuilding.id)
        .order("room_number");

      const roomIds = (roomData || []).map((r: any) => r.id);

      let allocMap: Record<string, StudentAlloc[]> = {};
      if (roomIds.length > 0) {
        const { data: allocData } = await supabase
          .from("hostel_allocations")
          .select("id, room_id, bed_number, students!hostel_allocations_student_id_fkey(id, admission_number, profiles!students_profile_id_fkey(full_name))")
          .in("room_id", roomIds)
          .eq("status", "active");

        (allocData || []).forEach((a: any) => {
          const rid = a.room_id;
          if (!allocMap[rid]) allocMap[rid] = [];
          allocMap[rid].push({
            id: a.students?.id || a.id,
            fullName: a.students?.profiles?.full_name || "Unknown",
            admissionNumber: a.students?.admission_number || null,
            bedNumber: a.bed_number,
          });
        });
      }

      setRooms(
        (roomData || []).map((r: any) => ({
          id: r.id,
          roomNumber: r.room_number,
          floor: r.floor,
          totalBeds: r.total_beds,
          occupiedBeds: (allocMap[r.id] || []).length,
        }))
      );
      setAllocations(allocMap);
      setLoading(false);
      setSelectedFloor(0);
    })();
  }, [selectedBuilding]);

  const floorRooms = useMemo(() => rooms.filter((r) => r.floor === selectedFloor), [rooms, selectedFloor]);

  const stats = useMemo(() => {
    const total = rooms.reduce((s, r) => s + r.totalBeds, 0);
    const occupied = rooms.reduce((s, r) => s + r.occupiedBeds, 0);
    return { totalRooms: rooms.length, totalBeds: total, occupied, available: total - occupied };
  }, [rooms]);

  const handleRoomClick = useCallback((room: RoomData) => setDrawerRoom(room), []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-6 max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>Dashboard</span><span>/</span><span>Hostel</span><span>/</span><span className="text-foreground font-medium">Rooms</span>
          </div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" /> Hostel Rooms
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-xl gap-2"><Download className="h-4 w-4" /> Download</Button>
          <Button variant="outline" size="sm" className="rounded-xl gap-2"><FileText className="h-4 w-4" /> Export</Button>
        </div>
      </div>

      {/* Building Selector */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-3"><CardTitle className="text-base">Select Building</CardTitle></CardHeader>
        <CardContent>
          <HostelBuildingSelector selected={selectedBuilding} onSelect={setSelectedBuilding} />
        </CardContent>
      </Card>

      {!selectedBuilding ? (
        <Card className="rounded-2xl">
          <CardContent className="py-16 text-center text-muted-foreground">
            <Building2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Select a hostel building to view rooms.</p>
          </CardContent>
        </Card>
      ) : loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Rooms", value: stats.totalRooms, color: "text-primary" },
              { label: "Total Beds", value: stats.totalBeds, color: "text-foreground" },
              { label: "Occupied", value: stats.occupied, color: "text-amber-500" },
              { label: "Available", value: stats.available, color: "text-green-500" },
            ].map((s) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card p-4 text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Floor Tabs */}
          <FloorTabs floors={selectedBuilding.totalFloors} selectedFloor={selectedFloor} onFloorChange={setSelectedFloor} />

          {/* Room Grid */}
          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Rooms</CardTitle>
                <Badge variant="secondary" className="text-xs">{floorRooms.length} rooms</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {floorRooms.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No rooms on this floor.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {floorRooms.map((room, i) => (
                    <RoomCard key={room.id} room={room} index={i} onClick={handleRoomClick} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-green-500" /> Available</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Partial</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-destructive" /> Full</span>
          </div>
        </>
      )}

      <RoomDetailDrawer room={drawerRoom} students={drawerRoom ? (allocations[drawerRoom.id] || []) : []} onClose={() => setDrawerRoom(null)} />
    </motion.div>
  );
}
