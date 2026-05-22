import { NextResponse } from "next/server";
import { getAuthenticatedDbUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api/errors";
import { parseJsonRequest } from "@/lib/api/parse";
import { aiEditSchema, toWebsiteData } from "@/lib/validation/schemas";
import { aiService } from "@/services/ai.service";
import type { WebsiteData } from "@/types";

export async function POST(req: Request) {
  let currentWebsite: WebsiteData = { theme: "light", sections: [] };

  try {
    await getAuthenticatedDbUser();
    const parsed = await parseJsonRequest(req, aiEditSchema);
    if (parsed instanceof NextResponse) return parsed;

    const { message, currentWebsite: website } = parsed.data;
    currentWebsite = toWebsiteData(website);

    const result = await aiService.edit(message, currentWebsite);
    return NextResponse.json(result);
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AuthError") {
      return handleApiError(error);
    }
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    console.error("Error in AI edit route:", error);

    return NextResponse.json(
      {
        chatResponse: `Failed to update your website: ${errorMessage}`,
        theme: currentWebsite.theme,
        sections: currentWebsite.sections,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
