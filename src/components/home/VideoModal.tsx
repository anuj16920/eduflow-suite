import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function VideoModalComponent({ isOpen, onClose }: VideoModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-10 lg:inset-20 z-50 flex items-center justify-center"
          >
            <div className="relative w-full max-w-5xl bg-card rounded-2xl overflow-hidden shadow-elevated">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm hover:bg-background"
              >
                <X className="h-5 w-5" />
              </Button>

              {/* Video Container */}
              <div className="aspect-video bg-muted flex items-center justify-center relative overflow-hidden">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
                
                {/* Animated circles */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute w-96 h-96 rounded-full bg-primary/10 blur-3xl"
                />
                
                {/* Demo Content */}
                <div className="relative z-10 text-center p-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="inline-flex items-center justify-center w-24 h-24 rounded-full gradient-primary mb-6 shadow-xl"
                  >
                    <Play className="w-10 h-10 text-primary-foreground ml-1" />
                  </motion.div>
                  
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl md:text-3xl font-bold mb-3"
                  >
                    Product Demo Coming Soon
                  </motion.h3>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-muted-foreground max-w-md mx-auto"
                  >
                    Our comprehensive video walkthrough will showcase all features of EduCore.
                    Request a personalized demo to see it in action!
                  </motion.p>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6"
                  >
                    <Button className="gradient-primary border-0 text-primary-foreground">
                      Request Personal Demo
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export const VideoModal = memo(VideoModalComponent);
