import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Bus, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { RouteSelectorPanel, TransportRouteMap, BusInformationPanel } from "@/components/transport";
import type { RouteOption } from "@/components/transport/RouteSelectorPanel";
import type { StopData } from "@/components/transport/TransportRouteMap";

interface StudentInfo {
  id: string;
  fullName: string;
  admissionNumber: string | null;
  stopName: string | null;
}

export default function TransportRouteViewerPage() {
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);
  const [stops, setStops] = useState<StopData[]>([]);
  const [students, setStudents] = useState<StudentInfo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedRoute) { setStops([]); setStudents([]); return; }
    (async () => {
      setLoading(true);

      // Fetch stops
      const { data: stopsData } = await supabase
        .from("transport_stops")
        .select("*")
        .eq("route_id", selectedRoute.id)
        .order("stop_order");

      // Fetch assigned students
      const { data: stData } = await supabase
        .from("student_transport")
        .select("id, stop_id, students!student_transport_student_id_fkey(id, admission_number, profiles!students_profile_id_fkey(full_name))")
        .eq("route_id", selectedRoute.id);

      const stopMap: Record<string, string> = {};
      stopsData?.forEach((s) => { stopMap[s.id] = s.stop_name; });

      // Count students per stop
      const stopStudentCount: Record<string, number> = {};
      stData?.forEach((st: any) => {
        if (st.stop_id) stopStudentCount[st.stop_id] = (stopStudentCount[st.stop_id] || 0) + 1;
      });

      setStops(
        (stopsData || []).map((s) => ({
          id: s.id,
          stopName: s.stop_name,
          stopOrder: s.stop_order,
          pickupTime: s.pickup_time,
          dropTime: s.drop_time,
          studentCount: stopStudentCount[s.id] || 0,
        }))
      );

      setStudents(
        (stData || []).map((st: any) => ({
          id: st.students?.id || st.id,
          fullName: st.students?.profiles?.full_name || "Unknown",
          admissionNumber: st.students?.admission_number || null,
          stopName: st.stop_id ? stopMap[st.stop_id] || null : null,
        }))
      );

      setLoading(false);
    })();
  }, [selectedRoute]);

  const handleStopClick = useCallback((stop: StopData) => {
    // Could open a detail modal in future
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-6 max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>Dashboard</span><span>/</span><span>Transport</span><span>/</span><span className="text-foreground font-medium">Routes</span>
          </div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bus className="h-6 w-6 text-primary" /> Transport Routes
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-xl gap-2">
            <Download className="h-4 w-4" /> Download
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl gap-2">
            <FileText className="h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      {/* Route Selector */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Select Route</CardTitle>
        </CardHeader>
        <CardContent>
          <RouteSelectorPanel selected={selectedRoute} onSelect={setSelectedRoute} />
        </CardContent>
      </Card>

      {/* Main Content */}
      {!selectedRoute ? (
        <Card className="rounded-2xl">
          <CardContent className="py-16 text-center text-muted-foreground">
            <Bus className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Select a route to view stops and bus information.</p>
          </CardContent>
        </Card>
      ) : loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Route Map / Stops */}
          <Card className="rounded-2xl lg:col-span-3">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Route Stops</CardTitle>
            </CardHeader>
            <CardContent>
              <TransportRouteMap stops={stops} onStopClick={handleStopClick} />
            </CardContent>
          </Card>

          {/* Bus Info Panel */}
          <div className="lg:col-span-2">
            <BusInformationPanel route={selectedRoute} students={students} />
          </div>
        </div>
      )}
    </motion.div>
  );
}
