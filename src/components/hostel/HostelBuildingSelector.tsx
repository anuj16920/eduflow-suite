import { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, ChevronDown, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export interface BuildingOption {
  id: string;
  name: string;
  type: string | null;
  totalFloors: number;
}

interface Props {
  selected: BuildingOption | null;
  onSelect: (b: BuildingOption) => void;
}

export const HostelBuildingSelector = memo(function HostelBuildingSelector({ selected, onSelect }: Props) {
  const [buildings, setBuildings] = useState<BuildingOption[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("hostel_buildings").select("*").eq("status", "active").order("name");
      setBuildings((data || []).map((b: any) => ({ id: b.id, name: b.name, type: b.type, totalFloors: b.total_floors || 3 })));
    })();
  }, []);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors text-left">
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${selected ? "bg-primary/10" : "bg-muted"}`}>
          <Building2 className={`h-5 w-5 ${selected ? "text-primary" : "text-muted-foreground"}`} />
        </div>
        <div className="flex-1 min-w-0">
          {selected ? (
            <>
              <p className="font-medium text-sm truncate">{selected.name}</p>
              <p className="text-xs text-muted-foreground">{selected.type} • {selected.totalFloors} floors</p>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">Select a hostel building...</span>
          )}
        </div>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }} className="absolute z-50 top-full mt-2 w-full bg-popover border border-border rounded-xl shadow-lg overflow-hidden">
            <div className="max-h-60 overflow-y-auto p-1">
              {buildings.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No buildings found</p>
              ) : buildings.map((b) => (
                <button key={b.id} onClick={() => { onSelect(b); setOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/50 transition-colors text-left">
                  <Building2 className="h-4 w-4 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{b.name}</p>
                    <p className="text-xs text-muted-foreground">{b.type} • {b.totalFloors} floors</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
