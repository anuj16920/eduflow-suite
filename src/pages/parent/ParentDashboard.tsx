import { GraduationCap, Calendar, CreditCard, BookOpen, TrendingUp, AlertCircle, Bell } from "lucide-react";
import { StatsCard, SimpleCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const studentInfo = {
  name: "Aarav Sharma",
  class: "10-A",
  rollNo: 1,
  photo: null,
};

const upcomingExams = [
  { subject: "Mathematics", date: "Jan 15, 2024", time: "9:00 AM" },
  { subject: "Science", date: "Jan 17, 2024", time: "9:00 AM" },
  { subject: "English", date: "Jan 19, 2024", time: "9:00 AM" },
];

const recentHomework = [
  { subject: "Mathematics", topic: "Quadratic Equations", dueDate: "Jan 10", status: "pending" },
  { subject: "English", topic: "Essay Writing", dueDate: "Jan 08", status: "submitted" },
  { subject: "Science", topic: "Chemical Reactions", dueDate: "Jan 12", status: "pending" },
];

const announcements = [
  { title: "Annual Sports Day", message: "Registration open for sports events", date: "Jan 5" },
  { title: "PTM Scheduled", message: "Parent-teacher meeting on Jan 15", date: "Jan 3" },
];

export default function ParentDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Parent Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Mr. Rakesh Sharma</p>
        </div>
        <Button className="gradient-primary border-0 text-primary-foreground hover:opacity-90">
          <CreditCard className="h-4 w-4 mr-2" />
          Pay Fees
        </Button>
      </div>

      {/* Student Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl gradient-primary text-primary-foreground"
      >
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <GraduationCap className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{studentInfo.name}</h2>
            <p className="opacity-80">Class {studentInfo.class} • Roll No. {studentInfo.rollNo}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Attendance"
          value="95%"
          change={{ value: "2%", positive: true }}
          icon={Calendar}
        />
        <StatsCard
          title="Overall Grade"
          value="A+"
          icon={TrendingUp}
          variant="success"
        />
        <StatsCard
          title="Pending Homework"
          value="3"
          icon={BookOpen}
          variant="warning"
        />
        <StatsCard
          title="Fee Due"
          value="₹0"
          icon={CreditCard}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Exams */}
        <SimpleCard title="Upcoming Exams">
          <div className="space-y-3">
            {upcomingExams.map((exam, index) => (
              <div key={index} className="p-3 rounded-lg bg-muted/50">
                <p className="font-medium">{exam.subject}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Calendar className="h-3 w-3" />
                  <span>{exam.date}</span>
                  <span>•</span>
                  <span>{exam.time}</span>
                </div>
              </div>
            ))}
          </div>
        </SimpleCard>

        {/* Homework */}
        <SimpleCard title="Homework">
          <div className="space-y-3">
            {recentHomework.map((hw, index) => (
              <div key={index} className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-sm">{hw.subject}</p>
                  <Badge
                    className={
                      hw.status === "submitted"
                        ? "bg-success/10 text-success"
                        : "bg-warning/10 text-warning"
                    }
                  >
                    {hw.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{hw.topic}</p>
                <p className="text-xs text-muted-foreground mt-1">Due: {hw.dueDate}</p>
              </div>
            ))}
          </div>
        </SimpleCard>

        {/* Announcements */}
        <SimpleCard title="Announcements">
          <div className="space-y-3">
            {announcements.map((ann, index) => (
              <div key={index} className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bell className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{ann.title}</p>
                    <p className="text-sm text-muted-foreground">{ann.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{ann.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SimpleCard>
      </div>
    </div>
  );
}
