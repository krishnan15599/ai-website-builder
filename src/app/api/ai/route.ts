import { NextResponse } from "next/server";
import { openai, LLM_MODEL } from "@/lib/ai/openai";
import { SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { getMockAIResponse, shouldUseMockAI } from "@/lib/ai/mockEngine";
import { cleanJsonString, validateAIResponse } from "@/lib/utils/helpers";
import { WebsiteData } from "@/types";

export async function POST(req: Request) {
  let currentWebsite: WebsiteData = { theme: "light", sections: [] };
  let message = "";

  try {
    const body = await req.json().catch(() => ({}));
    message = typeof body.message === "string" ? body.message : "";
    currentWebsite = body.currentWebsite || { theme: "light", sections: [] };

    if (!message) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 });
    }

    if (shouldUseMockAI()) {
      const mock = getMockAIResponse(message, currentWebsite);
      const validated = validateAIResponse(mock);
      return NextResponse.json(validated, { status: 200 });
    }

    const response = await openai.chat.completions.create({
      model: LLM_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Current Website JSON (edit this — do NOT regenerate from scratch):
${JSON.stringify(currentWebsite, null, 2)}

User Edit Request:
"${message}"

Return the complete updated website JSON according to the schema.`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.6,
    });

    const completionText = response.choices[0]?.message?.content;
    if (!completionText) throw new Error("Empty response received from the AI model");

    const cleanedText = cleanJsonString(completionText);
    const parsedResponse = JSON.parse(cleanedText);
    const validated = validateAIResponse(parsedResponse);

    return NextResponse.json(validated, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    console.error("Error in AI route:", error);

    return NextResponse.json(
      {
        chatResponse: `Failed to update your website: ${errorMessage}`,
        theme: currentWebsite.theme,
        sections: currentWebsite.sections,
      },
      { status: 500 }
    );
  }
}
