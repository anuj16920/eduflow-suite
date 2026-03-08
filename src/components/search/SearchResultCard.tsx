import { memo } from "react";
import { Users, GraduationCap, BookOpen, Megaphone, FileText, ClipboardList, Layers, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { SearchResult } from "./types";

const typeConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  student: { icon: Users, color: "text-primary", bg: "bg-primary/10", label: "Student" },
  teacher: { icon: GraduationCap, color: "text-emerald-500", bg: "bg-emerald-500/10", label: "Teacher" },
  class: { icon: Layers, color: "text-blue-500", bg: "bg-blue-500/10", label: "Class" },
  subject: { icon: BookOpen, color: "text-violet-500", bg: "bg-violet-500/10", label: "Subject" },
  announcement: { icon: Megaphone, color: "text-amber-500", bg: "bg-amber-500/10", label: "Announcement" },
  exam: { icon: ClipboardList, color: "text-rose-500", bg: "bg-rose-500/10", label: "Exam" },
  homework: { icon: FileText, color: "text-cyan-500", bg: "bg-cyan-500/10", label: "Homework" },
};

interface Props {
  result: SearchResult;
  onSelect: (result: SearchResult) => void;
}

export const SearchResultCard = memo(function SearchResultCard({ result, onSelect }: Props) {
  const config = typeConfig[result.type] || typeConfig.student;
  const Icon = config.icon;

  return (
    <button
      onClick={() => onSelect(result)}
      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-all duration-150 group text-left"
    >
      {result.avatar ? (
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarImage src={result.avatar} />
          <AvatarFallback className={`${config.bg} ${config.color} text-xs`}>
            {result.title.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </AvatarFallback>
        </Avatar>
      ) : (
        <div className={`h-9 w-9 shrink-0 rounded-xl ${config.bg} flex items-center justify-center`}>
          <Icon className={`h-4 w-4 ${config.color}`} />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
          {result.title}
        </p>
        <p className="text-xs text-muted-foreground truncate">{result.description}</p>
      </div>

      <span className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-medium ${config.bg} ${config.color}`}>
        {config.label}
      </span>

      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/0 group-hover:text-muted-foreground transition-all group-hover:translate-x-0.5" />
    </button>
  );
});
