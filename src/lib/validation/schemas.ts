import { z } from "zod";
import type { WebsiteData } from "@/types";

const websiteThemeSchema = z.enum(["light", "dark"]);

export const websiteDataSchema = z.object({
  theme: websiteThemeSchema,
  sections: z.array(z.record(z.string(), z.unknown())).min(0),
});

export function toWebsiteData(data: z.infer<typeof websiteDataSchema>): WebsiteData {
  return data as unknown as WebsiteData;
}

export const createProjectSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    description: z.string().trim().max(500).optional(),
    duplicateFromId: z.string().uuid().optional(),
    templateId: z.string().uuid().optional(),
  })
  .refine((data) => Boolean(data.duplicateFromId) || Boolean(data.name?.length), {
    message: "name: Project name is required",
  });

export const updateProjectSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    description: z.string().trim().max(500).nullable().optional(),
    websiteJson: websiteDataSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const chatMessageSchema = z.object({
  projectId: z.string().uuid(),
  message: z.string().trim().min(1).max(8000),
});

export const aiEditSchema = z.object({
  message: z.string().trim().min(1).max(8000),
  currentWebsite: websiteDataSchema,
});

export const aiGenerateSchema = z.object({
  message: z.string().trim().min(1).max(8000),
  theme: websiteThemeSchema.optional(),
});

export const versionCreateSchema = z.object({
  projectId: z.string().uuid(),
  websiteJson: websiteDataSchema,
});

export const versionRestoreSchema = z.object({
  versionId: z.string().uuid(),
});

export const projectSettingsSchema = z.object({
  seoTitle: z.string().trim().max(120).nullable().optional(),
  seoDescription: z.string().trim().max(500).nullable().optional(),
  customDomain: z.string().trim().max(253).nullable().optional(),
  faviconUrl: z.union([z.string().url().max(2048), z.literal("")]).nullable().optional(),
  analyticsId: z.string().trim().max(100).nullable().optional(),
  publishStatus: z.enum(["draft", "published"]).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
export type AiEditInput = z.infer<typeof aiEditSchema>;
export type AiGenerateInput = z.infer<typeof aiGenerateSchema>;
export type VersionCreateInput = z.infer<typeof versionCreateSchema>;
export type VersionRestoreInput = z.infer<typeof versionRestoreSchema>;
export type ProjectSettingsInput = z.infer<typeof projectSettingsSchema>;

export function parseBody<T>(
  schema: z.ZodSchema<T>,
  body: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(body);
  if (!result.success) {
    const first = result.error.issues[0];
    return {
      success: false,
      error: first ? `${first.path.join(".")}: ${first.message}` : "Invalid request body",
    };
  }
  return { success: true, data: result.data };
}
