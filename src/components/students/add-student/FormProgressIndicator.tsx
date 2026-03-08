import { memo } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormProgressIndicatorProps {
  steps: { label: string; icon: React.ReactNode }[];
  currentStep: number;
}

export const FormProgressIndicator = memo(function FormProgressIndicator({
  steps, currentStep,
}: FormProgressIndicatorProps) {
  return (
    <div className="flex items-center justify-between w-full">
      {steps.map((step, i) => {
        const isComplete = i < currentStep;
        const isActive = i === currentStep;
        return (
          <div key={step.label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  backgroundColor: isComplete
                    ? "hsl(var(--primary))"
                    : isActive
                    ? "hsl(var(--primary))"
                    : "hsl(var(--muted))",
                }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors",
                  isComplete || isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground"
                )}
              >
                {isComplete ? <Check className="h-5 w-5" /> : step.icon}
              </motion.div>
              <span className={cn(
                "text-xs font-medium text-center whitespace-nowrap",
                isActive ? "text-primary" : isComplete ? "text-foreground" : "text-muted-foreground"
              )}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 mx-3 mb-5">
                <div className="h-0.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={false}
                    animate={{ width: isComplete ? "100%" : "0%" }}
                    transition={{ duration: 0.4 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
});
