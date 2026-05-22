import { NextResponse } from "next/server";
import { getAuthenticatedDbUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api/errors";
import { parseJsonRequest } from "@/lib/api/parse";
import { projectSettingsSchema } from "@/lib/validation/schemas";
import { projectSettingsService } from "@/services/project-settings.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const user = await getAuthenticatedDbUser();
    const { id } = await params;
    const settings = await projectSettingsService.getSettings(id, user.id);
    return NextResponse.json({ settings });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const user = await getAuthenticatedDbUser();
    const { id } = await params;
    const parsed = await parseJsonRequest(req, projectSettingsSchema);
    if (parsed instanceof NextResponse) return parsed;

    const settings = await projectSettingsService.updateSettings(
      id,
      user.id,
      parsed.data
    );
    return NextResponse.json({ settings });
  } catch (error) {
    return handleApiError(error);
  }
}
