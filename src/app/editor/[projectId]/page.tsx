import { notFound } from "next/navigation";
import EditorWorkspace from "@/components/editor/EditorWorkspace";
import { getAuthenticatedDbUser } from "@/lib/auth";
import { projectService } from "@/services/project.service";

interface EditorPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function EditorPage({ params }: EditorPageProps) {
  const { projectId } = await params;
  const user = await getAuthenticatedDbUser();

  try {
    const project = await projectService.getProject(projectId, user.id);

    return (
      <EditorWorkspace
        projectId={project.id}
        projectName={project.name}
        initialWebsite={project.websiteJson}
        initialMessages={project.chatMessages}
      />
    );
  } catch {
    notFound();
  }
}
