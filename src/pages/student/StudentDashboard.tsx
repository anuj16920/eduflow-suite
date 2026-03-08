import { motion } from "framer-motion";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, ClipboardCheck, CreditCard, Bell, Clock } from "lucide-react";

const stats = [
  { title: "Attendance", value: "92%", change: "+2%", icon: ClipboardCheck },
  { title: "Pending Homework", value: "3", change: "Due soon", icon: BookOpen },
  { title: "Upcoming Exams", value: "2", change: "This week", icon: Calendar },
  { title: "Fee Status", value: "Paid", change: "Up to date", icon: CreditCard },
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <StatsCard title={stat.title} value={stat.value} change={stat.change} icon={stat.icon} />
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-primary" /> Today's Classes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingClasses.map((cls) => (
              <motion.div key={cls.subject} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">{cls.subject}</p>
                  <p className="text-sm text-muted-foreground">{cls.teacher} · {cls.room}</p>
                </div>
                <Badge variant="outline">{cls.time}</Badge>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary" /> Announcements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {announcements.map((a) => (
              <motion.div key={a.title} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium">{a.title}</p>
                  <Badge variant={a.priority === "high" ? "destructive" : "secondary"}>{a.priority}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{a.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{a.date}</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
