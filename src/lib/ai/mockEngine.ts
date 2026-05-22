import { AIResponse, WebsiteData, WebsiteSection } from "@/types";

function normalize(text: string): string {
  return text.toLowerCase().trim();
}

function hasKeyword(message: string, ...keywords: string[]): boolean {
  const m = normalize(message);
  return keywords.some((k) => m.includes(k));
}

function nextId(type: string, sections: WebsiteSection[]): string {
  const count = sections.filter((s) => s.type === type).length;
  return `${type}-${count + 1}`;
}

function upsertSection(
  sections: WebsiteSection[],
  section: WebsiteSection
): WebsiteSection[] {
  const idx = sections.findIndex((s) => s.type === section.type);
  if (idx === -1) return [...sections, section];
  const next = [...sections];
  next[idx] = { ...section, id: sections[idx].id };
  return next;
}

function removeSectionByType(
  sections: WebsiteSection[],
  type: WebsiteSection["type"]
): WebsiteSection[] {
  return sections.filter((s) => s.type !== type);
}

function updateHero(
  sections: WebsiteSection[],
  patch: Partial<Extract<WebsiteSection, { type: "hero" }>>
): WebsiteSection[] {
  const hero = sections.find((s) => s.type === "hero");
  if (!hero || hero.type !== "hero") {
    return [
      {
        id: "hero-1",
        type: "hero",
        ...patch,
      },
      ...sections,
    ];
  }
  return sections.map((s) =>
    s.type === "hero" ? { ...s, ...patch } : s
  );
}

export function getRestaurantWebsite(): WebsiteSection[] {
  return [
    {
      id: "hero-1",
      type: "hero",
      badge: "Award-winning dining since 1998",
      title: "Best Restaurant",
      titleGradient: "in your city",
      subtitle:
        "Fresh ingredients, seasonal menus, and warm hospitality. Reserve your table for an unforgettable evening.",
      primaryBtnText: "Book a Table",
      secondaryBtnText: "View Menu",
      features: [
        {
          title: "Farm to table",
          desc: "Locally sourced produce and premium ingredients",
          iconName: "Star",
        },
        {
          title: "Private events",
          desc: "Perfect for celebrations, meetings, and gatherings",
          iconName: "Award",
        },
        {
          title: "Open daily",
          desc: "Lunch and dinner service, seven days a week",
          iconName: "Zap",
        },
      ],
    },
    {
      id: "features-1",
      type: "features",
      title: "Why guests love us",
      subtitle: "Everything you need for a perfect dining experience.",
      featuresList: [
        {
          title: "Chef's tasting menu",
          description: "A curated five-course journey through our seasonal favorites.",
          iconName: "Star",
        },
        {
          title: "Wine pairings",
          description: "Sommelier-selected wines to complement every dish.",
          iconName: "Globe",
        },
        {
          title: "Cozy atmosphere",
          description: "Elegant interiors designed for intimate conversations.",
          iconName: "Layers",
        },
      ],
    },
    {
      id: "pricing-1",
      type: "pricing",
      title: "Menus & packages",
      subtitle: "Flexible options for every occasion.",
      plans: [
        {
          name: "Lunch",
          price: "$24",
          period: "per person",
          features: ["Soup or salad", "Main course", "Soft drink"],
          btnText: "Reserve",
        },
        {
          name: "Dinner",
          price: "$48",
          period: "per person",
          features: ["Appetizer", "Entrée", "Dessert", "Coffee or tea"],
          isPopular: true,
          btnText: "Book now",
        },
        {
          name: "Private dining",
          price: "$120",
          period: "per guest",
          features: ["Custom menu", "Dedicated server", "Room rental"],
          btnText: "Contact us",
        },
      ],
    },
    {
      id: "testimonials-1",
      type: "testimonials",
      title: "What our guests say",
      subtitle: "Real reviews from people who dine with us.",
      items: [
        {
          quote: "The best meal we've had in years. Impeccable service and incredible flavors.",
          author: "Sarah Mitchell",
          role: "Food critic",
        },
        {
          quote: "Our wedding rehearsal dinner was perfect. The team went above and beyond.",
          author: "James & Elena",
          role: "Happy couple",
        },
      ],
    },
    {
      id: "contact-1",
      type: "contact",
      title: "Visit or reserve",
      subtitle: "We'd love to host you. Send a message or call to book.",
      email: "hello@bestrestaurant.com",
      supportText: "123 Main Street · Open 11am – 10pm",
      formPlaceholderEmail: "your@email.com",
      formPlaceholderMessage: "Date, time, and party size...",
      submitBtnText: "Request reservation",
    },
  ];
}

function buildPricingSection(sections: WebsiteSection[]): WebsiteSection {
  return {
    id: nextId("pricing", sections),
    type: "pricing",
    title: "Simple, transparent pricing",
    subtitle: "Choose the plan that fits your business.",
    plans: [
      {
        name: "Starter",
        price: "$19",
        period: "/month",
        features: ["1 website", "Basic templates", "Email support"],
        btnText: "Get started",
      },
      {
        name: "Pro",
        price: "$49",
        period: "/month",
        features: ["Unlimited pages", "Custom domain", "Priority support"],
        isPopular: true,
        btnText: "Start free trial",
      },
      {
        name: "Enterprise",
        price: "Custom",
        features: ["Dedicated account manager", "SLA", "SSO & advanced security"],
        btnText: "Contact sales",
      },
    ],
  };
}

function buildFaqSection(sections: WebsiteSection[]): WebsiteSection {
  return {
    id: nextId("faq", sections),
    type: "faq",
    title: "Frequently asked questions",
    subtitle: "Quick answers to common questions.",
    questions: [
      {
        question: "How do I get started?",
        answer:
          "Sign up for a free account, pick a template, and customize your site with our AI assistant.",
      },
      {
        question: "Can I use my own domain?",
        answer: "Yes. Connect a custom domain on Pro and Enterprise plans.",
      },
      {
        question: "Is there a free trial?",
        answer: "Pro includes a 14-day free trial. No credit card required to start.",
      },
      {
        question: "How do I contact support?",
        answer: "Email support@example.com or use the contact form below.",
      },
    ],
  };
}

/**
 * Development mock: returns hardcoded website JSON based on user message.
 */
export function getMockAIResponse(
  message: string,
  currentWebsite: WebsiteData
): AIResponse {
  const m = normalize(message);
  let theme = currentWebsite.theme ?? "light";
  let sections = [...currentWebsite.sections];
  let chatResponse = "I've updated your website. Check the canvas preview.";

  if (
    hasKeyword(m, "restaurant", "create a restaurant", "food", "dining", "cafe")
  ) {
    sections = getRestaurantWebsite();
    theme = "light";
    chatResponse =
      "I've created a full restaurant website with hero, features, menus, testimonials, and contact sections.";
    return { theme, chatResponse, sections };
  }

  if (hasKeyword(m, "pricing", "plans", "starter", "pro", "enterprise")) {
    sections = upsertSection(sections, buildPricingSection(sections));
    chatResponse = "Added a pricing section with Starter, Pro, and Enterprise plans.";
    return { theme, chatResponse, sections };
  }

  if (hasKeyword(m, "faq", "questions", "frequently asked")) {
    sections = upsertSection(sections, buildFaqSection(sections));
    chatResponse = "Added a FAQ section with four common questions.";
    return { theme, chatResponse, sections };
  }

  if (hasKeyword(m, "light theme", "light mode", "switch to light")) {
    theme = "light";
    chatResponse = "Switched your website to the light theme.";
    return { theme, chatResponse, sections };
  }

  if (hasKeyword(m, "dark theme", "dark mode", "switch to dark")) {
    theme = "dark";
    chatResponse = "Switched your website to the dark theme.";
    return { theme, chatResponse, sections };
  }

  if (hasKeyword(m, "modern", "minimal", "stripe", "linear", "clean design")) {
    theme = "light";
    sections = updateHero(sections, {
      badge: "Modern & minimal",
      title: "Build something",
      titleGradient: "people remember",
      subtitle:
        "A clean, professional website that helps your business stand out — no technical skills needed.",
      primaryBtnText: "Get started",
      secondaryBtnText: "Learn more",
    });
    chatResponse =
      "Refreshed your hero with a modern, minimal style inspired by leading SaaS brands.";
    return { theme, chatResponse, sections };
  }

  if (hasKeyword(m, "hero", "headline", "title", "change hero", "update hero")) {
    const titleMatch = message.match(/title to ["'](.+?)["']/i);
    const title = titleMatch?.[1] ?? "Grow your business online";
    sections = updateHero(sections, {
      title,
      titleGradient: "with confidence",
      subtitle:
        "Professional websites made simple. Tell us what you need and we'll design it for you.",
    });
    chatResponse = `Updated the hero headline to "${title}".`;
    return { theme, chatResponse, sections };
  }

  if (hasKeyword(m, "remove contact")) {
    sections = removeSectionByType(sections, "contact");
    chatResponse = "Removed the contact section from your website.";
    return { theme, chatResponse, sections };
  }

  if (hasKeyword(m, "remove pricing")) {
    sections = removeSectionByType(sections, "pricing");
    chatResponse = "Removed the pricing section.";
    return { theme, chatResponse, sections };
  }

  if (hasKeyword(m, "remove faq")) {
    sections = removeSectionByType(sections, "faq");
    chatResponse = "Removed the FAQ section.";
    return { theme, chatResponse, sections };
  }

  if (m.startsWith("remove ")) {
    const type = m.replace("remove ", "").replace(" section", "").trim();
    const valid = ["hero", "features", "pricing", "testimonials", "faq", "contact"];
    if (valid.includes(type)) {
      sections = removeSectionByType(sections, type as WebsiteSection["type"]);
      chatResponse = `Removed the ${type} section.`;
      return { theme, chatResponse, sections };
    }
  }

  if (hasKeyword(m, "contact", "add contact")) {
    sections = upsertSection(sections, {
      id: nextId("contact", sections),
      type: "contact",
      title: "Get in touch",
      subtitle: "We'd love to hear from you.",
      email: "hello@example.com",
      submitBtnText: "Send message",
    });
    chatResponse = "Added a contact section.";
    return { theme, chatResponse, sections };
  }

  if (hasKeyword(m, "features", "add features")) {
    sections = upsertSection(sections, {
      id: nextId("features", sections),
      type: "features",
      title: "Why choose us",
      subtitle: "Everything you need to succeed.",
      featuresList: [
        {
          title: "Easy to use",
          description: "Build and edit your site in minutes with AI assistance.",
          iconName: "Zap",
        },
        {
          title: "Professional design",
          description: "Beautiful templates that look great on every device.",
          iconName: "Star",
        },
        {
          title: "Always supported",
          description: "Friendly help whenever you need it.",
          iconName: "MessageSquare",
        },
      ],
    });
    chatResponse = "Added a features section.";
    return { theme, chatResponse, sections };
  }

  // Default: ensure at least a hero exists
  if (sections.length === 0) {
    sections = [
      {
        id: "hero-1",
        type: "hero",
        title: "Welcome to your website",
        titleGradient: "built with AI",
        subtitle: "Try: \"Create a restaurant website\" or \"Add pricing section\"",
      },
    ];
    chatResponse =
      "Added a starter hero section. Try \"Create a restaurant website\" for a full demo site.";
  } else {
    chatResponse =
      "I'm running in demo mode. Try: \"Create a restaurant website\", \"Add pricing section\", or \"Switch to light theme\".";
  }

  return { theme, chatResponse, sections };
}

function isValidApiKey(key?: string): boolean {
  const k = key?.trim();
  return !!k && k !== "sk-your-key-here" && !k.includes("your-key-here");
}

export function shouldUseMockAI(): boolean {
  if (process.env.USE_MOCK_AI === "true") return true;
  if (process.env.USE_MOCK_AI === "false") return false;
  return (
    !isValidApiKey(process.env.OPENROUTER_API_KEY) &&
    !isValidApiKey(process.env.OPENAI_API_KEY)
  );
}
