import {
  generateWebsiteEdit,
  generateWebsiteFromScratch,
} from "@/lib/ai/generate";
import type { AIResponse, WebsiteData, WebsiteTheme } from "@/types";

export const aiService = {
  async edit(message: string, currentWebsite: WebsiteData): Promise<AIResponse> {
    return generateWebsiteEdit(message, currentWebsite);
  },

  async generate(
    message: string,
    preferredTheme?: WebsiteTheme
  ): Promise<AIResponse> {
    return generateWebsiteFromScratch(message, preferredTheme);
  },
};
