import { projectSettingsRepository } from "@/repositories/project-settings.repository";
import { projectService } from "@/services/project.service";
import type {
  DbProjectSettings,
  UpdateProjectSettingsInput,
} from "@/types/database";

export const projectSettingsService = {
  async getSettings(
    projectId: string,
    userId: string
  ): Promise<DbProjectSettings> {
    await projectService.assertOwnership(projectId, userId);
    return projectSettingsRepository.getOrCreate(projectId);
  },

  async updateSettings(
    projectId: string,
    userId: string,
    input: UpdateProjectSettingsInput
  ): Promise<DbProjectSettings> {
    await projectService.assertOwnership(projectId, userId);
    return projectSettingsRepository.update(projectId, input);
  },
};
