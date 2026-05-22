import { chatRepository } from "@/repositories/chat.repository";
import { projectService } from "@/services/project.service";
import type { CreateChatMessageInput, DbChatMessage } from "@/types/database";

export const chatService = {
  async getMessages(
    projectId: string,
    userId: string
  ): Promise<DbChatMessage[]> {
    await projectService.assertOwnership(projectId, userId);
    return chatRepository.findByProjectId(projectId);
  },

  async addMessage(
    userId: string,
    input: CreateChatMessageInput
  ): Promise<DbChatMessage> {
    await projectService.assertOwnership(input.projectId, userId);
    return chatRepository.create(input);
  },

  async addMessagePair(
    userId: string,
    projectId: string,
    userContent: string,
    assistantContent: string
  ): Promise<{ user: DbChatMessage; assistant: DbChatMessage }> {
    await projectService.assertOwnership(projectId, userId);

    const user = await chatRepository.create({
      projectId,
      role: "user",
      content: userContent,
    });

    const assistant = await chatRepository.create({
      projectId,
      role: "assistant",
      content: assistantContent,
    });

    return { user, assistant };
  },
};
