import { motion } from "framer-motion";
import { RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface CourseFiltersPanelProps {
  subjects: { id: string; name: string }[];
  classes: { id: string; name: string; section: string | null }[];
  selectedSubject: string;
  onSubjectChange: (v: string) => void;
  selectedClass: string;
  onClassChange: (v: string) => void;
  selectedType: string;
  onTypeChange: (v: string) => void;
  search: string;
  onSearchChange: (v: string) => void;
  onReset: () => void;
}

export function CourseFiltersPanel({
  subjects, classes,
  selectedSubject, onSubjectChange,
  selectedClass, onClassChange,
  selectedType, onTypeChange,
  search, onSearchChange,
  onReset,
}: CourseFiltersPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-3"
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search courses…"
          className="pl-9 w-[200px] rounded-xl bg-muted/40 border-0"
        />
      </div>

      <Select value={selectedSubject} onValueChange={onSubjectChange}>
        <SelectTrigger className="w-[160px] rounded-xl bg-muted/40 border-0">
          <SelectValue placeholder="All Subjects" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Subjects</SelectItem>
          {subjects.map((s) => (
            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedClass} onValueChange={onClassChange}>
        <SelectTrigger className="w-[160px] rounded-xl bg-muted/40 border-0">
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

      <Select value={selectedType} onValueChange={onTypeChange}>
        <SelectTrigger className="w-[140px] rounded-xl bg-muted/40 border-0">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="video">Video</SelectItem>
          <SelectItem value="document">Document</SelectItem>
          <SelectItem value="presentation">Presentation</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="ghost" size="sm" className="rounded-xl" onClick={onReset}>
        <RotateCcw className="h-4 w-4 mr-1" /> Reset
      </Button>
    </motion.div>
  );
}
