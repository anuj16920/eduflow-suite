import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, XCircle, Scan, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ScanStatus } from "./FaceScanCamera";

interface ScanStatusPanelProps {
  status: ScanStatus;
  message?: string;
}

const statusConfig: Record<ScanStatus, { icon: any; label: string; color: string }> = {
  idle: { icon: Video, label: "Camera active — waiting for capture", color: "text-muted-foreground" },
  scanning: { icon: Scan, label: "Face detected — scanning...", color: "text-primary" },
  processing: { icon: Loader2, label: "Processing attendance...", color: "text-primary" },
  success: { icon: CheckCircle2, label: "Attendance Recorded!", color: "text-emerald-500" },
  failure: { icon: XCircle, label: "Face not recognized", color: "text-destructive" },
};

export const ScanStatusPanel = memo(function ScanStatusPanel({ status, message }: ScanStatusPanelProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
        className="flex items-center gap-3 rounded-xl bg-card/80 backdrop-blur-sm border border-border/50 px-5 py-3"
      >
        <Icon className={cn("h-5 w-5 shrink-0", config.color, status === "processing" && "animate-spin")} />
        <div>
          <p className={cn("text-sm font-medium", config.color)}>{config.label}</p>
          {message && <p className="text-xs text-muted-foreground mt-0.5">{message}</p>}
        </div>
      </motion.div>
    </AnimatePresence>
  );
});
