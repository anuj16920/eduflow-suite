import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, User, Calendar, Clock, Paperclip, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import type { HomeworkCardData } from "./HomeworkAssignmentCard";
import { getEffectiveStatus } from "./HomeworkAssignmentCard";

interface AssignmentDetailDrawerProps {
  homework: HomeworkCardData | null;
  onClose: () => void;
}

const statusStyles: Record<string, string> = {
  active: "bg-primary/10 text-primary",
  completed: "bg-emerald-500/10 text-emerald-500",
  overdue: "bg-destructive/10 text-destructive",
};

export function AssignmentDetailDrawer({ homework, onClose }: AssignmentDetailDrawerProps) {
  return (
    <AnimatePresence>
      {homework && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-background border-l border-border shadow-2xl overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">{homework.title}</h2>
                    <p className="text-sm text-muted-foreground">{homework.subjectName}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="rounded-xl" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Status */}
              <Badge className={statusStyles[getEffectiveStatus(homework)]}>
                {getEffectiveStatus(homework)}
              </Badge>

              <Separator />

              {/* Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Teacher</p>
                    <p className="font-medium">{homework.teacherName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Due Date</p>
                    <p className="font-medium">{format(new Date(homework.dueDate), "EEEE, MMM d yyyy")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Assigned</p>
                    <p className="font-medium">{format(new Date(homework.createdAt), "MMM d yyyy")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Class</p>
                    <p className="font-medium">{homework.className}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {homework.description || "No description provided."}
                </p>
              </div>

              {/* Attachment */}
              {homework.attachmentUrl && (
                <div>
                  <h3 className="font-semibold mb-2">Attachments</h3>
                  <a
                    href={homework.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/40 text-sm hover:bg-muted/60 transition-colors"
                  >
                    <Paperclip className="h-4 w-4" />
                    View Attachment
                  </a>
                </div>
              )}

              <Separator />

              {/* Submissions */}
              <div>
                <h3 className="font-semibold mb-3">Submissions</h3>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30">
                  {homework.submissionCount > 0 ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      <div>
                        <p className="font-medium">{homework.submissionCount} submission(s)</p>
                        <p className="text-xs text-muted-foreground">Students have submitted their work</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                      <div>
                        <p className="font-medium">No submissions yet</p>
                        <p className="text-xs text-muted-foreground">Waiting for student submissions</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
