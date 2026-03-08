import { useState, useEffect, useRef, memo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Student {
  id: string;
  profile_id: string;
  full_name: string;
  email: string;
  avatar_url?: string | null;
  admission_number?: string | null;
}

interface StudentSelectorProps {
  selected: Student | null;
  onSelect: (student: Student) => void;
}

export const StudentSelector = memo(function StudentSelector({ selected, onSelect }: StudentSelectorProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.from("students").select("id, profile_id, admission_number, profiles(full_name, email, avatar_url)")
      .then(({ data }) => {
        if (data) setStudents(data.map((s: any) => ({
          id: s.id, profile_id: s.profile_id,
          full_name: s.profiles?.full_name || "Unknown",
          email: s.profiles?.email || "",
          avatar_url: s.profiles?.avatar_url,
          admission_number: s.admission_number,
        })));
      });
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = students.filter((s) => {
    const q = query.toLowerCase();
    return s.full_name.toLowerCase().includes(q) || (s.admission_number || "").toLowerCase().includes(q);
  });

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      <div
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-3 h-11 px-3 rounded-xl border cursor-pointer transition-colors",
          "bg-card border-border hover:border-primary/50",
          open && "border-primary ring-2 ring-primary/20"
        )}
      >
        {selected ? (
          <>
            <Avatar className="h-7 w-7">
              <AvatarImage src={selected.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {selected.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{selected.full_name}</p>
            </div>
          </>
        ) : (
          <span className="text-sm text-muted-foreground flex-1">Select a student...</span>
        )}
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-1 left-0 right-0 z-50 rounded-xl border border-border bg-card shadow-xl overflow-hidden"
          >
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-8 h-8 text-sm border-0 bg-muted/50 focus-visible:ring-0"
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto p-1">
              {filtered.length === 0 ? (
                <p className="text-center py-4 text-sm text-muted-foreground">No students found</p>
              ) : (
                filtered.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => { onSelect(s); setOpen(false); setQuery(""); }}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-muted/60",
                      selected?.id === s.id && "bg-primary/5"
                    )}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={s.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                        {s.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{s.full_name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{s.admission_number || s.email}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
