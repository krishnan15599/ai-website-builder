import { NextResponse } from "next/server";
import { getAuthenticatedDbUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api/errors";
import { parseJsonRequest } from "@/lib/api/parse";
import { versionRestoreSchema } from "@/lib/validation/schemas";
import { versionService } from "@/services/version.service";

interface RouteParams {
  params: Promise<{ projectId: string }>;
}

export async function POST(req: Request, { params }: RouteParams) {
  try {
    const user = await getAuthenticatedDbUser();
    const { projectId } = await params;
    const parsed = await parseJsonRequest(req, versionRestoreSchema);
    if (parsed instanceof NextResponse) return parsed;

    const { project, version } = await versionService.restoreVersion(
      projectId,
      user.id,
      parsed.data.versionId
    );

    return NextResponse.json({
      success: true,
      project,
      restoredFrom: version,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
