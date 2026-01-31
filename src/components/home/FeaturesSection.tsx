import { memo } from "react";
import { motion, Variants } from "framer-motion";
import {
  Users,
  BookOpen,
  CreditCard,
  MessageSquare,
  BarChart3,
  GraduationCap,
  ArrowRight,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Admin Management",
    description: "Complete control over school operations with powerful admin tools and real-time dashboards.",
    gradient: "from-primary to-violet-500",
  },
  {
    icon: BookOpen,
    title: "Academic Excellence",
    description: "Manage curriculum, assignments, and track student progress with intelligent analytics.",
    gradient: "from-accent to-emerald-400",
  },
  {
    icon: CreditCard,
    title: "Fee Management",
    description: "Automated billing, payment tracking, and comprehensive financial reports at your fingertips.",
    gradient: "from-success to-emerald-400",
  },
  {
    icon: MessageSquare,
    title: "Communication Hub",
    description: "Connect teachers, parents, and students seamlessly with instant messaging and notifications.",
    gradient: "from-warning to-amber-400",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description: "Data-driven insights for better decision making with beautiful visualizations.",
    gradient: "from-destructive to-rose-400",
  },
  {
    icon: GraduationCap,
    title: "Student Portal",
    description: "Self-service portal for students to access resources, grades, and schedules.",
    gradient: "from-primary to-indigo-400",
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
  hidden: { opacity: 0, y: 40 },
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

function FeaturesSectionComponent() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-muted/50 to-muted/30" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="container relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Powerful Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Everything You Need in
            <span className="block bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
              One Platform
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            From admissions to alumni, our comprehensive platform covers every
            aspect of school management with ease.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ 
                y: -8,
                transition: { type: "spring" as const, stiffness: 400 }
              }}
              className="group relative"
            >
              <div className="relative h-full p-8 md:p-10 rounded-2xl md:rounded-3xl bg-card border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                {/* Hover gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Glow effect */}
                <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-500`} />

                {/* Icon */}
                <div className={`relative inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-gradient-to-br ${feature.gradient} text-primary-foreground mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <feature.icon className="w-8 h-8 md:w-10 md:h-10" />
                </div>

                {/* Content */}
                <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                  {feature.description}
                </p>

                {/* Arrow indicator */}
                <div className="absolute bottom-8 right-8 w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export const FeaturesSection = memo(FeaturesSectionComponent);
