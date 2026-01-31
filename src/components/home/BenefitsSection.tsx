import { memo } from "react";
import { motion, Variants } from "framer-motion";
import {
  CheckCircle,
  Shield,
  Zap,
  TrendingUp,
  Clock,
  Users,
  CreditCard,
  BarChart,
  Bell,
  Cloud,
} from "lucide-react";

const benefits = [
  { icon: Clock, text: "Reduce administrative workload by 60%" },
  { icon: Users, text: "Real-time parent-teacher communication" },
  { icon: CheckCircle, text: "Automated attendance tracking" },
  { icon: CreditCard, text: "Secure online fee payments" },
  { icon: BarChart, text: "Comprehensive progress reports" },
  { icon: Cloud, text: "24/7 cloud-based access" },
];

const highlights = [
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Bank-grade security with 99.9% uptime guarantee. Your data is protected with enterprise-level encryption.",
    gradient: "from-primary to-violet-500",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized performance for seamless user experience. Load times under 100ms guaranteed.",
    gradient: "from-warning to-amber-400",
  },
  {
    icon: TrendingUp,
    title: "Scalable Solution",
    description: "Grows with your institution from 50 to 50,000 students without missing a beat.",
    gradient: "from-success to-emerald-400",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 100 },
  },
};

function BenefitsSectionComponent() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-1/2 left-0 w-1/2 h-96 bg-gradient-to-r from-primary/5 to-transparent blur-3xl -translate-y-1/2" />

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 mb-6">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-success">Why Choose Us</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Why Schools Choose
              <span className="block bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                EduCore
              </span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Join thousands of educational institutions that have transformed
              their operations with our platform.
            </p>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-4"
            >
              {benefits.map((benefit) => (
                <motion.div
                  key={benefit.text}
                  variants={itemVariants}
                  whileHover={{ x: 8 }}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-all duration-300 cursor-default"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                    <benefit.icon className="h-5 w-5" />
                  </div>
                  <span className="text-base md:text-lg font-medium">{benefit.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Highlight Cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {highlights.map((highlight, index) => (
              <motion.div
                key={highlight.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { type: "spring" as const, stiffness: 400 }
                }}
                className="group relative"
              >
                <div className="relative p-6 md:p-8 rounded-2xl md:rounded-3xl bg-card border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${highlight.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  {/* Glow */}
                  <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${highlight.gradient} opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-500`} />

                  <div className="flex items-start gap-5 relative">
                    <div className={`flex h-14 w-14 md:h-16 md:w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${highlight.gradient} text-primary-foreground shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <highlight.icon className="h-7 w-7 md:h-8 md:w-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {highlight.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {highlight.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export const BenefitsSection = memo(BenefitsSectionComponent);
