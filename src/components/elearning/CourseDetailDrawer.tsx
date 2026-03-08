import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, User, Calendar, FileText, Video, Monitor, ExternalLink, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import type { CourseCardData } from "./CourseCard";

interface CourseDetailDrawerProps {
  material: CourseCardData | null;
  relatedMaterials: CourseCardData[];
  onClose: () => void;
  onSelectLesson: (m: CourseCardData) => void;
}

const typeIcons: Record<string, typeof Video> = {
  video: Video,
  document: FileText,
  presentation: Monitor,
};

export function CourseDetailDrawer({
  material, relatedMaterials, onClose, onSelectLesson,
}: CourseDetailDrawerProps) {
  return (
    <AnimatePresence>
      {material && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-lg bg-background border-l border-border shadow-2xl overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">{material.title}</h2>
                    <p className="text-sm text-muted-foreground">{material.subjectName}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="rounded-xl" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <Badge className="capitalize bg-primary/10 text-primary">{material.materialType}</Badge>

              {/* Video / content area */}
              {material.materialType === "video" && (
                <div className="rounded-xl bg-muted/40 aspect-video flex items-center justify-center relative overflow-hidden">
                  {material.fileUrl ? (
                    <video
                      src={material.fileUrl}
                      controls
                      className="w-full h-full rounded-xl"
                      poster=""
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Play className="h-10 w-10" />
                      <p className="text-sm">Video not available</p>
                    </div>
                  )}
                </div>
              )}

              <Separator />

              {/* Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Instructor</p>
                    <p className="font-medium">{material.teacherName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Uploaded</p>
                    <p className="font-medium">{format(new Date(material.createdAt), "MMM d, yyyy")}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {material.description || "No description provided."}
                </p>
              </div>

              {/* File link */}
              {material.fileUrl && material.materialType !== "video" && (
                <a
                  href={material.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/40 text-sm hover:bg-muted/60 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" /> Open Material
                </a>
              )}

              <Separator />

              {/* Related lessons */}
              {relatedMaterials.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Related Lessons ({relatedMaterials.length})</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {relatedMaterials.map((rm) => {
                      const LIcon = typeIcons[rm.materialType || "document"] || FileText;
                      const isActive = rm.id === material.id;
                      return (
                        <button
                          key={rm.id}
                          onClick={() => onSelectLesson(rm)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl text-left text-sm transition-colors ${
                            isActive ? "bg-primary/10" : "hover:bg-muted/40"
                          }`}
                        >
                          <LIcon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                          <span className={`truncate ${isActive ? "font-semibold text-primary" : ""}`}>{rm.title}</span>
                          <Badge variant="secondary" className="text-[10px] capitalize ml-auto shrink-0">{rm.materialType}</Badge>
                        </button>
                      );
                    })}
                  </div>

                  {/* Progress indicator */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Course Progress</span>
                      <span>1 / {relatedMaterials.length + 1}</span>
                    </div>
                    <Progress value={(1 / (relatedMaterials.length + 1)) * 100} className="h-2" />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
