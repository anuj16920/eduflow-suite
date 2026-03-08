import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ClassSelectorPanel, WeeklyTimetableGrid, ClassDetailsDrawer } from "@/components/timetable";
import type { TimetableEntry } from "@/components/timetable/TimetableCell";

export default function TimetableViewerPage() {
  const [selectedClass, setSelectedClass] = useState("");
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerEntry, setDrawerEntry] = useState<TimetableEntry | null>(null);

  useEffect(() => {
    if (!selectedClass) { setEntries([]); return; }
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("timetable")
        .select("id, day_of_week, start_time, end_time, room, subjects!timetable_subject_id_fkey(name, code), teachers!timetable_teacher_id_fkey(profiles!teachers_profile_id_fkey(full_name))")
        .eq("class_id", selectedClass)
        .order("day_of_week")
        .order("start_time");

      setEntries(
        (data || []).map((t: any) => ({
          id: t.id,
          dayOfWeek: t.day_of_week,
          startTime: t.start_time,
          endTime: t.end_time,
          subjectName: t.subjects?.name || "Unknown",
          subjectCode: t.subjects?.code || null,
          teacherName: t.teachers?.profiles?.full_name || "TBA",
          room: t.room,
        }))
      );
      setLoading(false);
    })();
  }, [selectedClass]);

  const handlePrint = useCallback(() => window.print(), []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-6 max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>Dashboard</span><span>/</span><span>Timetable</span><span>/</span><span className="text-foreground font-medium">Weekly Schedule</span>
          </div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-primary" /> Class Timetable
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-xl gap-2" onClick={handlePrint}>
            <Printer className="h-4 w-4" /> Print
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl gap-2">
            <Download className="h-4 w-4" /> Download PDF
          </Button>
        </div>
      </div>

      {/* Class Selector */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Select Class</CardTitle>
        </CardHeader>
        <CardContent>
          <ClassSelectorPanel selectedClass={selectedClass} onClassChange={setSelectedClass} />
        </CardContent>
      </Card>

      {/* Timetable Grid */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedClass ? (
            <div className="text-center py-16 text-muted-foreground">
              <CalendarDays className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Select a class to view its timetable.</p>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
          ) : (
            <WeeklyTimetableGrid entries={entries} onCellClick={setDrawerEntry} />
          )}
        </CardContent>
      </Card>

      {/* Details Drawer */}
      <ClassDetailsDrawer entry={drawerEntry} onClose={() => setDrawerEntry(null)} />
    </motion.div>
  );
}
