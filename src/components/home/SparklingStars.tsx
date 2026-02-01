import { memo, useMemo } from "react";
import { motion } from "framer-motion";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  color: "orange" | "gold" | "white";
}

function SparklingStarsComponent() {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 2,
      delay: Math.random() * 3,
      duration: Math.random() * 2 + 2,
      color: ["orange", "gold", "white"][Math.floor(Math.random() * 3)] as Star["color"],
    }));
  }, []);

  const colorMap = {
    orange: "bg-primary",
    gold: "bg-amber-400",
    white: "bg-white",
  };

  const glowMap = {
    orange: "shadow-[0_0_8px_hsl(24,100%,50%)]",
    gold: "shadow-[0_0_8px_hsl(45,100%,50%)]",
    white: "shadow-[0_0_6px_rgba(255,255,255,0.8)]",
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute rounded-full ${colorMap[star.color]} ${glowMap[star.color]}`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
        />
      ))}

      {/* Shooting stars */}
      <motion.div
        animate={{
          x: ["0%", "100%"],
          y: ["0%", "30%"],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 2,
          delay: 5,
          repeat: Infinity,
          repeatDelay: 8,
          ease: "easeOut",
        }}
        className="absolute top-[10%] left-0 w-20 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
        style={{
          filter: "blur(1px)",
          boxShadow: "0 0 10px hsl(24 100% 50% / 0.8)",
        }}
      />
      
      <motion.div
        animate={{
          x: ["0%", "80%"],
          y: ["0%", "20%"],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 1.5,
          delay: 12,
          repeat: Infinity,
          repeatDelay: 10,
          ease: "easeOut",
        }}
        className="absolute top-[25%] left-[10%] w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent"
        style={{
          filter: "blur(1px)",
          boxShadow: "0 0 8px hsl(45 100% 50% / 0.8)",
        }}
      />
    </div>
  );
}

export const SparklingStars = memo(SparklingStarsComponent);
