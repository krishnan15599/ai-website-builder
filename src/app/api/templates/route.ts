import { NextResponse } from "next/server";
import { getAuthenticatedDbUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api/errors";
import { templateService } from "@/services/template.service";

export async function GET(req: Request) {
  try {
    await getAuthenticatedDbUser();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") ?? undefined;
    const templates = await templateService.listTemplates(
      category ?? undefined
    );
    return NextResponse.json({ templates });
  } catch (error) {
    return handleApiError(error);
  }
}
