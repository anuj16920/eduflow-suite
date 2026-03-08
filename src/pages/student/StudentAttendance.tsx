import { Badge } from "@/components/ui/badge";
import { StatsCard, SimpleCard } from "@/components/dashboard/StatsCard";
import { ClipboardCheck, Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { title: "Total Days", value: "180", change: { value: "On track", positive: true }, icon: Calendar },
  { title: "Present", value: "165", icon: ClipboardCheck, variant: "success" as const },
  { title: "Absent", value: "10", icon: ClipboardCheck, variant: "destructive" as const },
  { title: "Late", value: "5", icon: Clock, variant: "warning" as const },
];

const recentAttendance = [
  { date: "Jan 8, 2024", day: "Monday", status: "present" },
  { date: "Jan 7, 2024", day: "Sunday", status: "holiday" },
  { date: "Jan 6, 2024", day: "Saturday", status: "present" },
  { date: "Jan 5, 2024", day: "Friday", status: "present" },
  { date: "Jan 4, 2024", day: "Thursday", status: "absent" },
];

const statusStyles: Record<string, string> = { present: "bg-emerald-500/10 text-emerald-500", absent: "bg-red-500/10 text-red-500", late: "bg-amber-500/10 text-amber-500", holiday: "bg-muted text-muted-foreground" };

export default function StudentAttendance() {
  return (
    <div className="space-y-8">
      <div><h1 className="text-3xl font-bold">Attendance</h1><p className="text-muted-foreground">Your attendance record</p></div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{stats.map((s, i) => <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}><StatsCard {...s} /></motion.div>)}</div>
      <SimpleCard title="Recent Attendance">
        <div className="space-y-2">{recentAttendance.map((item, i) => (
          <motion.div key={item.date} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
            <div><p className="font-medium text-sm">{item.date}</p><p className="text-xs text-muted-foreground">{item.day}</p></div>
            <Badge className={statusStyles[item.status] || statusStyles.present}>{item.status}</Badge>
          </motion.div>
        ))}</div>
      </SimpleCard>
    </div>
  );
}
