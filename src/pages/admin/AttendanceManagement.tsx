import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SimpleCard, StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { UserCheck, Users, AlertCircle, Calendar, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function AttendanceManagement() {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
    fetchAttendance();
  }, [selectedDate, selectedClass]);

  const fetchClasses = async () => {
    const { data } = await supabase.from("classes").select("*");
    if (data) setClasses(data);
  };

  const fetchAttendance = async () => {
    setLoading(true);
    let query = supabase
      .from("attendance")
      .select("*, students(*, profiles(*)), classes(*)")
      .eq("date", selectedDate);
    if (selectedClass) query = query.eq("class_id", selectedClass);
    const { data } = await query;
    if (data) setAttendance(data);
    setLoading(false);
  };

  const present = attendance.filter((a) => a.status === "present").length;
  const absent = attendance.filter((a) => a.status === "absent").length;
  const late = attendance.filter((a) => a.status === "late").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Attendance Management</h1>
          <p className="text-muted-foreground">Track and manage student attendance records</p>
        </div>
        <div className="flex items-center gap-3">
          <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-44" />
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-44"><SelectValue placeholder="All Classes" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Classes</SelectItem>
              {classes.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <StatsCard title="Total Records" value={attendance.length} icon={Users} />
        <StatsCard title="Present" value={present} icon={UserCheck} variant="success" />
        <StatsCard title="Absent" value={absent} icon={AlertCircle} variant="destructive" />
        <StatsCard title="Late" value={late} icon={Calendar} variant="warning" />
      </div>

      <SimpleCard title={`Attendance for ${new Date(selectedDate).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`}>
        {loading ? (
          <div className="text-center py-12">
            <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-3" />
            <p className="text-muted-foreground">Loading attendance...</p>
          </div>
        ) : attendance.length === 0 ? (
          <div className="text-center py-12">
            <UserCheck className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No attendance records for this date</p>
            <p className="text-sm text-muted-foreground">Teachers can mark attendance from their portal</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.students?.profiles?.full_name || "—"}</TableCell>
                  <TableCell><Badge variant="secondary">{a.classes?.name || "—"}</Badge></TableCell>
                  <TableCell>
                    <Badge className={
                      a.status === "present" ? "bg-success/10 text-success" :
                      a.status === "absent" ? "bg-destructive/10 text-destructive" :
                      "bg-warning/10 text-warning"
                    }>{a.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{a.check_in || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{a.check_out || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{a.remarks || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SimpleCard>
    </div>
  );
}
