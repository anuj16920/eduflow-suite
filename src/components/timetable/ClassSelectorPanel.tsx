import { useState, useEffect, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  selectedClass: string;
  onClassChange: (id: string) => void;
}

export const ClassSelectorPanel = memo(function ClassSelectorPanel({ selectedClass, onClassChange }: Props) {
  const [classes, setClasses] = useState<{ id: string; name: string; section: string | null; gradeLevel: number | null }[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("classes").select("id, name, section, grade_level").order("name");
      setClasses(data?.map((c) => ({ id: c.id, name: c.name, section: c.section, gradeLevel: c.grade_level })) || []);
    })();
  }, []);

  const grouped = useMemo(() => {
    const map: Record<string, typeof classes> = {};
    classes.forEach((c) => {
      const key = c.name;
      if (!map[key]) map[key] = [];
      map[key].push(c);
    });
    return map;
  }, [classes]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Filter className="h-4 w-4 text-muted-foreground" />
      <select
        value={selectedClass}
        onChange={(e) => onClassChange(e.target.value)}
        className="px-3 py-2 text-sm rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="">Select Class</option>
        {Object.entries(grouped).map(([name, items]) => (
          <optgroup key={name} label={name}>
            {items.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}{c.section ? ` - ${c.section}` : ""}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      {selectedClass && (
        <Button variant="ghost" size="sm" className="rounded-xl gap-1 text-xs" onClick={() => onClassChange("")}>
          <RotateCcw className="h-3 w-3" /> Reset
        </Button>
      )}
    </div>
  );
});
