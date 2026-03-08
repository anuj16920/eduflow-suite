import { memo } from "react";
import { motion } from "framer-motion";
import { Bell, Clock, User, Paperclip, AlertTriangle, Megaphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export interface AnnouncementCardData {
  id: string;
  title: string;
  message: string;
  priority: string | null;
  targetAudience: string | null;
  postedBy: string | null;
  createdAt: string;
  attachmentUrl: string | null;
  isActive: boolean | null;
}

const priorityStyles: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  normal: "bg-primary/10 text-primary border-primary/20",
  low: "bg-muted text-muted-foreground border-border",
};

export const AnnouncementCard = memo(function AnnouncementCard({
  announcement,
  index,
  onClick,
}: {
  announcement: AnnouncementCardData;
  index: number;
  onClick: () => void;
}) {
  const isHigh = announcement.priority === "high";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      onClick={onClick}
      className={`group p-5 rounded-2xl backdrop-blur-sm transition-all cursor-pointer ${
        isHigh ? "bg-destructive/5 hover:bg-destructive/10 border border-destructive/10" : "bg-muted/30 hover:bg-muted/50"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
          isHigh ? "bg-destructive/10" : "bg-gradient-to-br from-primary/20 to-primary/5"
        }`}>
          {isHigh ? <AlertTriangle className="h-5 w-5 text-destructive" /> : <Megaphone className="h-5 w-5 text-primary" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <h4 className="font-semibold">{announcement.title}</h4>
            <Badge variant="outline" className={priorityStyles[announcement.priority || "normal"]}>
              {announcement.priority || "normal"}
            </Badge>
            {announcement.attachmentUrl && <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{announcement.message}</p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {format(new Date(announcement.createdAt), "MMM d, yyyy")}
            </span>
            {announcement.targetAudience && (
              <Badge variant="secondary" className="text-[10px] capitalize">{announcement.targetAudience}</Badge>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});
