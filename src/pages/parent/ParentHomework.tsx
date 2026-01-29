import { useState } from "react";
import { BookOpen, Calendar, Clock, CheckCircle } from "lucide-react";
import { SimpleCard, StatsCard } from "@/components/dashboard/StatsCard";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function ParentHomework() {
  const [homework] = useState<{ subject: string; title: string; dueDate: string; status: string }[]>([]);
  const pending = homework.filter(h => h.status === "pending").length;
  const submitted = homework.filter(h => h.status === "submitted").length;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Homework</h1><p className="text-muted-foreground">Track homework assignments</p></div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total" value={homework.length} icon={BookOpen} />
        <StatsCard title="Pending" value={pending} icon={Clock} variant="warning" />
        <StatsCard title="Submitted" value={submitted} icon={CheckCircle} variant="success" />
        <StatsCard title="Overdue" value={homework.filter(h => h.status === "overdue").length} icon={Calendar} variant="destructive" />
      </div>
      <SimpleCard title="Homework List">
        {homework.length === 0 ? (
          <div className="text-center py-12"><BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" /><p className="text-muted-foreground">No homework assigned</p></div>
        ) : (
          <div className="space-y-3">{homework.map((hw, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-lg border">
              <div className="flex justify-between items-start"><div><Badge variant="secondary">{hw.subject}</Badge><p className="font-medium mt-2">{hw.title}</p><p className="text-sm text-muted-foreground">Due: {hw.dueDate}</p></div>
              <Badge className={hw.status === "submitted" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}>{hw.status}</Badge></div>
            </motion.div>
          ))}</div>
        )}
      </SimpleCard>
    </div>
  );
}
