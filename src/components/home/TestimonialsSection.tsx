import { memo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    role: "Principal",
    school: "Lincoln High School",
    avatar: "SJ",
    content: "EduCore has revolutionized how we manage our school. Administrative tasks that used to take hours now take minutes. The parent communication features have improved engagement by 300%.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "IT Director",
    school: "Westfield Academy",
    avatar: "MC",
    content: "The implementation was seamless and the support team was incredible. We migrated 5,000 student records without any issues. The system's performance and reliability is outstanding.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Administrator",
    school: "St. Mary's School",
    avatar: "ER",
    content: "Fee collection has never been easier. Parents love the online payment system, and we've seen a 40% reduction in late payments. The financial reporting tools are exceptional.",
    rating: 5,
  },
  {
    id: 4,
    name: "James Williams",
    role: "Superintendent",
    school: "Metro School District",
    avatar: "JW",
    content: "Managing multiple schools has become effortless with EduCore. The centralized dashboard gives us real-time insights across all 12 schools in our district.",
    rating: 5,
  },
];

function TestimonialsSectionComponent() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-muted/30 via-muted/50 to-muted/30">
      {/* Decorative elements - Fire Orange */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />

      <div className="container relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Quote className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Testimonials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from educators and administrators who have transformed their institutions with EduCore.
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="relative p-8 md:p-12 rounded-3xl bg-card border border-primary/10 shadow-xl"
              >
                {/* Quote icon */}
                <div className="absolute -top-6 left-8 md:left-12">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full gradient-primary shadow-lg shadow-primary/30">
                    <Quote className="w-5 h-5 text-primary-foreground" />
                  </div>
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-6 pt-4">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-lg md:text-xl lg:text-2xl leading-relaxed mb-8 text-foreground/90">
                  "{currentTestimonial.content}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full gradient-primary text-primary-foreground text-lg font-bold shadow-lg shadow-primary/30">
                    {currentTestimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-lg">{currentTestimonial.name}</div>
                    <div className="text-muted-foreground">
                      {currentTestimonial.role} • {currentTestimonial.school}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "bg-primary w-8"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevTestimonial}
                  className="rounded-full w-12 h-12 border-2 border-primary/30 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextTestimonial}
                  className="rounded-full w-12 h-12 border-2 border-primary/30 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const TestimonialsSection = memo(TestimonialsSectionComponent);
