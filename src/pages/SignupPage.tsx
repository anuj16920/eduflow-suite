import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { GraduationCap, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

type Role = "admin" | "teacher" | "student" | "parent";

const roleConfig = {
  admin: { label: "Admin", color: "bg-primary text-primary-foreground" },
  teacher: { label: "Teacher", color: "bg-accent text-accent-foreground" },
  student: { label: "Student", color: "bg-success text-success-foreground" },
  parent: { label: "Parent", color: "bg-warning text-warning-foreground" },
};

export default function SignupPage() {
  const navigate = useNavigate();
  const { signUp, user, role, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<Role>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });

  useEffect(() => {
    if (user && role && !authLoading) {
      navigate(`/${role}`, { replace: true });
    }
  }, [user, role, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    const { error } = await signUp(formData.email, formData.password, formData.fullName, selectedRole);
    setIsLoading(false);
    if (error) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Account created!", description: "Welcome to EduCore." });
    }
  };

  return (
    <div className="min-h-screen flex">
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
            <h1 className="text-4xl font-bold text-primary-foreground mb-4">Join EduCore Today</h1>
            <p className="text-lg text-primary-foreground/80">Create your account and get started with the most powerful school management platform.</p>
          </div>
          <p className="text-sm text-primary-foreground/60">© 2025 EduCore. All rights reserved.</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-6">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
          <ThemeToggle />
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
            <h2 className="text-2xl font-bold mb-2">Create your account</h2>
            <p className="text-muted-foreground mb-8">Select your role and fill in your details</p>

            <div className="grid grid-cols-4 gap-2 mb-6">
              {(Object.keys(roleConfig) as Role[]).map((role) => (
                <button key={role} type="button" onClick={() => setSelectedRole(role)}
                  className={cn("p-3 rounded-xl border-2 text-center transition-all", selectedRole === role ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")}>
                  <div className={cn("h-8 w-8 rounded-lg mx-auto mb-1.5 flex items-center justify-center text-xs font-bold", roleConfig[role].color)}>
                    {role[0].toUpperCase()}
                  </div>
                  <p className="text-xs font-medium">{roleConfig[role].label}</p>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" placeholder="John Doe" value={formData.fullName} onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="you@school.edu" value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="Min. 6 characters" value={formData.password} onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground hover:opacity-90 h-11" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <p className="text-sm text-muted-foreground text-center mt-6">
              Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
