import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Basic",
    description: "Perfect for small schools getting started",
    price: "₹4,999",
    period: "/month",
    features: [
      "Up to 500 students",
      "5 admin users",
      "Student & teacher portals",
      "Basic attendance tracking",
      "Fee management",
      "Email support",
    ],
    popular: false,
  },
  {
    name: "Standard",
    description: "Ideal for growing educational institutions",
    price: "₹9,999",
    period: "/month",
    features: [
      "Up to 2,000 students",
      "Unlimited admin users",
      "All Basic features",
      "Parent portal",
      "Advanced analytics",
      "SMS notifications",
      "Priority support",
      "Custom reports",
    ],
    popular: true,
  },
  {
    name: "Premium",
    description: "For large schools with advanced needs",
    price: "₹19,999",
    period: "/month",
    features: [
      "Unlimited students",
      "All Standard features",
      "Multi-branch support",
      "API access",
      "White-label branding",
      "Dedicated account manager",
      "24/7 phone support",
      "On-site training",
    ],
    popular: false,
  },
];

const comparisonFeatures = [
  { feature: "Students", basic: "500", standard: "2,000", premium: "Unlimited" },
  { feature: "Admin users", basic: "5", standard: "Unlimited", premium: "Unlimited" },
  { feature: "Teacher portal", basic: true, standard: true, premium: true },
  { feature: "Parent portal", basic: false, standard: true, premium: true },
  { feature: "Attendance tracking", basic: "Basic", standard: "Advanced", premium: "Advanced" },
  { feature: "Fee management", basic: true, standard: true, premium: true },
  { feature: "Online payments", basic: false, standard: true, premium: true },
  { feature: "SMS notifications", basic: false, standard: true, premium: true },
  { feature: "Custom reports", basic: false, standard: true, premium: true },
  { feature: "Multi-branch support", basic: false, standard: false, premium: true },
  { feature: "API access", basic: false, standard: false, premium: true },
  { feature: "White-label branding", basic: false, standard: false, premium: true },
  { feature: "Support", basic: "Email", standard: "Priority", premium: "24/7 Phone" },
];

export default function PricingPage() {
  return (
    <div className="py-20 md:py-32">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your school's needs. All plans include
            a 14-day free trial with no credit card required.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative rounded-2xl border p-8",
                plan.popular
                  ? "border-primary bg-card shadow-lg scale-105"
                  : "border-border bg-card"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 rounded-full text-sm font-medium gradient-primary text-primary-foreground">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-success/10 text-success">
                      <Check className="h-3 w-3" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/contact" className="block">
                <Button
                  className={cn(
                    "w-full",
                    plan.popular
                      ? "gradient-primary border-0 text-primary-foreground hover:opacity-90"
                      : ""
                  )}
                  variant={plan.popular ? "default" : "outline"}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-center mb-8">
            Compare Plans
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-4 px-4 text-left font-medium">Feature</th>
                  <th className="py-4 px-4 text-center font-medium">Basic</th>
                  <th className="py-4 px-4 text-center font-medium bg-primary/5">
                    Standard
                  </th>
                  <th className="py-4 px-4 text-center font-medium">Premium</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((row, index) => (
                  <tr key={row.feature} className={cn(
                    "border-b border-border",
                    index % 2 === 0 ? "bg-muted/30" : ""
                  )}>
                    <td className="py-3 px-4 text-sm font-medium">{row.feature}</td>
                    <td className="py-3 px-4 text-center text-sm">
                      {typeof row.basic === "boolean" ? (
                        row.basic ? (
                          <Check className="h-4 w-4 text-success mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )
                      ) : (
                        row.basic
                      )}
                    </td>
                    <td className="py-3 px-4 text-center text-sm bg-primary/5">
                      {typeof row.standard === "boolean" ? (
                        row.standard ? (
                          <Check className="h-4 w-4 text-success mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )
                      ) : (
                        row.standard
                      )}
                    </td>
                    <td className="py-3 px-4 text-center text-sm">
                      {typeof row.premium === "boolean" ? (
                        row.premium ? (
                          <Check className="h-4 w-4 text-success mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )
                      ) : (
                        row.premium
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h2 className="text-2xl font-bold mb-4">
            Not sure which plan is right for you?
          </h2>
          <p className="text-muted-foreground mb-6">
            Get a personalized demo and consultation with our team.
          </p>
          <Link to="/contact">
            <Button size="lg" className="gradient-primary border-0 text-primary-foreground hover:opacity-90">
              Request Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
