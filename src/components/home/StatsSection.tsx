import { memo } from "react";
import { motion, Variants } from "framer-motion";
import { AnimatedCounter } from "./AnimatedCounter";
import { School, Users, Clock, Star } from "lucide-react";

const stats = [
  {
    icon: School,
    value: 500,
    suffix: "+",
    label: "Schools",
    description: "Worldwide",
    gradient: "from-primary to-violet-500",
  },
  {
    icon: Users,
    value: 1,
    suffix: "M+",
    label: "Students",
    description: "Enrolled",
    gradient: "from-accent to-emerald-400",
  },
  {
    icon: Clock,
    value: 99.9,
    suffix: "%",
    label: "Uptime",
    description: "Guaranteed",
    gradient: "from-success to-emerald-400",
  },
  {
    icon: Star,
    value: 4.9,
    suffix: "★",
    label: "Rating",
    description: "Average",
    gradient: "from-warning to-amber-400",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
    },
  },
};

function StatsSectionComponent() {
  return (
    <section className="relative py-20 -mt-10">
      <div className="container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ 
                y: -8,
                transition: { type: "spring" as const, stiffness: 400 }
              }}
              className="group relative"
            >
              <div className="relative p-6 md:p-8 rounded-2xl md:rounded-3xl bg-card border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br ${stat.gradient} text-primary-foreground mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6 md:w-7 md:h-7" />
                </div>

                {/* Value */}
                <div className={`text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                  {stat.label === "Uptime" || stat.label === "Rating" ? (
                    <span>{stat.value}{stat.suffix}</span>
                  ) : (
                    <AnimatedCounter 
                      value={stat.value} 
                      suffix={stat.suffix}
                      duration={2.5}
                    />
                  )}
                </div>

                {/* Label */}
                <div className="text-base md:text-lg font-semibold text-foreground">
                  {stat.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.description}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export const StatsSection = memo(StatsSectionComponent);
