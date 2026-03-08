import { motion } from "framer-motion";
import { StatsCard, SimpleCard } from "@/components/dashboard/StatsCard";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, ClipboardCheck, CreditCard, Bell, Clock } from "lucide-react";

const stats = [
  { title: "Attendance", value: "92%", change: { value: "+2%", positive: true }, icon: ClipboardCheck },
  { title: "Pending Homework", value: "3", change: { value: "Due soon", positive: false }, icon: BookOpen, variant: "warning" as const },
  { title: "Upcoming Exams", value: "2", change: { value: "This week", positive: true }, icon: Calendar, variant: "primary" as const },
  { title: "Fee Status", value: "Paid", change: { value: "Up to date", positive: true }, icon: CreditCard, variant: "success" as const },
];

const upcomingClasses = [
  { subject: "Mathematics", time: "9:00 AM", room: "Room 201", teacher: "Dr. Kumar" },
  { subject: "Physics", time: "10:30 AM", room: "Lab 3", teacher: "Mrs. Sharma" },
  { subject: "English", time: "12:00 PM", room: "Room 105", teacher: "Mr. Singh" },
];

const announcements = [
  { title: "Annual Sports Day", message: "Sports day scheduled for March 15th", date: "Today", priority: "high" },
  { title: "Library Books", message: "Return all library books by March 10th", date: "Yesterday", priority: "normal" },
];

export default function StudentDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SimpleCard title="Today's Classes">
          <div className="space-y-3">
            {upcomingClasses.map((cls) => (
              <motion.div key={cls.subject} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div><p className="font-medium">{cls.subject}</p><p className="text-sm text-muted-foreground">{cls.teacher} · {cls.room}</p></div>
                <Badge variant="outline">{cls.time}</Badge>
              </motion.div>
            ))}
          </div>
        </SimpleCard>

        <SimpleCard title="Announcements">
          <div className="space-y-3">
            {announcements.map((a) => (
              <motion.div key={a.title} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                className="p-3 rounded-xl bg-muted/30">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium">{a.title}</p>
                  <Badge variant={a.priority === "high" ? "destructive" : "secondary"}>{a.priority}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{a.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{a.date}</p>
              </motion.div>
            ))}
          </div>
        </SimpleCard>
      </div>
    </div>
  );
}
