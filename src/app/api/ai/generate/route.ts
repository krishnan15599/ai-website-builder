import { NextResponse } from "next/server";
import { getAuthenticatedDbUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api/errors";
import { parseJsonRequest } from "@/lib/api/parse";
import { aiGenerateSchema } from "@/lib/validation/schemas";
import { aiService } from "@/services/ai.service";
import type { WebsiteData } from "@/types";

export async function POST(req: Request) {
  let fallback: WebsiteData = { theme: "light", sections: [] };

  try {
    await getAuthenticatedDbUser();
    const parsed = await parseJsonRequest(req, aiGenerateSchema);
    if (parsed instanceof NextResponse) return parsed;

    const { message, theme } = parsed.data;
    fallback = { theme: theme ?? "light", sections: [] };

    const result = await aiService.generate(message, theme);
    return NextResponse.json(result);
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AuthError") {
      return handleApiError(error);
    }
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    console.error("Error in AI generate route:", error);

    return NextResponse.json(
      {
        chatResponse: `Failed to generate your website: ${errorMessage}`,
        theme: fallback.theme,
        sections: fallback.sections,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
