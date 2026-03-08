import { useState } from "react";
import { SimpleCard, StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Building2, Users, BedDouble, DoorOpen, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const hostelData = [
  { id: 1, name: "Boys Hostel - Block A", type: "boys", capacity: 120, occupied: 98, warden: "Mr. Rajesh Kumar" },
  { id: 2, name: "Boys Hostel - Block B", type: "boys", capacity: 100, occupied: 87, warden: "Mr. Anil Sharma" },
  { id: 3, name: "Girls Hostel - Block A", type: "girls", capacity: 100, occupied: 92, warden: "Mrs. Sunita Devi" },
  { id: 4, name: "Girls Hostel - Block B", type: "girls", capacity: 80, occupied: 65, warden: "Mrs. Priya Singh" },
];

export default function HostelManagement() {
  const [search, setSearch] = useState("");
  const filtered = hostelData.filter((h) => h.name.toLowerCase().includes(search.toLowerCase()));
  const totalCapacity = hostelData.reduce((s, h) => s + h.capacity, 0);
  const totalOccupied = hostelData.reduce((s, h) => s + h.occupied, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div><h1 className="text-3xl font-bold">Hostel Management</h1><p className="text-muted-foreground">Manage hostel blocks, rooms, and student allocations</p></div>
        <Button className="gradient-primary border-0 text-primary-foreground rounded-xl"><Plus className="h-4 w-4 mr-2" />Add Block</Button>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <StatsCard title="Total Blocks" value={hostelData.length} icon={Building2} />
        <StatsCard title="Total Capacity" value={totalCapacity} icon={BedDouble} variant="primary" />
        <StatsCard title="Occupied" value={totalOccupied} icon={Users} variant="success" />
        <StatsCard title="Available" value={totalCapacity - totalOccupied} icon={DoorOpen} variant="warning" />
      </div>

      <SimpleCard>
        <div className="mb-6 relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search hostels..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((hostel, i) => (
            <motion.div key={hostel.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="p-5 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center"><Building2 className="h-5 w-5 text-primary" /></div>
                  <div><h3 className="font-semibold">{hostel.name}</h3><p className="text-sm text-muted-foreground">Warden: {hostel.warden}</p></div>
                </div>
                <Badge variant="secondary" className="capitalize">{hostel.type}</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Occupancy</span><span className="font-medium">{hostel.occupied}/{hostel.capacity}</span></div>
                <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${(hostel.occupied / hostel.capacity) > 0.9 ? "bg-red-500" : (hostel.occupied / hostel.capacity) > 0.7 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${(hostel.occupied / hostel.capacity) * 100}%` }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </SimpleCard>
    </div>
  );
}
