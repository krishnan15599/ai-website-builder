import { prisma } from "@/lib/prisma";
import { DEFAULT_WEBSITE } from "@/lib/website/defaults";
import type { DbWebsiteVersion } from "@/types/database";
import type { WebsiteData } from "@/types";
import type { Prisma } from "@prisma/client";

const MAX_VERSIONS_PER_PROJECT = 50;

function parseWebsiteJson(json: Prisma.JsonValue): WebsiteData {
  if (typeof json === "object" && json !== null && "sections" in json) {
    return json as unknown as WebsiteData;
  }
  return DEFAULT_WEBSITE;
}

function toDbVersion(row: {
  id: string;
  projectId: string;
  websiteJson: Prisma.JsonValue;
  createdAt: Date;
}): DbWebsiteVersion {
  return {
    id: row.id,
    projectId: row.projectId,
    websiteJson: parseWebsiteJson(row.websiteJson),
    createdAt: row.createdAt,
  };
}

export const versionRepository = {
  async findByProjectId(
    projectId: string,
    limit = MAX_VERSIONS_PER_PROJECT
  ): Promise<DbWebsiteVersion[]> {
    const rows = await prisma.websiteVersion.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return rows.map(toDbVersion);
  },

  async findById(
    versionId: string,
    projectId: string
  ): Promise<DbWebsiteVersion | null> {
    const row = await prisma.websiteVersion.findFirst({
      where: { id: versionId, projectId },
    });
    return row ? toDbVersion(row) : null;
  },

  async create(
    projectId: string,
    websiteJson: WebsiteData
  ): Promise<DbWebsiteVersion> {
    const row = await prisma.websiteVersion.create({
      data: {
        projectId,
        websiteJson: websiteJson as unknown as Prisma.InputJsonValue,
      },
    });

    await this.pruneOldVersions(projectId);

    return toDbVersion(row);
  },

  async pruneOldVersions(projectId: string): Promise<void> {
    const versions = await prisma.websiteVersion.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
      select: { id: true },
      skip: MAX_VERSIONS_PER_PROJECT,
    });

    if (versions.length === 0) return;

    await prisma.websiteVersion.deleteMany({
      where: { id: { in: versions.map((v) => v.id) } },
    });
  },
};
