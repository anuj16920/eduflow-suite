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

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-20 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Trusted by 500+ schools worldwide
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-balance">
              The Complete
              <span className="block gradient-primary bg-clip-text text-transparent">
                School Management
              </span>
              Solution
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance">
              Streamline administration, enhance communication, and empower education
              with our all-in-one platform designed for modern schools.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact">
                <Button size="lg" className="gradient-primary border-0 text-primary-foreground h-12 px-8 text-base hover:opacity-90">
                  Request Free Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                <Play className="mr-2 h-4 w-4" />
                Watch Video
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold gradient-primary bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
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
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Manage Your School
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From admissions to alumni, our comprehensive platform covers every aspect
              of school management.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Schools Choose EduCore
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of educational institutions that have transformed
                their operations with our platform.
              </p>

              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success/10 text-success">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <span className="text-foreground">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-elevated bg-gradient-to-br from-primary/20 to-accent/20 p-8 md:p-12">
                <div className="absolute inset-0 bg-card/90 backdrop-blur-sm" />
                <div className="relative z-10 text-center">
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl gradient-primary mb-6">
                    <GraduationCap className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
                  <p className="text-muted-foreground mb-6">
                    Schedule a personalized demo and see how EduCore can transform your school.
                  </p>
                  <Link to="/contact">
                    <Button className="gradient-primary border-0 text-primary-foreground hover:opacity-90">
                      Request Demo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:24px_24px]" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Transform Your School Today
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8">
              Join the growing community of schools that are modernizing their operations
              with EduCore. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact">
                <Button
                  size="lg"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 h-12 px-8"
                >
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/pricing">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 h-12 px-8"
                >
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
