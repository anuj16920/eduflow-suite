import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Upload } from "lucide-react";
import { motion } from "framer-motion";

const homework = [
  { id: 1, subject: "Mathematics", title: "Quadratic Equations", dueDate: "Jan 10", status: "pending", teacher: "Dr. Kumar" },
  { id: 2, subject: "English", title: "Essay Writing", dueDate: "Jan 8", status: "submitted", teacher: "Mrs. Sharma" },
  { id: 3, subject: "Physics", title: "Newton's Laws", dueDate: "Jan 12", status: "graded", grade: "A", teacher: "Mr. Singh" },
  { id: 4, subject: "Chemistry", title: "Chemical Reactions", dueDate: "Jan 15", status: "pending", teacher: "Mrs. Patel" },
];

const statusColors: Record<string, string> = { pending: "bg-amber-500/10 text-amber-500", submitted: "bg-primary/10 text-primary", graded: "bg-emerald-500/10 text-emerald-500" };

export default function StudentHomework() {
  return (
    <div className="space-y-8">
      <div><h1 className="text-3xl font-bold">Homework</h1><p className="text-muted-foreground">View and submit your assignments</p></div>
      <div className="grid gap-4">{homework.map((hw, i) => (
        <motion.div key={hw.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="p-5 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center"><BookOpen className="h-5 w-5 text-primary" /></div>
              <div><h3 className="font-semibold">{hw.title}</h3><p className="text-sm text-muted-foreground">{hw.subject} • {hw.teacher}</p><p className="text-xs text-muted-foreground mt-1">Due: {hw.dueDate}</p></div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={statusColors[hw.status]}>{hw.status}</Badge>
              {hw.grade && <Badge className="bg-emerald-500/10 text-emerald-500">{hw.grade}</Badge>}
              {hw.status === "pending" && <Button size="sm" variant="ghost" className="text-primary"><Upload className="h-4 w-4 mr-1" />Upload</Button>}
            </div>
          </div>
        </motion.div>
      ))}</div>
    </div>
  );
}
