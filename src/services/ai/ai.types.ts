import { HealthScanType } from "../../models/HealthScan";
import {
  LocalizedString,
  LocalizedStringArray
} from "../../models/types/common";

export type AiProviderName = "gemini" | "openai" | "custom";

export interface AiHealthScanRequest {
  cropName?: string; // e.g. "বোরো ধান - BRRI dhan-28"
  stageKey?: string; // our CropCycle.stage (planned/planted/harvested/...)
  stageNameBn?: string;
  stageNameEn?: string;

  scanType: HealthScanType; // "leaf" | "grain" | "other"
  base64Image: string;
  mimeType: string;
  farmerNotesBn?: string; // any free text from farmer
  locale: "bn" | "en"; // preferred explanation language
}

export interface AiHealthScanResult {
  label: LocalizedString; // disease / issue label
  confidence?: number; // 0–1
  summary: LocalizedString;
  recommendedActions: LocalizedStringArray;
  modelName?: string;
  modelVersion?: string;
  latencyMs?: number;
}
