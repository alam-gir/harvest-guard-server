import { GoogleGenerativeAI } from "@google/generative-ai";
import { AiClient } from "./aiClient";
import { AiHealthScanRequest, AiHealthScanResult } from "./ai.types";

const MODEL_NAME = "gemini-2.5-flash"; 

export class GeminiAiClient implements AiClient {
  provider: "gemini" = "gemini";
  private model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]>;

  constructor(apiKey: string) {
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: MODEL_NAME });
  }

  async analyzeHealthScan(input: AiHealthScanRequest): Promise<AiHealthScanResult> {
    const start = Date.now();

    const systemPrompt = `
You are an agricultural assistant for smallholder farmers in Bangladesh.
You see crop images (leaf/grain/other) and must:

1) Identify the most likely problem in two languages: a short English label and a short, simple Bangla label.
2) Rate your confidence (0–1).
3) Explain the problem in simple Bangla and simple English (2–3 sentences).
4) Suggest 3–5 easy, low-cost action steps:
   - In Bangla (simple village language)
   - In English (simple and clear)
5) If you are not sure, clearly say that the farmer should consult local agriculture office.

IMPORTANT:
- The farmer's main language is Bangla.
- Output MUST be valid JSON only, with this exact structure:

{
  "label": {
    "en": "short English label",
    "bn": "short Bangla label"
  },
  "confidence": 0.8,
  "summary": {
    "en": "2–3 sentences in English...",
    "bn": "2–3 sentences in Bangla..."
  },
  "recommendedActions": {
    "en": ["step 1 in English", "step 2 in English"],
    "bn": ["step 1 in Bangla", "step 2 in Bangla"]
  }
}
    `.trim();

    const userContext = `
Crop name: ${input.cropName || "Unknown"}
Stage key: ${input.stageKey || "Unknown"}
Stage (Bn): ${input.stageNameBn || "N/A"}
Stage (En): ${input.stageNameEn || "N/A"}
Scan type: ${input.scanType}
Farmer notes (Bangla): ${input.farmerNotesBn || "N/A"}
    `.trim();

    const imagePart = {
      inlineData: {
        data: input.base64Image,
        mimeType: input.mimeType
      }
    };

    const result = await this.model.generateContent([
      systemPrompt,
      userContext,
      imagePart
    ]);

    const text = result.response.text();
    let parsed: any;

    try {
      parsed = JSON.parse(text);
    } catch {
      // Best-effort fallback if model returns markdown/extra text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Gemini did not return valid JSON");
      }
      parsed = JSON.parse(jsonMatch[0]);
    }

    const latencyMs = Date.now() - start;

    const output: AiHealthScanResult = {
      label: parsed.label || { en: "Unknown Issue", bn: "অজানা সমস্যা" },
      confidence:
        typeof parsed.confidence === "number" ? parsed.confidence : undefined,
      summary: parsed.summary || {
        en: "Please consult your local agriculture office to better understand this problem.",
        bn: "সমস্যাটি ভালোভাবে বুঝতে স্থানীয় কৃষি অফিসের পরামর্শ নিন।"
      },
      recommendedActions: parsed.recommendedActions || {
        en: [
          "Inspect the affected area closely.",
          "If it spreads, consult your local agriculture officer."
        ],
        bn: [
          "আক্রান্ত পাতা কাছ থেকে দেখুন।",
          "সমস্যাটি বাড়লে নিকটস্থ কৃষি কর্মকর্তার পরামর্শ নিন।"
        ]
      },
      modelName: MODEL_NAME,
      modelVersion: result.response.candidates?.[0]?.safetyRatings
        ? MODEL_NAME
        : undefined,
      latencyMs
    };

    return output;
  }
}
