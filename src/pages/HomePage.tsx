import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Users,
  BookOpen,
  CreditCard,
  MessageSquare,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Play,
  Shield,
  Zap,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Admin Management",
    description: "Complete control over school operations with powerful admin tools.",
  },
  {
    icon: BookOpen,
    title: "Academic Excellence",
    description: "Manage curriculum, assignments, and track student progress.",
  },
  {
    icon: CreditCard,
    title: "Fee Management",
    description: "Automated billing, payment tracking, and financial reports.",
  },
  {
    icon: MessageSquare,
    title: "Communication Hub",
    description: "Connect teachers, parents, and students seamlessly.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description: "Data-driven insights for better decision making.",
  },
  {
    icon: GraduationCap,
    title: "Student Portal",
    description: "Self-service portal for students to access resources.",
  },
];

const benefits = [
  "Reduce administrative workload by 60%",
  "Real-time parent-teacher communication",
  "Automated attendance tracking",
  "Secure online fee payments",
  "Comprehensive progress reports",
  "24/7 cloud-based access",
];

const stats = [
  { value: "500+", label: "Schools" },
  { value: "1M+", label: "Students" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9★", label: "Rating" },
];

const highlights = [
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Bank-grade security with 99.9% uptime guarantee",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized performance for seamless user experience",
  },
  {
    icon: TrendingUp,
    title: "Scalable Solution",
    description: "Grows with your institution from 50 to 50,000 students",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 gradient-hero opacity-10" />
        
        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">
                Trusted by 500+ schools worldwide
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              The Complete{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
                  School Management
                </span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/20 -rotate-1" />
              </span>{" "}
              Solution
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Streamline administration, enhance communication, and empower
              education with our all-in-one platform designed for modern schools.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/contact">
                <Button
                  size="lg"
                  className="gradient-primary border-0 text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/25 px-8 py-6 text-lg h-auto"
                >
                  Request Free Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-2 px-8 py-6 text-lg h-auto hover:bg-primary/5"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Video
              </Button>
            </motion.div>
          </div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center p-6 rounded-2xl bg-card border border-border/50 shadow-card hover:shadow-lg transition-all duration-300"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From admissions to alumni, our comprehensive platform covers every
              aspect of school management.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/50 shadow-card hover:shadow-xl transition-all duration-300"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl gradient-primary text-primary-foreground mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Why Schools Choose EduCore
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Join thousands of educational institutions that have transformed
                their operations with our platform.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors duration-300"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <span className="text-base font-medium">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid gap-6"
            >
              {highlights.map((highlight, index) => (
                <div
                  key={highlight.title}
                  className="p-8 rounded-2xl gradient-card border border-border shadow-card hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <highlight.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">
                        {highlight.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {highlight.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10" />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center p-12 md:p-16 rounded-3xl bg-card border border-border shadow-elevated"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Transform Your School?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Schedule a personalized demo and see how EduCore can streamline your
              school management.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact">
                <Button
                  size="lg"
                  className="gradient-primary border-0 text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/25 px-8 py-6 text-lg h-auto"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 px-8 py-6 text-lg h-auto hover:bg-primary/5"
                >
                  View Pricing
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
