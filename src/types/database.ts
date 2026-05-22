import type { WebsiteData } from "@/types";

export interface DbUser {
  id: string;
  email: string;
  createdAt: Date;
}

export interface DbProject {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  theme: string;
  websiteJson: WebsiteData;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbChatMessage {
  id: string;
  projectId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export interface DbWebsiteVersion {
  id: string;
  projectId: string;
  websiteJson: WebsiteData;
  createdAt: Date;
}

export interface ProjectWithRelations extends DbProject {
  chatMessages: DbChatMessage[];
  versions?: DbWebsiteVersion[];
  settings?: DbProjectSettings | null;
}

export interface DbProjectSettings {
  id: string;
  projectId: string;
  seoTitle: string | null;
  seoDescription: string | null;
  customDomain: string | null;
  faviconUrl: string | null;
  analyticsId: string | null;
  publishStatus: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}

export interface DbTemplate {
  id: string;
  name: string;
  category: string;
  description: string | null;
  thumbnailUrl: string | null;
  websiteJson: WebsiteData;
  isPublic: boolean;
  userId: string | null;
  createdAt: Date;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  templateId?: string;
}

export interface UpdateProjectSettingsInput {
  seoTitle?: string | null;
  seoDescription?: string | null;
  customDomain?: string | null;
  faviconUrl?: string | null;
  analyticsId?: string | null;
  publishStatus?: "draft" | "published";
}

export interface UpdateProjectInput {
  name?: string;
  description?: string | null;
  theme?: string;
  websiteJson?: WebsiteData;
}

export interface CreateChatMessageInput {
  projectId: string;
  role: "user" | "assistant";
  content: string;
}

export interface CreateVersionInput {
  projectId: string;
  websiteJson: WebsiteData;
}
