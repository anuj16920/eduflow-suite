import { BookOpen, Clock, Users, CheckCircle, AlertCircle } from "lucide-react";
import { StatsCard, SimpleCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const todayClasses = [
  { time: "8:00 AM", class: "10-A", subject: "Mathematics", room: "Room 101", status: "completed" },
  { time: "9:00 AM", class: "10-B", subject: "Mathematics", room: "Room 102", status: "completed" },
  { time: "10:00 AM", class: "11-A", subject: "Mathematics", room: "Room 201", status: "ongoing" },
  { time: "11:00 AM", class: "12-A", subject: "Mathematics", room: "Room 301", status: "upcoming" },
  { time: "12:00 PM", class: "12-B", subject: "Mathematics", room: "Room 302", status: "upcoming" },
];

const pendingHomework = [
  { class: "10-A", topic: "Quadratic Equations", dueDate: "Jan 10", submissions: 28, total: 35 },
  { class: "11-A", topic: "Trigonometry", dueDate: "Jan 12", submissions: 20, total: 32 },
];

const recentMessages = [
  { from: "Mrs. Sharma (Parent)", message: "Question about Aarav's homework", time: "1 hour ago" },
  { from: "Admin", message: "Staff meeting tomorrow at 3 PM", time: "2 hours ago" },
];

export default function TeacherDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Dr. Rajesh Kumar</p>
        </div>
        <Button className="gradient-primary border-0 text-primary-foreground hover:opacity-90">
          Mark Attendance
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Today's Classes"
          value="5"
          icon={BookOpen}
        />
        <StatsCard
          title="Total Students"
          value="156"
          icon={Users}
        />
        <StatsCard
          title="Pending Reviews"
          value="12"
          icon={AlertCircle}
          variant="warning"
        />
        <StatsCard
          title="Completed Tasks"
          value="28"
          icon={CheckCircle}
          variant="success"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2">
          <SimpleCard title="Today's Schedule">
            <div className="space-y-3">
              {todayClasses.map((cls, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    cls.status === "ongoing"
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[70px]">
                      <p className="text-sm font-medium">{cls.time}</p>
                    </div>
                    <div>
                      <p className="font-medium">{cls.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        {cls.class} • {cls.room}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={
                      cls.status === "completed"
                        ? "bg-success/10 text-success"
                        : cls.status === "ongoing"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {cls.status.charAt(0).toUpperCase() + cls.status.slice(1)}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </SimpleCard>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Pending Homework */}
          <SimpleCard title="Pending Homework">
            <div className="space-y-4">
              {pendingHomework.map((hw, index) => (
                <div key={index} className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{hw.class}</Badge>
                    <span className="text-xs text-muted-foreground">Due: {hw.dueDate}</span>
                  </div>
                  <p className="text-sm font-medium mb-2">{hw.topic}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(hw.submissions / hw.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {hw.submissions}/{hw.total}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </SimpleCard>

          {/* Recent Messages */}
          <SimpleCard title="Recent Messages">
            <div className="space-y-3">
              {recentMessages.map((msg, index) => (
                <div key={index} className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm font-medium">{msg.from}</p>
                  <p className="text-sm text-muted-foreground">{msg.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{msg.time}</p>
                </div>
              ))}
              <Button variant="outline" className="w-full" size="sm">
                View All Messages
              </Button>
            </div>
          </SimpleCard>
        </div>
      </div>
    </div>
  );
}
