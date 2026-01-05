import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { GraduationCap, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";

type Role = "admin" | "teacher" | "parent";

const roleConfig = {
  admin: {
    label: "Administrator",
    description: "Full access to school management",
    color: "bg-primary text-primary-foreground",
  },
  teacher: {
    label: "Teacher",
    description: "Manage classes, attendance & grades",
    color: "bg-accent text-accent-foreground",
  },
  parent: {
    label: "Parent",
    description: "View child's progress & pay fees",
    color: "bg-warning text-warning-foreground",
  },
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<Role>("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to appropriate dashboard based on role
    navigate(`/${selectedRole}`);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:24px_24px]" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/20">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary-foreground">EduCore</span>
          </Link>

          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-primary-foreground mb-4">
              Welcome back to EduCore
            </h1>
            <p className="text-lg text-primary-foreground/80">
              The complete school management solution trusted by over 500 educational
              institutions worldwide.
            </p>
          </div>

          <p className="text-sm text-primary-foreground/60">
            © 2024 EduCore. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <ThemeToggle />
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="lg:hidden flex items-center justify-center gap-2.5 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">EduCore</span>
            </div>

            <h2 className="text-2xl font-bold mb-2">Sign in to your account</h2>
            <p className="text-muted-foreground mb-8">
              Select your role and enter your credentials
            </p>

            {/* Role Selection */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {(Object.keys(roleConfig) as Role[]).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={cn(
                    "p-4 rounded-xl border-2 text-center transition-all",
                    selectedRole === role
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div
                    className={cn(
                      "h-10 w-10 rounded-lg mx-auto mb-2 flex items-center justify-center text-xs font-bold",
                      roleConfig[role].color
                    )}
                  >
                    {role[0].toUpperCase()}
                  </div>
                  <p className="text-sm font-medium">{roleConfig[role].label}</p>
                </button>
              ))}
            </div>

            <p className="text-xs text-muted-foreground text-center mb-6">
              {roleConfig[selectedRole].description}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@school.edu"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="#"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, password: e.target.value }))
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full gradient-primary border-0 text-primary-foreground hover:opacity-90 h-11"
              >
                Sign In
              </Button>
            </form>

            <p className="text-sm text-muted-foreground text-center mt-6">
              Don't have an account?{" "}
              <Link to="/contact" className="text-primary hover:underline">
                Contact us
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
