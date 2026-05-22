import { NextResponse } from "next/server";
import { getAuthenticatedDbUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api/errors";
import { parseUpdateProjectBody } from "@/lib/api/validation";
import { toWebsiteData } from "@/lib/validation/schemas";
import { projectService } from "@/services/project.service";
import type { WebsiteData } from "@/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const user = await getAuthenticatedDbUser();
    const { id } = await params;
    const project = await projectService.getProject(id, user.id);
    return NextResponse.json({ project });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req: Request, context: RouteParams) {
  return PATCH(req, context);
}

export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const user = await getAuthenticatedDbUser();
    const { id } = await params;
    const body = await req.json().catch(() => null);
    const input = parseUpdateProjectBody(body);

    if (!input) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const recordVersion = Boolean(input.websiteJson);
    const updatePayload: {
      name?: string;
      description?: string | null;
      websiteJson?: WebsiteData;
    } = {};

    if (input.name) updatePayload.name = input.name;
    if (input.description !== undefined) {
      updatePayload.description = input.description;
    }
    if (input.websiteJson) {
      updatePayload.websiteJson = toWebsiteData(
        input.websiteJson as Parameters<typeof toWebsiteData>[0]
      );
    }

    const project = await projectService.updateProject(
      id,
      user.id,
      updatePayload,
      { recordVersion }
    );

    return NextResponse.json({ project });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  try {
    const user = await getAuthenticatedDbUser();
    const { id } = await params;
    await projectService.deleteProject(id, user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
