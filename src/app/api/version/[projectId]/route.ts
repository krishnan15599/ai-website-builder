import { NextResponse } from "next/server";
import { getAuthenticatedDbUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api/errors";
import { versionService } from "@/services/version.service";

interface RouteParams {
  params: Promise<{ projectId: string }>;
}

export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const user = await getAuthenticatedDbUser();
    const { projectId } = await params;
    const versions = await versionService.listVersions(projectId, user.id);
    return NextResponse.json({ versions });
  } catch (error) {
    return handleApiError(error);
  }
}
