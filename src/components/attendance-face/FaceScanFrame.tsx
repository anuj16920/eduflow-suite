import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FaceScanFrameProps {
  status: "idle" | "scanning" | "processing" | "success" | "failure";
}

export const FaceScanFrame = memo(function FaceScanFrame({ status }: FaceScanFrameProps) {
  const borderColor = {
    idle: "border-white/30",
    scanning: "border-primary",
    processing: "border-primary",
    success: "border-emerald-500",
    failure: "border-destructive",
  }[status];

  const glowColor = {
    idle: "shadow-white/10",
    scanning: "shadow-primary/40",
    processing: "shadow-primary/30",
    success: "shadow-emerald-500/40",
    failure: "shadow-destructive/40",
  }[status];

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Face frame */}
      <motion.div
        animate={status === "scanning" ? { scale: [1, 1.02, 1] } : status === "failure" ? { x: [0, -6, 6, -4, 4, 0] } : {}}
        transition={status === "scanning" ? { duration: 2, repeat: Infinity } : { duration: 0.4 }}
        className={cn(
          "relative w-56 h-56 sm:w-64 sm:h-64 rounded-3xl border-2 transition-colors duration-500",
          borderColor,
          `shadow-lg ${glowColor}`
        )}
      >
        {/* Corner accents */}
        {["top-0 left-0 border-t-2 border-l-2 rounded-tl-3xl",
          "top-0 right-0 border-t-2 border-r-2 rounded-tr-3xl",
          "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-3xl",
          "bottom-0 right-0 border-b-2 border-r-2 rounded-br-3xl",
        ].map((pos, i) => (
          <div
            key={i}
            className={cn("absolute w-8 h-8 transition-colors duration-500", pos, borderColor)}
          />
        ))}

        {/* Scanning line */}
        {status === "scanning" && (
          <motion.div
            animate={{ top: ["10%", "90%", "10%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
          />
        )}

        {/* Success checkmark */}
        {status === "success" && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <motion.svg
                viewBox="0 0 24 24"
                className="h-8 w-8 text-emerald-500"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <motion.path
                  d="M5 13l4 4L19 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </motion.svg>
            </div>
          </motion.div>
        )}

        {/* Failure X */}
        {status === "failure" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="h-16 w-16 rounded-full bg-destructive/20 flex items-center justify-center">
              <span className="text-destructive text-3xl font-bold">✕</span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Guideline text */}
      <motion.p
        animate={{ opacity: status === "idle" || status === "scanning" ? 1 : 0 }}
        className="absolute bottom-8 text-sm text-white/70 font-medium text-center"
      >
        {status === "idle" && "Align your face inside the frame"}
        {status === "scanning" && "Hold still — scanning..."}
      </motion.p>
    </div>
  );
});
