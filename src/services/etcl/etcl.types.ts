import { LocalizedString } from "../../models/types/common";
import { RiskLevel } from "../../models/RiskSnapshot"; // or re-type "low" | "medium" | "high" | "critical"

export interface EtclContext {
  cropName: LocalizedString;

  idealHumidity: number;
  badHumidity: number;
  idealTemperature: number;
  badTemperature: number;
  sensitiveToRain: boolean;

  currentMoisturePercent?: number;
  temperatureC?: number | null;
  humidityPercent?: number | null;
  rainProbabilityPercent?: number | null;
}

export interface EtclComputationResult {
  etclHours: number | null;
  riskLevel: RiskLevel;
  riskType: string;
  summary: LocalizedString;
}
