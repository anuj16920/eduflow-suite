import { memo } from "react";
import { motion } from "framer-motion";
import { Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface AnalyticsFiltersPanelProps {
  academicYear: string;
  onAcademicYearChange: (v: string) => void;
  semester: string;
  onSemesterChange: (v: string) => void;
  onReset: () => void;
}

function AnalyticsFiltersPanelComponent({
  academicYear,
  onAcademicYearChange,
  semester,
  onSemesterChange,
  onReset,
}: AnalyticsFiltersPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-muted/30 backdrop-blur-sm"
    >
      <Filter className="h-4 w-4 text-muted-foreground" />
      <Select value={academicYear} onValueChange={onAcademicYearChange}>
        <SelectTrigger className="w-[160px] rounded-xl bg-background/60 border-border/50">
          <SelectValue placeholder="Academic Year" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="2025-2026">2025-2026</SelectItem>
          <SelectItem value="2024-2025">2024-2025</SelectItem>
          <SelectItem value="2023-2024">2023-2024</SelectItem>
        </SelectContent>
      </Select>

      <Select value={semester} onValueChange={onSemesterChange}>
        <SelectTrigger className="w-[140px] rounded-xl bg-background/60 border-border/50">
          <SelectValue placeholder="Semester" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Semesters</SelectItem>
          <SelectItem value="1">Semester 1</SelectItem>
          <SelectItem value="2">Semester 2</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="ghost" size="sm" onClick={onReset} className="text-muted-foreground">
        <RotateCcw className="h-3.5 w-3.5 mr-1.5" />Reset
      </Button>
    </motion.div>
  );
}

export const AnalyticsFiltersPanel = memo(AnalyticsFiltersPanelComponent);
