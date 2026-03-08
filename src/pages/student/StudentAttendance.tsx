import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ClipboardCheck, UserCheck, UserX, Clock } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { title: "Total Days", value: "180", change: "Academic year", icon: ClipboardCheck },
  { title: "Present", value: "166", change: "92.2%", icon: UserCheck },
  { title: "Absent", value: "10", change: "5.6%", icon: UserX },
  { title: "Late", value: "4", change: "2.2%", icon: Clock },
];

const recentAttendance = [
  { date: "Mar 7, 2026", day: "Friday", status: "present" },
  { date: "Mar 6, 2026", day: "Thursday", status: "present" },
  { date: "Mar 5, 2026", day: "Wednesday", status: "late" },
  { date: "Mar 4, 2026", day: "Tuesday", status: "present" },
  { date: "Mar 3, 2026", day: "Monday", status: "absent" },
  { date: "Feb 28, 2026", day: "Friday", status: "present" },
  { date: "Feb 27, 2026", day: "Thursday", status: "present" },
];

const statusStyles: Record<string, string> = {
  present: "default",
  absent: "destructive",
  late: "secondary",
};

export default function StudentAttendance() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Attendance</h1>
        <p className="text-muted-foreground">Your attendance record for 2025-2026</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <StatsCard title={stat.title} value={stat.value} change={stat.change} icon={stat.icon} />
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Recent Attendance</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {recentAttendance.map((a, i) => (
            <motion.div key={a.date} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">{a.date}</p>
                <p className="text-sm text-muted-foreground">{a.day}</p>
              </div>
              <Badge variant={statusStyles[a.status] as any}>{a.status}</Badge>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
