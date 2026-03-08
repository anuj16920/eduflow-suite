import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Command, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SearchResultsDropdown } from "./SearchResultsDropdown";
import type { SearchResult, SearchCategory } from "./types";

export function GlobalSearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<SearchCategory>("all");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const navigate = useNavigate();
  const { role } = useAuth();

  // Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const searchAll = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    const items: SearchResult[] = [];
    const term = `%${q}%`;

    try {
      // Students
      if (!role || role === "admin" || role === "teacher" || role === "student") {
        const { data: students } = await supabase
          .from("students")
          .select("id, admission_number, roll_number, profiles(full_name, email, avatar_url)")
          .ilike("profiles.full_name", term)
          .limit(5);
        students?.forEach((s: any) => {
          if (s.profiles?.full_name) {
            items.push({
              id: s.id, type: "student",
              title: s.profiles.full_name,
              description: `Roll #${s.roll_number || "—"} • ${s.admission_number || ""}`,
              avatar: s.profiles.avatar_url,
              link: role === "admin" ? "/admin/students" : `/${role}/`,
            });
          }
        });
      }

      // Teachers
      if (!role || role === "admin") {
        const { data: teachers } = await supabase
          .from("teachers")
          .select("id, employee_id, department, profiles(full_name, email, avatar_url)")
          .ilike("profiles.full_name", term)
          .limit(5);
        teachers?.forEach((t: any) => {
          if (t.profiles?.full_name) {
            items.push({
              id: t.id, type: "teacher",
              title: t.profiles.full_name,
              description: `${t.department || "Faculty"} • ${t.employee_id || ""}`,
              avatar: t.profiles.avatar_url,
              link: "/admin/teachers",
            });
          }
        });
      }

      // Classes
      if (!role || role === "admin" || role === "teacher") {
        const { data: classes } = await supabase
          .from("classes")
          .select("id, name, section, grade_level")
          .ilike("name", term)
          .limit(5);
        classes?.forEach((c) => {
          items.push({
            id: c.id, type: "class",
            title: c.name,
            description: `Grade ${c.grade_level || "—"} • Section ${c.section || "—"}`,
            link: role === "admin" ? "/admin/academics" : "/teacher/classes",
          });
        });
      }

      // Subjects
      const { data: subjects } = await supabase
        .from("subjects")
        .select("id, name, code")
        .ilike("name", term)
        .limit(5);
      subjects?.forEach((s) => {
        items.push({
          id: s.id, type: "subject",
          title: s.name,
          description: s.code || "Subject",
          link: role === "admin" ? "/admin/academics/subjects" : `/${role}/`,
        });
      });

      // Announcements
      const { data: announcements } = await supabase
        .from("announcements")
        .select("id, title, message, priority")
        .ilike("title", term)
        .limit(5);
      announcements?.forEach((a) => {
        items.push({
          id: a.id, type: "announcement",
          title: a.title,
          description: a.message?.slice(0, 60) + "..." || "",
          link: role === "admin" ? "/admin/communication" : `/${role}/`,
        });
      });

      // Exams
      if (!role || role === "admin" || role === "teacher" || role === "parent") {
        const { data: exams } = await supabase
          .from("exams")
          .select("id, name, exam_type, status")
          .ilike("name", term)
          .limit(5);
        exams?.forEach((e) => {
          items.push({
            id: e.id, type: "exam",
            title: e.name,
            description: `${e.exam_type || "Exam"} • ${e.status || ""}`,
            link: role === "admin" ? "/admin/academics/exams" : `/${role}/`,
          });
        });
      }

      // Homework
      const { data: homework } = await supabase
        .from("homework")
        .select("id, title, due_date, status")
        .ilike("title", term)
        .limit(5);
      homework?.forEach((h) => {
        items.push({
          id: h.id, type: "homework",
          title: h.title,
          description: `Due: ${h.due_date} • ${h.status || ""}`,
          link: role === "admin" ? "/admin/homework" : `/${role}/homework`,
        });
      });

    } catch (err) {
      console.error("Search error:", err);
    }

    setResults(items);
    setLoading(false);
  }, [role]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchAll(query), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, searchAll]);

  const handleSelect = (result: SearchResult) => {
    navigate(result.link);
    setOpen(false);
    setQuery("");
  };

  const handleSearchSubmit = () => {
    if (query.trim()) {
      navigate(`/${role || "admin"}/search?q=${encodeURIComponent(query)}`);
      setOpen(false);
    }
  };

  const filteredResults = activeCategory === "all"
    ? results
    : results.filter((r) => r.type === activeCategory);

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
        className="hidden md:flex items-center gap-2 h-10 w-72 lg:w-80 rounded-xl bg-muted/40 hover:bg-muted/60 px-3 text-sm text-muted-foreground transition-all duration-200 border border-border/50 hover:border-primary/30 group"
      >
        <Search className="h-4 w-4 shrink-0 group-hover:text-primary transition-colors" />
        <span className="flex-1 text-left">Search anything...</span>
        <kbd className="hidden lg:inline-flex h-5 items-center gap-0.5 rounded border border-border/60 bg-muted/60 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <Command className="h-2.5 w-2.5" />K
        </kbd>
      </button>

      {/* Mobile trigger */}
      <button
        onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
        className="md:hidden flex items-center justify-center h-9 w-9 rounded-lg hover:bg-muted/60 transition-colors"
      >
        <Search className="h-5 w-5" />
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="fixed left-1/2 -translate-x-1/2 top-20 w-[calc(100%-2rem)] max-w-[640px] z-50 rounded-2xl bg-popover/95 backdrop-blur-xl shadow-2xl shadow-primary/5 border border-border/40 overflow-hidden"
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border/30">
                <Search className="h-5 w-5 text-primary shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                  placeholder="Search students, teachers, classes, exams..."
                  className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                  autoFocus
                />
                {loading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                {query && !loading && (
                  <button onClick={() => setQuery("")} className="p-0.5 rounded-md hover:bg-muted/60 transition-colors">
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
                <kbd className="hidden md:inline-flex h-5 items-center rounded border border-border/50 bg-muted/40 px-1.5 font-mono text-[10px] text-muted-foreground">
                  ESC
                </kbd>
              </div>

              {/* Category pills */}
              <div className="flex items-center gap-1.5 px-4 py-2 border-b border-border/20 overflow-x-auto scrollbar-none">
                {(["all", "student", "teacher", "class", "subject", "announcement", "exam", "homework"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`shrink-0 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                      activeCategory === cat
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted/40 text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                    }`}
                  >
                    {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1) + "s"}
                  </button>
                ))}
              </div>

              {/* Results */}
              <SearchResultsDropdown
                results={filteredResults}
                loading={loading}
                query={query}
                onSelect={handleSelect}
              />

              {/* Footer */}
              {query && results.length > 0 && (
                <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/20 bg-muted/20">
                  <span className="text-xs text-muted-foreground">
                    {results.length} result{results.length !== 1 ? "s" : ""} found
                  </span>
                  <button
                    onClick={handleSearchSubmit}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    View all results →
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
