import { useState, useEffect, useRef, memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

export interface TeacherOption {
  id: string;
  profileId: string;
  fullName: string;
  avatarUrl: string | null;
  department: string | null;
  subjects: string[];
}

interface Props {
  selected: TeacherOption | null;
  onSelect: (t: TeacherOption) => void;
}

export const TeacherSelector = memo(function TeacherSelector({ selected, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const { data: teacherRows } = await supabase
        .from("teachers")
        .select("id, profile_id, department, profiles!teachers_profile_id_fkey(full_name, avatar_url)")
        .eq("status", "active");

      if (!teacherRows) return;

      const { data: assignments } = await supabase
        .from("teacher_assignments")
        .select("teacher_id, subjects!teacher_assignments_subject_id_fkey(name)");

      const subjectMap: Record<string, string[]> = {};
      assignments?.forEach((a: any) => {
        if (!subjectMap[a.teacher_id]) subjectMap[a.teacher_id] = [];
        const name = a.subjects?.name;
        if (name && !subjectMap[a.teacher_id].includes(name)) subjectMap[a.teacher_id].push(name);
      });

      setTeachers(
        teacherRows.map((t: any) => ({
          id: t.id,
          profileId: t.profile_id,
          fullName: (t.profiles as any)?.full_name || "Teacher",
          avatarUrl: (t.profiles as any)?.avatar_url || null,
          department: t.department,
          subjects: subjectMap[t.id] || [],
        }))
      );
    })();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = useMemo(
    () => teachers.filter((t) => t.fullName.toLowerCase().includes(query.toLowerCase()) || t.subjects.some((s) => s.toLowerCase().includes(query.toLowerCase()))),
    [teachers, query]
  );

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors text-left"
      >
        {selected ? (
          <>
            <Avatar className="h-10 w-10">
              <AvatarImage src={selected.avatarUrl || undefined} />
              <AvatarFallback>{selected.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{selected.fullName}</p>
              <p className="text-xs text-muted-foreground truncate">{selected.subjects.join(", ") || selected.department || "Teacher"}</p>
            </div>
          </>
        ) : (
          <>
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">Select a teacher...</span>
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
                  placeholder="Search teachers..."
                  className="w-full pl-8 pr-3 py-2 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto p-1">
              {filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No teachers found</p>
              ) : (
                filtered.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { onSelect(t); setOpen(false); setQuery(""); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/50 transition-colors text-left"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={t.avatarUrl || undefined} />
                      <AvatarFallback className="text-xs">{t.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{t.fullName}</p>
                      <p className="text-xs text-muted-foreground truncate">{t.subjects.join(", ") || t.department || ""}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
