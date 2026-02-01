import { memo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingElements } from "./FloatingElements";
import { VideoModal } from "./VideoModal";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
    },
  },
};

function HeroSectionComponent() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const handleOpenVideo = useCallback(() => setIsVideoOpen(true), []);
  const handleCloseVideo = useCallback(() => setIsVideoOpen(false), []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating Elements */}
      <FloatingElements />

      {/* Content */}
      <div className="container relative z-30 py-20 md:py-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">
                Trusted by 500+ schools worldwide
              </span>
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-[1.1] tracking-tight"
          >
            <span className="block">The Complete</span>
            <span className="relative inline-block mt-2">
              <span className="relative z-10 bg-gradient-to-r from-primary via-amber-500 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                School Management
              </span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute -bottom-1 left-0 w-full h-3 md:h-4 bg-primary/20 -rotate-1 origin-left"
              />
            </span>
            <span className="block mt-2">Solution</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Streamline administration, enhance communication, and empower
            education with our all-in-one platform designed for modern schools.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/contact">
              <Button
                size="lg"
                className="group gradient-primary border-0 text-primary-foreground hover:opacity-90 shadow-xl shadow-primary/30 px-8 py-7 text-lg h-auto rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1"
              >
                Request Free Demo
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              onClick={handleOpenVideo}
              className="group border-2 border-primary/30 px-8 py-7 text-lg h-auto rounded-2xl hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative mr-2">
                <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping" />
                <Play className="relative h-5 w-5 text-primary" />
              </div>
              Watch Video
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={itemVariants}
            className="mt-16 pt-8 border-t border-primary/10"
          >
            <p className="text-sm text-muted-foreground mb-6">
              Powering education excellence at leading institutions
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60">
              {["Stanford", "MIT", "Harvard", "Oxford", "Cambridge"].map((name, i) => (
                <motion.span
                  key={name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 + i * 0.1 }}
                  className="text-lg md:text-xl font-bold tracking-tight text-muted-foreground/80"
                >
                  {name}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Video Modal */}
      <VideoModal isOpen={isVideoOpen} onClose={handleCloseVideo} />

      {/* Gradient animation keyframes */}
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
}

export const HeroSection = memo(HeroSectionComponent);
