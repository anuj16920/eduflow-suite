import { AnimatePresence, motion } from "framer-motion";
import { X, Megaphone, Clock, User, ExternalLink, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import type { AnnouncementCardData } from "./AnnouncementCard";

interface AnnouncementDetailModalProps {
  announcement: AnnouncementCardData | null;
  onClose: () => void;
}

const priorityStyles: Record<string, string> = {
  high: "bg-destructive/10 text-destructive",
  normal: "bg-primary/10 text-primary",
  low: "bg-muted text-muted-foreground",
};

export function AnnouncementDetailModal({ announcement, onClose }: AnnouncementDetailModalProps) {
  return (
    <Dialog open={!!announcement} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {announcement?.priority === "high" ? (
              <AlertTriangle className="h-5 w-5 text-destructive" />
            ) : (
              <Megaphone className="h-5 w-5 text-primary" />
            )}
            {announcement?.title}
          </DialogTitle>
        </DialogHeader>

        {announcement && (
          <div className="space-y-5 py-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={priorityStyles[announcement.priority || "normal"]}>
                {announcement.priority || "normal"} priority
              </Badge>
              {announcement.targetAudience && (
                <Badge variant="secondary" className="capitalize">{announcement.targetAudience}</Badge>
              )}
              {!announcement.isActive && (
                <Badge variant="outline" className="text-muted-foreground">Inactive</Badge>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {format(new Date(announcement.createdAt), "EEEE, MMM d yyyy 'at' h:mm a")}
              </span>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Message</h3>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {announcement.message}
              </p>
            </div>

            {announcement.attachmentUrl && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Attachments</h3>
                  <a
                    href={announcement.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/40 text-sm hover:bg-muted/60 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" /> View Attachment
                  </a>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
