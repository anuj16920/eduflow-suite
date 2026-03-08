import { motion } from "framer-motion";
import { RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface AnnouncementFiltersPanelProps {
  selectedPriority: string;
  onPriorityChange: (v: string) => void;
  selectedAudience: string;
  onAudienceChange: (v: string) => void;
  search: string;
  onSearchChange: (v: string) => void;
  onReset: () => void;
}

export function AnnouncementFiltersPanel({
  selectedPriority, onPriorityChange,
  selectedAudience, onAudienceChange,
  search, onSearchChange,
  onReset,
}: AnnouncementFiltersPanelProps) {
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
          placeholder="Search announcements…"
          className="pl-9 w-[220px] rounded-xl bg-muted/40 border-0"
        />
      </div>

      <Select value={selectedPriority} onValueChange={onPriorityChange}>
        <SelectTrigger className="w-[140px] rounded-xl bg-muted/40 border-0">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priority</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="normal">Normal</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedAudience} onValueChange={onAudienceChange}>
        <SelectTrigger className="w-[150px] rounded-xl bg-muted/40 border-0">
          <SelectValue placeholder="Audience" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Audiences</SelectItem>
          <SelectItem value="students">Students</SelectItem>
          <SelectItem value="teachers">Teachers</SelectItem>
          <SelectItem value="parents">Parents</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="ghost" size="sm" className="rounded-xl" onClick={onReset}>
        <RotateCcw className="h-4 w-4 mr-1" /> Reset
      </Button>
    </motion.div>
  );
}
