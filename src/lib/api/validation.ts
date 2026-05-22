import {
  createProjectSchema,
  updateProjectSchema,
  chatMessageSchema,
  versionCreateSchema,
  parseBody,
} from "@/lib/validation/schemas";
import type { CreateProjectInput } from "@/types/database";

export function parseCreateProjectBody(body: unknown): CreateProjectInput | null {
  const parsed = parseBody(createProjectSchema, body);
  if (!parsed.success) return null;
  const { name, description, templateId } = parsed.data;
  return {
    name: name ?? "Untitled Project",
    description,
    ...(templateId ? { templateId } : {}),
  };
}

export function parseChatBody(body: unknown): {
  projectId: string;
  message: string;
} | null {
  const parsed = parseBody(chatMessageSchema, body);
  if (!parsed.success) return null;
  return parsed.data;
}

export function parseVersionBody(body: unknown): {
  projectId: string;
  websiteJson: unknown;
} | null {
  const parsed = parseBody(versionCreateSchema, body);
  if (!parsed.success) return null;
  return parsed.data;
}

export function parseUpdateProjectBody(body: unknown): {
  name?: string;
  description?: string | null;
  websiteJson?: unknown;
} | null {
  const parsed = parseBody(updateProjectSchema, body);
  if (!parsed.success) return null;
  return parsed.data;
}
