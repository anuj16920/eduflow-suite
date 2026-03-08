import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

interface StudentFiltersProps {
  classes: { id: string; name: string; section?: string | null }[];
  selectedClass: string;
  onClassChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  selectedGender: string;
  onGenderChange: (value: string) => void;
}

export function StudentFilters({
  classes, selectedClass, onClassChange,
  selectedStatus, onStatusChange,
  selectedGender, onGenderChange,
}: StudentFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-3"
    >
      <Select value={selectedClass} onValueChange={onClassChange}>
        <SelectTrigger className="w-[160px] h-9 text-sm">
          <SelectValue placeholder="All Classes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Classes</SelectItem>
          {classes.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}{c.section ? ` - ${c.section}` : ""}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedStatus} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[140px] h-9 text-sm">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
          <SelectItem value="graduated">Graduated</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedGender} onValueChange={onGenderChange}>
        <SelectTrigger className="w-[140px] h-9 text-sm">
          <SelectValue placeholder="All Genders" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Genders</SelectItem>
          <SelectItem value="male">Male</SelectItem>
          <SelectItem value="female">Female</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
    </motion.div>
  );
}
