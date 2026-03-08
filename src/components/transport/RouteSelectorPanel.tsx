import { useState, useEffect, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bus, RotateCcw, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export interface RouteOption {
  id: string;
  routeName: string;
  busNumber: string | null;
  driverName: string | null;
  driverPhone: string | null;
  capacity: number | null;
  status: string | null;
}

interface Props {
  selected: RouteOption | null;
  onSelect: (r: RouteOption) => void;
}

export const RouteSelectorPanel = memo(function RouteSelectorPanel({ selected, onSelect }: Props) {
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("transport_routes").select("*").order("route_name");
      setRoutes(
        (data || []).map((r) => ({
          id: r.id,
          routeName: r.route_name,
          busNumber: r.bus_number,
          driverName: r.driver_name,
          driverPhone: r.driver_phone,
          capacity: r.capacity,
          status: r.status,
        }))
      );
    })();
  }, []);

  const filtered = useMemo(
    () => routes.filter((r) =>
      r.routeName.toLowerCase().includes(query.toLowerCase()) ||
      (r.busNumber || "").toLowerCase().includes(query.toLowerCase())
    ),
    [routes, query]
  );

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors text-left"
      >
        {selected ? (
          <>
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Bus className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{selected.routeName}</p>
              <p className="text-xs text-muted-foreground truncate">
                {selected.busNumber ? `Bus ${selected.busNumber}` : "No bus assigned"} • {selected.driverName || "No driver"}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
              <Bus className="h-5 w-5 text-muted-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">Select a route...</span>
          </>
        )}
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 top-full mt-2 w-full bg-popover border border-border rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search routes or bus number..."
                  className="w-full pl-8 pr-3 py-2 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto p-1">
              {filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No routes found</p>
              ) : (
                filtered.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => { onSelect(r); setOpen(false); setQuery(""); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/50 transition-colors text-left"
                  >
                    <Bus className="h-4 w-4 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{r.routeName}</p>
                      <p className="text-xs text-muted-foreground truncate">{r.busNumber || "—"} • {r.driverName || "No driver"}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selected && (
        <Button variant="ghost" size="sm" className="absolute right-12 top-1/2 -translate-y-1/2 rounded-xl" onClick={() => { onSelect(null as any); }}>
          <RotateCcw className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
});
