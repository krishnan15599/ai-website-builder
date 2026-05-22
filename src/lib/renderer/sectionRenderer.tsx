import React from "react";
import HeroSection from "@/components/sections/HeroSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import ContactSection from "@/components/sections/ContactSection";
import PricingSection from "@/components/sections/PricingSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import FAQSection from "@/components/sections/FAQSection";
import {
  WebsiteSection,
  HeroSection as HeroSectionType,
  FeaturesSection as FeaturesSectionType,
  PricingSection as PricingSectionType,
  TestimonialsSection as TestimonialsSectionType,
  FAQSection as FAQSectionType,
  ContactSection as ContactSectionType,
} from "@/types";

/**
 * Dynamically resolves and renders a site section component.
 * Each case explicitly casts to its own type to satisfy TypeScript's
 * prop-compatibility checks (avoids union-spread conflicts).
 */
export function renderSection(section: WebsiteSection, theme: "light" | "dark") {
  switch (section.type) {
    case "hero": {
      const { id, type: _t, ...props } = section as HeroSectionType;
      return <HeroSection key={id} theme={theme} {...props} />;
    }
    case "features": {
      const { id, type: _t, ...props } = section as FeaturesSectionType;
      return <FeaturesSection key={id} theme={theme} {...props} />;
    }
    case "pricing": {
      const { id, type: _t, ...props } = section as PricingSectionType;
      return <PricingSection key={id} theme={theme} {...props} />;
    }
    case "testimonials": {
      const { id, type: _t, ...props } = section as TestimonialsSectionType;
      return <TestimonialsSection key={id} theme={theme} {...props} />;
    }
    case "faq": {
      const { id, type: _t, ...props } = section as FAQSectionType;
      return <FAQSection key={id} theme={theme} {...props} />;
    }
    case "contact": {
      const { id, type: _t, ...props } = section as ContactSectionType;
      return <ContactSection key={id} theme={theme} {...props} />;
    }
    default:
      return (
        <div
          key={(section as { id: string }).id}
          className="p-4 border border-rose-500 bg-rose-500/10 text-rose-400 rounded-lg"
        >
          Unknown section type: {(section as { type: string }).type}
        </div>
      );
  }
}
