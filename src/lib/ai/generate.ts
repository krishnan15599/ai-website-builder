import { openai, LLM_MODEL } from "@/lib/ai/openai";
import { GENERATE_SYSTEM_PROMPT, SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { getMockAIResponse, shouldUseMockAI } from "@/lib/ai/mockEngine";
import { DEFAULT_WEBSITE } from "@/lib/website/defaults";
import { cleanJsonString, validateAIResponse } from "@/lib/utils/helpers";
import type { AIResponse, WebsiteData, WebsiteTheme } from "@/types";

async function callAI(
  systemPrompt: string,
  userContent: string
): Promise<AIResponse> {
  const response = await openai.chat.completions.create({
    model: LLM_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ],
    response_format: { type: "json_object" },
    temperature: 0.6,
  });

  const completionText = response.choices[0]?.message?.content;
  if (!completionText) {
    throw new Error("Empty response received from the AI model");
  }

  const cleanedText = cleanJsonString(completionText);
  const parsedResponse = JSON.parse(cleanedText) as unknown;
  return validateAIResponse(parsedResponse);
}

export async function generateWebsiteFromScratch(
  message: string,
  preferredTheme?: WebsiteTheme
): Promise<AIResponse> {
  const theme = preferredTheme ?? "light";

  if (shouldUseMockAI()) {
    const mock = getMockAIResponse(message, DEFAULT_WEBSITE);
    return validateAIResponse({ ...mock, theme: mock.theme ?? theme });
  }

  return callAI(
    GENERATE_SYSTEM_PROMPT,
    `Preferred theme: ${theme}

User Request:
"${message}"

Return a complete new website JSON according to the schema.`
  );
}

export async function generateWebsiteEdit(
  message: string,
  currentWebsite: WebsiteData
): Promise<AIResponse> {
  if (shouldUseMockAI()) {
    const mock = getMockAIResponse(message, currentWebsite);
    return validateAIResponse(mock);
  }

  return callAI(
    SYSTEM_PROMPT,
    `Current Website JSON (edit this — do NOT regenerate from scratch):
${JSON.stringify(currentWebsite, null, 2)}

User Edit Request:
"${message}"

Return the complete updated website JSON according to the schema.`
  );
}
