import { Users, GraduationCap, CreditCard, AlertCircle, TrendingUp, Calendar, Clock } from "lucide-react";
import { StatsCard, SimpleCard } from "@/components/dashboard/StatsCard";
import { KPIStudentCard } from "@/components/dashboard/KPIStudentCard";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const stats = [
  { title: "Total Students", value: "2,847", change: { value: "12%", positive: true }, icon: GraduationCap, variant: "default" as const },
  { title: "Total Teachers", value: "156", change: { value: "3%", positive: true }, icon: Users, variant: "primary" as const },
  { title: "Fees Collected", value: "₹24.5L", change: { value: "8%", positive: true }, icon: CreditCard, variant: "success" as const },
  { title: "Pending Dues", value: "₹3.2L", change: { value: "5%", positive: false }, icon: AlertCircle, variant: "warning" as const },
];

const recentActivities = [
  { action: "New student enrolled", name: "Rahul Sharma", class: "Class 10-A", time: "2 mins ago" },
  { action: "Fee payment received", name: "Priya Patel", amount: "₹15,000", time: "15 mins ago" },
  { action: "Leave approved", name: "Mr. Rajesh Kumar", days: "2 days", time: "1 hour ago" },
  { action: "Exam results uploaded", name: "Class 12-B", subject: "Physics", time: "2 hours ago" },
  { action: "Parent meeting scheduled", name: "Mrs. Sunita Verma", date: "Tomorrow", time: "3 hours ago" },
];

const quickActions = [
  { label: "Add Student", icon: GraduationCap },
  { label: "Add Teacher", icon: Users },
  { label: "Send Notice", icon: Calendar },
  { label: "Collect Fee", icon: CreditCard },
];

const upcomingEvents = [
  { title: "Parent-Teacher Meeting", date: "Jan 15, 2024", time: "10:00 AM" },
  { title: "Annual Sports Day", date: "Jan 20, 2024", time: "8:00 AM" },
  { title: "Science Exhibition", date: "Jan 25, 2024", time: "9:00 AM" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Administrator</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="text-muted-foreground">Download Report</Button>
          <Button className="gradient-primary border-0 text-primary-foreground hover:opacity-90 rounded-xl">
            Add New Student
          </Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SimpleCard title="Recent Activities">
            <div className="space-y-1">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between py-4 border-b border-border/30 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">
                        {activity.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.name}
                        {activity.class && ` • ${activity.class}`}
                        {activity.amount && ` • ${activity.amount}`}
                        {activity.days && ` • ${activity.days}`}
                        {activity.subject && ` • ${activity.subject}`}
                        {activity.date && ` • ${activity.date}`}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                </motion.div>
              ))}
            </div>
          </SimpleCard>
        </div>

        <div className="space-y-6">
          <SimpleCard title="Quick Actions">
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  className="flex flex-col items-center gap-2 py-5 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors"
                >
                  <action.icon className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </SimpleCard>

          <SimpleCard title="Upcoming Events">
            <div className="space-y-3">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{event.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{event.date}</span>
                      <span>•</span>
                      <Clock className="h-3 w-3" />
                      <span>{event.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SimpleCard>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <SimpleCard title="Today's Attendance">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Students Present</span>
              <span className="text-2xl font-bold">2,654</span>
            </div>
            <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: "93.2%" }} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">93.2% attendance rate</span>
              <span className="flex items-center gap-1 text-emerald-500">
                <TrendingUp className="h-4 w-4" />+2.1% from yesterday
              </span>
            </div>
          </div>
        </SimpleCard>

        <SimpleCard title="Fee Collection This Month">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Collected</span>
              <span className="text-2xl font-bold">₹18.5L / ₹24L</span>
            </div>
            <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
              <div className="h-full gradient-primary rounded-full" style={{ width: "77%" }} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">77% of target achieved</span>
              <span className="flex items-center gap-1 text-amber-500">
                <AlertCircle className="h-4 w-4" />₹5.5L pending
              </span>
            </div>
          </div>
        </SimpleCard>
      </div>
    </div>
  );
}
