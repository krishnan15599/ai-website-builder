import { projectRepository } from "@/repositories/project.repository";
import { templateService } from "@/services/template.service";
import type {
  CreateProjectInput,
  DbProject,
  ProjectWithRelations,
  UpdateProjectInput,
} from "@/types/database";
import type { WebsiteData } from "@/types";

export class ProjectNotFoundError extends Error {
  constructor() {
    super("Project not found");
    this.name = "ProjectNotFoundError";
  }
}

export class ProjectForbiddenError extends Error {
  constructor() {
    super("You do not have access to this project");
    this.name = "ProjectForbiddenError";
  }
}

export const projectService = {
  async listProjects(userId: string): Promise<DbProject[]> {
    return projectRepository.findByUserId(userId);
  },

  async getProject(
    projectId: string,
    userId: string
  ): Promise<ProjectWithRelations> {
    const project = await projectRepository.findByIdForUser(projectId, userId);
    if (!project) {
      throw new ProjectNotFoundError();
    }
    return project;
  },

  async createProject(
    userId: string,
    input: CreateProjectInput
  ): Promise<DbProject> {
    let websiteJson = undefined;
    if (input.templateId) {
      const template = await templateService.getTemplate(
        input.templateId,
        userId
      );
      websiteJson = template.websiteJson;
    }

    const project = await projectRepository.create(
      userId,
      input,
      websiteJson
    );
    await projectRepository.createVersion(project.id, project.websiteJson);
    return project;
  },

  async duplicateProject(
    userId: string,
    sourceId: string,
    name?: string
  ): Promise<DbProject> {
    const project = await projectRepository.duplicate(sourceId, userId, name);
    if (!project) {
      throw new ProjectNotFoundError();
    }
    return project;
  },

  async updateProject(
    projectId: string,
    userId: string,
    input: UpdateProjectInput,
    options?: { recordVersion?: boolean }
  ): Promise<DbProject> {
    const project = await projectRepository.update(projectId, userId, input);
    if (!project) {
      throw new ProjectNotFoundError();
    }

    if (options?.recordVersion && input.websiteJson) {
      await projectRepository.createVersion(projectId, input.websiteJson);
    }

    return project;
  },

  async deleteProject(projectId: string, userId: string): Promise<void> {
    const deleted = await projectRepository.delete(projectId, userId);
    if (!deleted) {
      throw new ProjectNotFoundError();
    }
  },

  async saveWebsite(
    projectId: string,
    userId: string,
    websiteJson: WebsiteData,
    recordVersion = true
  ): Promise<DbProject> {
    return this.updateProject(
      projectId,
      userId,
      { websiteJson, theme: websiteJson.theme },
      { recordVersion }
    );
  },

  async assertOwnership(projectId: string, userId: string): Promise<DbProject> {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new ProjectNotFoundError();
    }
    if (project.userId !== userId) {
      throw new ProjectForbiddenError();
    }
    return project;
  },
};
