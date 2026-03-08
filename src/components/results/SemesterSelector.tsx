import { motion } from "framer-motion";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface SemesterSelectorProps {
  exams: { id: string; name: string }[];
  selected: string;
  onChange: (v: string) => void;
}

export function SemesterSelector({ exams, selected, onChange }: SemesterSelectorProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Select value={selected} onValueChange={onChange}>
        <SelectTrigger className="w-[220px] rounded-xl bg-muted/40 border-0">
          <SelectValue placeholder="Select Exam" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Exams</SelectItem>
          {exams.map((e) => (
            <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </motion.div>
  );
}
