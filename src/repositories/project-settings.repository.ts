import { prisma } from "@/lib/prisma";
import type {
  DbProjectSettings,
  UpdateProjectSettingsInput,
} from "@/types/database";

function toDbSettings(row: {
  id: string;
  projectId: string;
  seoTitle: string | null;
  seoDescription: string | null;
  customDomain: string | null;
  faviconUrl: string | null;
  analyticsId: string | null;
  publishStatus: string;
  createdAt: Date;
  updatedAt: Date;
}): DbProjectSettings {
  return {
    id: row.id,
    projectId: row.projectId,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    customDomain: row.customDomain,
    faviconUrl: row.faviconUrl,
    analyticsId: row.analyticsId,
    publishStatus: row.publishStatus as "draft" | "published",
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export const projectSettingsRepository = {
  async findByProjectId(projectId: string): Promise<DbProjectSettings | null> {
    const row = await prisma.projectSettings.findUnique({
      where: { projectId },
    });
    return row ? toDbSettings(row) : null;
  },

  async getOrCreate(projectId: string): Promise<DbProjectSettings> {
    const existing = await this.findByProjectId(projectId);
    if (existing) return existing;

    const row = await prisma.projectSettings.create({
      data: { projectId },
    });
    return toDbSettings(row);
  },

  async update(
    projectId: string,
    input: UpdateProjectSettingsInput
  ): Promise<DbProjectSettings> {
    await this.getOrCreate(projectId);

    const row = await prisma.projectSettings.update({
      where: { projectId },
      data: {
        ...(input.seoTitle !== undefined && { seoTitle: input.seoTitle }),
        ...(input.seoDescription !== undefined && {
          seoDescription: input.seoDescription,
        }),
        ...(input.customDomain !== undefined && {
          customDomain: input.customDomain,
        }),
        ...(input.faviconUrl !== undefined && { faviconUrl: input.faviconUrl }),
        ...(input.analyticsId !== undefined && {
          analyticsId: input.analyticsId,
        }),
        ...(input.publishStatus !== undefined && {
          publishStatus: input.publishStatus,
        }),
      },
    });
    return toDbSettings(row);
  },
};
