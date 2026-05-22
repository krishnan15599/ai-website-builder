import { NextResponse } from "next/server";
import { getAuthenticatedDbUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api/errors";
import { parseCreateProjectBody } from "@/lib/api/validation";
import { projectService } from "@/services/project.service";

export async function GET() {
  try {
    const user = await getAuthenticatedDbUser();
    const projects = await projectService.listProjects(user.id);
    return NextResponse.json({ projects });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedDbUser();
    const body = await req.json().catch(() => null);
    const input = parseCreateProjectBody(body);

    if (!input) {
      return NextResponse.json(
        { error: "Valid project name is required" },
        { status: 400 }
      );
    }

    const duplicateFromId =
      body &&
      typeof body === "object" &&
      typeof (body as Record<string, unknown>).duplicateFromId === "string"
        ? (body as Record<string, string>).duplicateFromId
        : undefined;

    const project = duplicateFromId
      ? await projectService.duplicateProject(
          user.id,
          duplicateFromId,
          input.name
        )
      : await projectService.createProject(user.id, input);

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
