import { memo } from "react";
import {
  HeroSection,
  StatsSection,
  FeaturesSection,
  BenefitsSection,
  TestimonialsSection,
  CTASection,
} from "@/components/home";

function HomePageComponent() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <BenefitsSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}

export default memo(HomePageComponent);
