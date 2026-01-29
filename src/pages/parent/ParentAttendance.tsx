import { useState } from "react";
import { Calendar, Check, X, Clock, TrendingUp } from "lucide-react";
import { SimpleCard, StatsCard } from "@/components/dashboard/StatsCard";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ParentAttendance() {
  const [selectedMonth, setSelectedMonth] = useState("january");
  const [attendance] = useState<{ date: string; status: string }[]>([]);
  const present = attendance.filter(a => a.status === "present").length;
  const absent = attendance.filter(a => a.status === "absent").length;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Attendance</h1><p className="text-muted-foreground">View your child's attendance record</p></div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Present Days" value={present} icon={Check} variant="success" />
        <StatsCard title="Absent Days" value={absent} icon={X} variant="destructive" />
        <StatsCard title="Attendance %" value={attendance.length > 0 ? Math.round((present / attendance.length) * 100) + "%" : "N/A"} icon={TrendingUp} variant="primary" />
        <StatsCard title="Total Days" value={attendance.length} icon={Calendar} />
      </div>
      <SimpleCard title="Attendance Calendar" action={
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["January", "February", "March", "April", "May", "June"].map(m => <SelectItem key={m} value={m.toLowerCase()}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
      }>
        {attendance.length === 0 ? (
          <div className="text-center py-12"><Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" /><p className="text-muted-foreground">No attendance data available</p></div>
        ) : (
          <div className="grid grid-cols-7 gap-2">{attendance.map((a, i) => (
            <div key={i} className={`p-2 rounded text-center text-sm ${a.status === "present" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>{a.date}</div>
          ))}</div>
        )}
      </SimpleCard>
    </div>
  );
}
