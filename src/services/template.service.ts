import { templateRepository } from "@/repositories/template.repository";
import type { DbTemplate } from "@/types/database";

export class TemplateNotFoundError extends Error {
  constructor() {
    super("Template not found");
    this.name = "TemplateNotFoundError";
  }
}

export const templateService = {
  async listTemplates(category?: string): Promise<DbTemplate[]> {
    return templateRepository.findPublic(category);
  },

  async getTemplate(id: string, userId?: string): Promise<DbTemplate> {
    const template = await templateRepository.findAccessible(id, userId);
    if (!template) {
      throw new TemplateNotFoundError();
    }
    return template;
  },
};
