import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface ExamFiltersPanelProps {
  classes: { id: string; name: string; section: string | null }[];
  selectedClass: string;
  onClassChange: (v: string) => void;
  selectedExamType: string;
  onExamTypeChange: (v: string) => void;
  selectedStatus: string;
  onStatusChange: (v: string) => void;
  onReset: () => void;
}

export function ExamFiltersPanel({
  classes, selectedClass, onClassChange,
  selectedExamType, onExamTypeChange,
  selectedStatus, onStatusChange,
  onReset,
}: ExamFiltersPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-3"
    >
      <Select value={selectedClass} onValueChange={onClassChange}>
        <SelectTrigger className="w-[180px] rounded-xl bg-muted/40 border-0">
          <SelectValue placeholder="All Classes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Classes</SelectItem>
          {classes.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}{c.section ? `-${c.section}` : ""}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedExamType} onValueChange={onExamTypeChange}>
        <SelectTrigger className="w-[160px] rounded-xl bg-muted/40 border-0">
          <SelectValue placeholder="Exam Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="midterm">Midterm</SelectItem>
          <SelectItem value="final">Final</SelectItem>
          <SelectItem value="quiz">Quiz</SelectItem>
          <SelectItem value="practical">Practical</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedStatus} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[160px] rounded-xl bg-muted/40 border-0">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="upcoming">Upcoming</SelectItem>
          <SelectItem value="ongoing">Ongoing</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="ghost" size="sm" className="rounded-xl" onClick={onReset}>
        <RotateCcw className="h-4 w-4 mr-1" /> Reset
      </Button>
    </motion.div>
  );
}
