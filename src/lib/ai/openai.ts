import OpenAI from "openai";

function isValidKey(key?: string): boolean {
  const k = key?.trim();
  return !!k && k !== "sk-your-key-here" && !k.includes("your-key-here");
}

const openRouterKey = process.env.OPENROUTER_API_KEY?.trim();
const openaiKey = process.env.OPENAI_API_KEY?.trim();
const useOpenRouter = isValidKey(openRouterKey);

const apiKey = useOpenRouter
  ? openRouterKey
  : isValidKey(openaiKey)
    ? openaiKey
    : undefined;

export const openai = new OpenAI({
  apiKey: apiKey || "placeholder-key-for-build",
  baseURL: useOpenRouter
    ? process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1"
    : undefined,
  defaultHeaders: useOpenRouter
    ? {
        "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "http://localhost:3000",
        "X-Title": process.env.OPENROUTER_APP_NAME || "Aetheria Website Builder",
      }
    : undefined,
});

export const LLM_MODEL =
  process.env.OPENROUTER_MODEL ||
  process.env.OPENAI_MODEL ||
  (useOpenRouter ? "openai/gpt-4o-mini" : "gpt-4o-mini");

export function hasLLMConfigured(): boolean {
  return !!apiKey;
}
