import { prisma } from "@/lib/prisma";
import type { CreateChatMessageInput, DbChatMessage } from "@/types/database";

export const chatRepository = {
  async findByProjectId(projectId: string): Promise<DbChatMessage[]> {
    const rows = await prisma.chatMessage.findMany({
      where: { projectId },
      orderBy: { createdAt: "asc" },
    });
    return rows.map((row) => ({
      id: row.id,
      projectId: row.projectId,
      role: row.role as "user" | "assistant",
      content: row.content,
      createdAt: row.createdAt,
    }));
  },

  async create(input: CreateChatMessageInput): Promise<DbChatMessage> {
    const row = await prisma.chatMessage.create({
      data: {
        projectId: input.projectId,
        role: input.role,
        content: input.content,
      },
    });
    return {
      id: row.id,
      projectId: row.projectId,
      role: row.role as "user" | "assistant",
      content: row.content,
      createdAt: row.createdAt,
    };
  },

  async createMany(
    messages: CreateChatMessageInput[]
  ): Promise<DbChatMessage[]> {
    await prisma.chatMessage.createMany({
      data: messages.map((m) => ({
        projectId: m.projectId,
        role: m.role,
        content: m.content,
      })),
    });
    return this.findByProjectId(messages[0]?.projectId ?? "");
  },
};
