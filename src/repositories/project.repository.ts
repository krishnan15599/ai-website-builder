import { prisma } from "@/lib/prisma";
import { projectSettingsRepository } from "@/repositories/project-settings.repository";
import { versionRepository } from "@/repositories/version.repository";
import { DEFAULT_WEBSITE } from "@/lib/website/defaults";
import type {
  CreateProjectInput,
  DbProject,
  ProjectWithRelations,
  UpdateProjectInput,
} from "@/types/database";
import type { WebsiteData } from "@/types";
import type { Prisma } from "@prisma/client";

function parseWebsiteJson(json: Prisma.JsonValue): WebsiteData {
  if (typeof json === "object" && json !== null && "sections" in json) {
    return json as unknown as WebsiteData;
  }
  return DEFAULT_WEBSITE;
}

function toDbProject(
  row: {
    id: string;
    userId: string;
    name: string;
    description: string | null;
    theme: string;
    websiteJson: Prisma.JsonValue;
    createdAt: Date;
    updatedAt: Date;
  }
): DbProject {
  return {
    ...row,
    websiteJson: parseWebsiteJson(row.websiteJson),
  };
}

export const projectRepository = {
  async findByUserId(userId: string): Promise<DbProject[]> {
    const rows = await prisma.project.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });
    return rows.map(toDbProject);
  },

  async findById(id: string): Promise<DbProject | null> {
    const row = await prisma.project.findUnique({ where: { id } });
    return row ? toDbProject(row) : null;
  },

  async findByIdForUser(
    id: string,
    userId: string
  ): Promise<ProjectWithRelations | null> {
    const row = await prisma.project.findFirst({
      where: { id, userId },
      include: {
        chatMessages: { orderBy: { createdAt: "asc" } },
        versions: { orderBy: { createdAt: "desc" }, take: 50 },
        settings: true,
      },
    });
    if (!row) return null;

    return {
      ...toDbProject(row),
      chatMessages: row.chatMessages.map((m) => ({
        id: m.id,
        projectId: m.projectId,
        role: m.role as "user" | "assistant",
        content: m.content,
        createdAt: m.createdAt,
      })),
      versions: row.versions.map((v) => ({
        id: v.id,
        projectId: v.projectId,
        websiteJson: parseWebsiteJson(v.websiteJson),
        createdAt: v.createdAt,
      })),
      settings: row.settings
        ? {
            id: row.settings.id,
            projectId: row.settings.projectId,
            seoTitle: row.settings.seoTitle,
            seoDescription: row.settings.seoDescription,
            customDomain: row.settings.customDomain,
            faviconUrl: row.settings.faviconUrl,
            analyticsId: row.settings.analyticsId,
            publishStatus: row.settings.publishStatus as "draft" | "published",
            createdAt: row.settings.createdAt,
            updatedAt: row.settings.updatedAt,
          }
        : null,
    };
  },

  async create(
    userId: string,
    input: CreateProjectInput,
    websiteJson: WebsiteData = DEFAULT_WEBSITE
  ): Promise<DbProject> {
    const row = await prisma.project.create({
      data: {
        userId,
        name: input.name.trim(),
        description: input.description?.trim() ?? null,
        theme: websiteJson.theme,
        websiteJson: websiteJson as unknown as Prisma.InputJsonValue,
        settings: { create: {} },
      },
    });
    return toDbProject(row);
  },

  async duplicate(
    sourceId: string,
    userId: string,
    name?: string
  ): Promise<DbProject | null> {
    const source = await prisma.project.findFirst({
      where: { id: sourceId, userId },
    });
    if (!source) return null;

    const websiteJson = parseWebsiteJson(source.websiteJson);

    const row = await prisma.project.create({
      data: {
        userId,
        name: name ?? `${source.name} (copy)`,
        description: source.description,
        theme: source.theme,
        websiteJson: websiteJson as unknown as Prisma.InputJsonValue,
        settings: { create: {} },
      },
    });

    await versionRepository.create(row.id, websiteJson);
    await projectSettingsRepository.getOrCreate(row.id);

    return toDbProject(row);
  },

  async update(
    id: string,
    userId: string,
    input: UpdateProjectInput
  ): Promise<DbProject | null> {
    const existing = await prisma.project.findFirst({
      where: { id, userId },
    });
    if (!existing) return null;

    const row = await prisma.project.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name.trim() }),
        ...(input.description !== undefined && {
          description: input.description?.trim() ?? null,
        }),
        ...(input.theme !== undefined && { theme: input.theme }),
        ...(input.websiteJson !== undefined && {
          websiteJson: input.websiteJson as unknown as Prisma.InputJsonValue,
          theme: input.websiteJson.theme,
        }),
      },
    });
    return toDbProject(row);
  },

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await prisma.project.deleteMany({
      where: { id, userId },
    });
    return result.count > 0;
  },

  async createVersion(
    projectId: string,
    websiteJson: WebsiteData
  ): Promise<string> {
    const version = await versionRepository.create(projectId, websiteJson);
    return version.id;
  },
};
