import { prisma } from "@/lib/prisma";
import { DEFAULT_WEBSITE } from "@/lib/website/defaults";
import type { DbTemplate } from "@/types/database";
import type { WebsiteData } from "@/types";
import type { Prisma } from "@prisma/client";

function parseWebsiteJson(json: Prisma.JsonValue): WebsiteData {
  if (typeof json === "object" && json !== null && "sections" in json) {
    return json as unknown as WebsiteData;
  }
  return DEFAULT_WEBSITE;
}

function toDbTemplate(row: {
  id: string;
  name: string;
  category: string;
  description: string | null;
  thumbnailUrl: string | null;
  websiteJson: Prisma.JsonValue;
  isPublic: boolean;
  userId: string | null;
  createdAt: Date;
}): DbTemplate {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
    thumbnailUrl: row.thumbnailUrl,
    websiteJson: parseWebsiteJson(row.websiteJson),
    isPublic: row.isPublic,
    userId: row.userId,
    createdAt: row.createdAt,
  };
}

export const templateRepository = {
  async findPublic(category?: string): Promise<DbTemplate[]> {
    const rows = await prisma.template.findMany({
      where: {
        isPublic: true,
        ...(category ? { category } : {}),
      },
      orderBy: { name: "asc" },
    });
    return rows.map(toDbTemplate);
  },

  async findById(id: string): Promise<DbTemplate | null> {
    const row = await prisma.template.findFirst({
      where: {
        id,
        OR: [{ isPublic: true }, { userId: { not: null } }],
      },
    });
    return row ? toDbTemplate(row) : null;
  },

  async findAccessible(
    id: string,
    userId?: string
  ): Promise<DbTemplate | null> {
    const row = await prisma.template.findFirst({
      where: {
        id,
        OR: [{ isPublic: true }, ...(userId ? [{ userId }] : [])],
      },
    });
    return row ? toDbTemplate(row) : null;
  },
};
