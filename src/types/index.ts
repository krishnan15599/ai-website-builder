export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  codePayload?: string; // Simulates generated React code
  sections?: WebsiteSection[];
}

export type DeviceMode = "desktop" | "tablet" | "mobile";

export type PreviewTab = "preview" | "code";

export interface SuggestedPrompt {
  id: string;
  label: string;
  prompt: string;
  icon: string;
}

export interface SectionComponent {
  id: string;
  name: string;
  description: string;
  code: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>;
}

export interface HeroSection {
  id: string;
  type: "hero";
  badge?: string;
  title?: string;
  titleGradient?: string;
  subtitle?: string;
  primaryBtnText?: string;
  secondaryBtnText?: string;
  stats?: Array<{ label: string; value: string; pct: string }>;
  features?: Array<{ title: string; desc: string; iconName: string }>;
}

export interface FeaturesSection {
  id: string;
  type: "features";
  title?: string;
  subtitle?: string;
  featuresList?: Array<{ title: string; description: string; iconName: string }>;
  items?: string[];
}

export interface PricingSection {
  id: string;
  type: "pricing";
  title?: string;
  subtitle?: string;
  plans?: Array<{
    name: string;
    price: string;
    period?: string;
    features: string[];
    isPopular?: boolean;
    btnText?: string;
  }>;
}

export interface TestimonialsSection {
  id: string;
  type: "testimonials";
  title?: string;
  subtitle?: string;
  items?: Array<{
    quote: string;
    author: string;
    role?: string;
    avatarUrl?: string;
  }>;
}

export interface FAQSection {
  id: string;
  type: "faq";
  title?: string;
  subtitle?: string;
  questions?: Array<{
    question: string;
    answer: string;
  }>;
}

export interface ContactSection {
  id: string;
  type: "contact";
  title?: string;
  subtitle?: string;
  email?: string;
  supportText?: string;
  formPlaceholderEmail?: string;
  formPlaceholderMessage?: string;
  submitBtnText?: string;
}

export type WebsiteSection =
  | HeroSection
  | FeaturesSection
  | PricingSection
  | TestimonialsSection
  | FAQSection
  | ContactSection;

export type WebsiteTheme = "light" | "dark";

export interface WebsiteData {
  theme: WebsiteTheme;
  sections: WebsiteSection[];
}

export interface AIResponse {
  theme: WebsiteTheme;
  chatResponse?: string;
  sections: WebsiteSection[];
}


