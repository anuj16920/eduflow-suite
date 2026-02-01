import { memo } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  Bell, 
  CreditCard,
  Star,
  CheckCircle2,
  TrendingUp,
  MessageSquare
} from "lucide-react";
import { SparklingStars } from "./SparklingStars";

const floatingCards = [
  {
    icon: Users,
    label: "1,234 Students",
    color: "from-primary to-amber-500",
    delay: 0,
    position: "top-20 left-10",
    mobileHidden: false,
  },
  {
    icon: GraduationCap,
    label: "98% Pass Rate",
    color: "from-amber-500 to-orange-600",
    delay: 0.5,
    position: "top-40 right-10",
    mobileHidden: true,
  },
  {
    icon: Star,
    label: "4.9 Rating",
    color: "from-orange-500 to-red-500",
    delay: 1,
    position: "bottom-32 left-20",
    mobileHidden: true,
  },
  {
    icon: TrendingUp,
    label: "+27% Growth",
    color: "from-amber-400 to-primary",
    delay: 1.5,
    position: "bottom-20 right-16",
    mobileHidden: false,
  },
];

const miniIcons = [
  { icon: BookOpen, delay: 0.2, position: "top-32 left-[20%]" },
  { icon: Calendar, delay: 0.7, position: "top-16 right-[25%]" },
  { icon: Bell, delay: 1.2, position: "bottom-40 left-[15%]" },
  { icon: CreditCard, delay: 0.9, position: "bottom-24 right-[22%]" },
  { icon: MessageSquare, delay: 1.4, position: "top-48 right-[15%]" },
  { icon: CheckCircle2, delay: 0.4, position: "bottom-48 right-[30%]" },
];

function FloatingCard({ 
  icon: Icon, 
  label, 
  color, 
  delay, 
  position,
  mobileHidden 
}: {
  icon: typeof Users;
  label: string;
  color: string;
  delay: number;
  position: string;
  mobileHidden: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        y: [0, -10, 0],
        scale: 1,
      }}
      transition={{
        opacity: { delay, duration: 0.5 },
        y: { delay: delay + 0.5, duration: 3, repeat: Infinity, ease: "easeInOut" },
        scale: { delay, duration: 0.5 },
      }}
      className={`absolute ${position} z-20 ${mobileHidden ? 'hidden lg:block' : 'hidden md:block'}`}
    >
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-card/90 backdrop-blur-xl border border-primary/20 shadow-lg hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group">
        <div className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${color} text-white shadow-md group-hover:scale-110 transition-transform`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="font-semibold text-sm whitespace-nowrap">{label}</span>
      </div>
    </motion.div>
  );
}

function FloatingIcon({ 
  icon: Icon, 
  delay, 
  position 
}: {
  icon: typeof BookOpen;
  delay: number;
  position: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0.4, 0.8, 0.4],
        scale: 1,
        rotate: [0, 10, -10, 0],
      }}
      transition={{
        opacity: { delay: delay + 0.5, duration: 4, repeat: Infinity, ease: "easeInOut" },
        scale: { delay, duration: 0.5 },
        rotate: { delay: delay + 1, duration: 6, repeat: Infinity, ease: "easeInOut" },
      }}
      className={`absolute ${position} z-10 hidden lg:block`}
    >
      <div className="p-3 rounded-full bg-primary/10 backdrop-blur-sm">
        <Icon className="w-6 h-6 text-primary/70" />
      </div>
    </motion.div>
  );
}

function FloatingElementsComponent() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Sparkling Stars */}
      <SparklingStars />

      {/* Floating Cards */}
      {floatingCards.map((card, index) => (
        <FloatingCard key={index} {...card} />
      ))}

      {/* Mini Floating Icons */}
      {miniIcons.map((item, index) => (
        <FloatingIcon key={index} {...item} />
      ))}

      {/* Animated Background Orbs - Fire Orange Theme */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-20 left-1/4 w-72 h-72 rounded-full bg-primary/10 blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -30, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-primary/5 to-orange-500/5 blur-3xl"
      />

      {/* Fire ember particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`ember-${i}`}
          animate={{
            y: [0, -100, -200],
            x: [0, Math.random() * 40 - 20, Math.random() * 60 - 30],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.3],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            delay: i * 0.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
          className="absolute bottom-10 rounded-full bg-primary"
          style={{
            left: `${20 + i * 8}%`,
            width: `${4 + Math.random() * 4}px`,
            height: `${4 + Math.random() * 4}px`,
            boxShadow: "0 0 8px hsl(24 100% 50% / 0.8)",
          }}
        />
      ))}
    </div>
  );
}

export const FloatingElements = memo(FloatingElementsComponent);
