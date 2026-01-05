import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    schoolName: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    toast({
      title: "Request submitted!",
      description: "Our team will contact you within 24 hours.",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="py-20 md:py-32">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column - Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Request a Demo
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              See how EduCore can transform your school's operations. Fill out
              the form and our team will reach out to schedule a personalized demo.
            </p>

            <div className="space-y-6 mb-12">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary flex-shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email Us</h3>
                  <p className="text-muted-foreground">sales@educore.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary flex-shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Call Us</h3>
                  <p className="text-muted-foreground">+91 1800-123-4567</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary flex-shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Visit Us</h3>
                  <p className="text-muted-foreground">
                    123 Education Street, Tech Park<br />
                    Bangalore, Karnataka 560001
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-muted/50 border border-border">
              <h3 className="font-semibold mb-2">What happens next?</h3>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    1
                  </span>
                  We'll contact you within 24 hours
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    2
                  </span>
                  Schedule a personalized demo session
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    3
                  </span>
                  Get a custom proposal for your school
                </li>
              </ol>
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 rounded-2xl bg-card border border-border shadow-card">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-success mb-6">
                  <CheckCircle className="h-10 w-10" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
                <p className="text-muted-foreground mb-6">
                  Your demo request has been submitted successfully. Our team
                  will contact you within 24 hours.
                </p>
                <Button onClick={() => setSubmitted(false)} variant="outline">
                  Submit Another Request
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-8 rounded-2xl bg-card border border-border shadow-card"
              >
                <h2 className="text-xl font-semibold mb-6">Get Started</h2>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="schoolName">School Name *</Label>
                    <Input
                      id="schoolName"
                      name="schoolName"
                      placeholder="Enter your school name"
                      value={formData.schoolName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@school.edu"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message (Optional)</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us about your school and requirements..."
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full gradient-primary border-0 text-primary-foreground hover:opacity-90 h-12"
                  >
                    Request Demo
                    <Send className="ml-2 h-4 w-4" />
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By submitting this form, you agree to our{" "}
                    <a href="#" className="underline hover:text-foreground">
                      Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a href="#" className="underline hover:text-foreground">
                      Terms of Service
                    </a>
                    .
                  </p>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
