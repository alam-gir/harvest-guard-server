import { env } from "../../config/env";
import { AiClient } from "./aiClient";
import { GeminiAiClient } from "./geminiClient";

let aiClientInstance: AiClient | null = null;

export const getAiClient = (): AiClient => {
  if (aiClientInstance) return aiClientInstance;

  const apiKey = env.ai.geminiApiKey;

  aiClientInstance = new GeminiAiClient(apiKey);

  return aiClientInstance!;
};
