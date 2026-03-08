import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SimpleCard, StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Bus, MapPin, Users, Phone, Plus, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function TransportManagement() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [stops, setStops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [routesRes, stopsRes] = await Promise.all([
      supabase.from("transport_routes").select("*"),
      supabase.from("transport_stops").select("*"),
    ]);
    if (routesRes.data) setRoutes(routesRes.data);
    if (stopsRes.data) setStops(stopsRes.data);
    setLoading(false);
  };

  const activeRoutes = routes.filter((r) => r.status === "active").length;
  const totalCapacity = routes.reduce((s, r) => s + (r.capacity || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Transport Management</h1>
          <p className="text-muted-foreground">Manage bus routes, stops, and student transport</p>
        </div>
        <Button className="gradient-primary border-0 text-primary-foreground"><Plus className="h-4 w-4 mr-2" />Add Route</Button>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <StatsCard title="Total Routes" value={routes.length} icon={Bus} />
        <StatsCard title="Active Routes" value={activeRoutes} icon={Bus} variant="success" />
        <StatsCard title="Total Stops" value={stops.length} icon={MapPin} variant="primary" />
        <StatsCard title="Bus Capacity" value={totalCapacity} icon={Users} variant="warning" />
      </div>

      <SimpleCard title="Bus Routes">
        {loading ? (
          <div className="text-center py-12">
            <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-3" />
            <p className="text-muted-foreground">Loading routes...</p>
          </div>
        ) : routes.length === 0 ? (
          <div className="text-center py-12">
            <Bus className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No routes added yet</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {routes.map((route, i) => (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-5 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Bus className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{route.route_name}</h3>
                      <p className="text-xs text-muted-foreground">Bus: {route.bus_number || "N/A"}</p>
                    </div>
                  </div>
                  <Badge className={route.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}>
                    {route.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{route.capacity} seats</span>
                  <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{route.driver_phone || "N/A"}</span>
                </div>
                {route.driver_name && (
                  <p className="text-sm mt-2">Driver: <span className="font-medium">{route.driver_name}</span></p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </SimpleCard>
    </div>
  );
}
