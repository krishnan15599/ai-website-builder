import { NextResponse } from "next/server";
import { getAuthenticatedDbUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api/errors";
import { parseJsonRequest } from "@/lib/api/parse";
import { toWebsiteData, versionCreateSchema } from "@/lib/validation/schemas";
import { versionService } from "@/services/version.service";

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedDbUser();
    const parsed = await parseJsonRequest(req, versionCreateSchema);
    if (parsed instanceof NextResponse) return parsed;

    const version = await versionService.createVersion(
      parsed.data.projectId,
      user.id,
      toWebsiteData(parsed.data.websiteJson)
    );

    return NextResponse.json(
      { success: true, versionId: version.id, version },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
