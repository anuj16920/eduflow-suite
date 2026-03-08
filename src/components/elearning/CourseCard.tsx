import { memo } from "react";
import { motion } from "framer-motion";
import { BookOpen, Video, FileText, Monitor, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export interface CourseCardData {
  id: string;
  title: string;
  description: string | null;
  subjectName: string;
  className: string;
  teacherName: string;
  materialType: string | null;
  fileUrl: string | null;
  createdAt: string;
}

const typeIcons: Record<string, typeof Video> = {
  video: Video,
  document: FileText,
  presentation: Monitor,
};

const typeColors: Record<string, string> = {
  video: "bg-emerald-500/10 text-emerald-500",
  document: "bg-primary/10 text-primary",
  presentation: "bg-amber-500/10 text-amber-500",
};

export const CourseCard = memo(function CourseCard({
  material,
  index,
  onClick,
}: {
  material: CourseCardData;
  index: number;
  onClick: () => void;
}) {
  const Icon = typeIcons[material.materialType || "document"] || FileText;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04, duration: 0.3 }}
          whileHover={{ y: -4, transition: { duration: 0.15 } }}
          onClick={onClick}
          className="group rounded-2xl bg-muted/30 hover:bg-muted/50 backdrop-blur-sm transition-colors cursor-pointer overflow-hidden"
        >
          {/* Thumbnail area */}
          <div className="h-36 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center relative">
            <Icon className="h-12 w-12 text-primary/30" />
            <Badge
              className={`absolute top-3 right-3 text-[10px] capitalize ${typeColors[material.materialType || "document"]}`}
            >
              {material.materialType || "document"}
            </Badge>
          </div>

          <div className="p-4 space-y-2">
            <h4 className="font-semibold line-clamp-2 leading-tight">{material.title}</h4>
            <p className="text-xs text-muted-foreground">{material.subjectName}</p>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span className="truncate max-w-[120px]">{material.teacherName}</span>
              </div>
              <Badge variant="secondary" className="text-[10px]">{material.className}</Badge>
            </div>
          </div>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p className="text-sm">{material.description || "No description"}</p>
      </TooltipContent>
    </Tooltip>
  );
});
