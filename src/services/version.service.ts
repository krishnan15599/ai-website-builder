import { versionRepository } from "@/repositories/version.repository";
import { projectService } from "@/services/project.service";
import type { DbWebsiteVersion } from "@/types/database";
import type { WebsiteData } from "@/types";

export class VersionNotFoundError extends Error {
  constructor() {
    super("Version not found");
    this.name = "VersionNotFoundError";
  }
}

export const versionService = {
  async listVersions(
    projectId: string,
    userId: string
  ): Promise<DbWebsiteVersion[]> {
    await projectService.assertOwnership(projectId, userId);
    return versionRepository.findByProjectId(projectId);
  },

  async createVersion(
    projectId: string,
    userId: string,
    websiteJson: WebsiteData
  ): Promise<DbWebsiteVersion> {
    await projectService.assertOwnership(projectId, userId);
    return versionRepository.create(projectId, websiteJson);
  },

  async restoreVersion(
    projectId: string,
    userId: string,
    versionId: string
  ): Promise<{ project: Awaited<ReturnType<typeof projectService.updateProject>>; version: DbWebsiteVersion }> {
    await projectService.assertOwnership(projectId, userId);

    const version = await versionRepository.findById(versionId, projectId);
    if (!version) {
      throw new VersionNotFoundError();
    }

    const project = await projectService.updateProject(
      projectId,
      userId,
      { websiteJson: version.websiteJson },
      { recordVersion: true }
    );

    return { project, version };
  },
};
