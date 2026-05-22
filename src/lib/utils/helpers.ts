import { AIResponse, WebsiteSection } from "@/types";

/**
 * Clean markdown JSON wrappers from an AI response string.
 */
export function cleanJsonString(str: string): string {
  let cleaned = str.trim();
  if (cleaned.startsWith("```json")) cleaned = cleaned.slice(7);
  else if (cleaned.startsWith("```")) cleaned = cleaned.slice(3);
  if (cleaned.endsWith("```")) cleaned = cleaned.slice(0, -3);
  return cleaned.trim();
}

const VALID_TYPES = ["hero", "features", "pricing", "testimonials", "faq", "contact"];

/**
 * Validates and normalizes the AI builder response for all 6 section types.
 */
export function validateAIResponse(json: unknown): AIResponse {
  if (!json || typeof json !== "object") {
    throw new Error("AI response is not a valid JSON object");
  }

  const obj = json as Record<string, unknown>;

  let theme: "light" | "dark" = "dark";
  if (obj.theme === "light" || obj.theme === "dark") theme = obj.theme;

  const sections = obj.sections;
  if (!sections || !Array.isArray(sections)) {
    throw new Error("AI response must contain a 'sections' array");
  }
  if (sections.length === 0) {
    throw new Error("AI response sections list cannot be empty");
  }

  const validatedSections: WebsiteSection[] = [];

  sections.forEach((sec: unknown, index: number) => {
    if (!sec || typeof sec !== "object") throw new Error(`Section at index ${index} is not an object`);

    const s = sec as Record<string, unknown>;
    const sType = s.type as string;

    if (!sType || !VALID_TYPES.includes(sType)) {
      throw new Error(`Section at index ${index} has invalid type "${sType}". Must be one of: ${VALID_TYPES.join(", ")}`);
    }

    const id = (s.id as string) || `${sType}-${Date.now()}-${index}`;

    if (sType === "hero") {
      validatedSections.push({
        id, type: "hero",
        badge: s.badge as string | undefined,
        title: s.title as string | undefined,
        titleGradient: s.titleGradient as string | undefined,
        subtitle: s.subtitle as string | undefined,
        primaryBtnText: s.primaryBtnText as string | undefined,
        secondaryBtnText: s.secondaryBtnText as string | undefined,
        stats: s.stats as Array<{ label: string; value: string; pct: string }> | undefined,
        features: s.features as Array<{ title: string; desc: string; iconName: string }> | undefined,
      });
    } else if (sType === "features") {
      validatedSections.push({
        id, type: "features",
        title: s.title as string | undefined,
        subtitle: s.subtitle as string | undefined,
        featuresList: s.featuresList as Array<{ title: string; description: string; iconName: string }> | undefined,
        items: s.items as string[] | undefined,
      });
    } else if (sType === "pricing") {
      validatedSections.push({
        id, type: "pricing",
        title: s.title as string | undefined,
        subtitle: s.subtitle as string | undefined,
        plans: s.plans as Array<{
          name: string; price: string; period?: string;
          features: string[]; isPopular?: boolean; btnText?: string;
        }> | undefined,
      });
    } else if (sType === "testimonials") {
      validatedSections.push({
        id, type: "testimonials",
        title: s.title as string | undefined,
        subtitle: s.subtitle as string | undefined,
        items: s.items as Array<{ quote: string; author: string; role?: string }> | undefined,
      });
    } else if (sType === "faq") {
      validatedSections.push({
        id, type: "faq",
        title: s.title as string | undefined,
        subtitle: s.subtitle as string | undefined,
        questions: s.questions as Array<{ question: string; answer: string }> | undefined,
      });
    } else if (sType === "contact") {
      validatedSections.push({
        id, type: "contact",
        title: s.title as string | undefined,
        subtitle: s.subtitle as string | undefined,
        email: s.email as string | undefined,
        supportText: s.supportText as string | undefined,
        formPlaceholderEmail: s.formPlaceholderEmail as string | undefined,
        formPlaceholderMessage: s.formPlaceholderMessage as string | undefined,
        submitBtnText: s.submitBtnText as string | undefined,
      });
    }
  });

  return {
    theme,
    chatResponse: typeof obj.chatResponse === "string" ? obj.chatResponse : undefined,
    sections: validatedSections,
  };
}
