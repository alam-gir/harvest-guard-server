import { ICropDefinition, IStageDefinition, IWeatherRule, LogicalPhase } from "../../models/CropDefinition";
import { ICropCycle, CropLifecycleStage } from "../../models/CropCycle";
import { LocalizedString } from "../../models/types/common";

export interface StageWeatherAdviceResult {
  stage?: IStageDefinition;
  matchedRules: IWeatherRule[];
  combinedAdvice?: LocalizedString;
}

export interface CurrentWeatherForRules {
  temperatureC?: number | null;
  humidityPercent?: number | null;
  rainProbabilityPercent?: number | null;
}

function mapStageToLogicalPhase(stage: CropLifecycleStage): LogicalPhase | undefined {
  switch (stage) {
    case "planted":
    case "growing":
      return "growing";
    case "pre_harvest":
      return "pre_harvest";
    case "harvested":
      return "harvest_window";
    case "stored":
    case "completed":
      return "post_harvest";
    case "planned":
    default:
      return undefined;
  }
}

function findActiveStage(
  cropDef: ICropDefinition,
  cropCycle: ICropCycle
): IStageDefinition | undefined {
  const phase = mapStageToLogicalPhase(cropCycle.stage);
  if (!phase) return undefined;

  const plantedAt = cropCycle.dates?.plantedAt || cropCycle.dates?.plannedPlantingAt;
  let daysFromPlanting: number | undefined;

  if (plantedAt) {
    const diffMs = Date.now() - new Date(plantedAt).getTime();
    daysFromPlanting = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }

  const candidates = (cropDef.stages || []).filter(
    (s) => s.logicalPhase === phase
  );

  if (!candidates.length) return undefined;

  if (typeof daysFromPlanting === "number") {
    const match = candidates.find(
      (s) =>
        daysFromPlanting! >= s.minDayFromPlanting &&
        daysFromPlanting! <= s.maxDayFromPlanting
    );
    if (match) return match;
  }

  // Fallback: first stage in that phase by order
  return candidates.sort((a, b) => a.order - b.order)[0];
}


function matchesWeatherRule(
  rule: IWeatherRule,
  weather: CurrentWeatherForRules
): boolean {
  const cond = rule.condition || {};

  const { temperatureC, humidityPercent, rainProbabilityPercent } = weather;

  if (typeof cond.minTempC === "number" && typeof temperatureC === "number") {
    if (temperatureC < cond.minTempC) return false;
  }
  if (typeof cond.maxTempC === "number" && typeof temperatureC === "number") {
    if (temperatureC > cond.maxTempC) return false;
  }

  if (typeof cond.minHumidity === "number" && typeof humidityPercent === "number") {
    if (humidityPercent < cond.minHumidity) return false;
  }
  if (typeof cond.maxHumidity === "number" && typeof humidityPercent === "number") {
    if (humidityPercent > cond.maxHumidity) return false;
  }

  if (
    typeof cond.minRainProb === "number" &&
    typeof rainProbabilityPercent === "number"
  ) {
    if (rainProbabilityPercent < cond.minRainProb) return false;
  }
  if (
    typeof cond.maxRainProb === "number" &&
    typeof rainProbabilityPercent === "number"
  ) {
    if (rainProbabilityPercent > cond.maxRainProb) return false;
  }

  // If no numeric field matched/checked, treat as generic rule (always applicable)
  return true;
}


function combineLocalizedAdvices(
  rules: IWeatherRule[]
): LocalizedString | undefined {
  if (!rules.length) return undefined;

  const bnParts: string[] = [];
  const enParts: string[] = [];

  for (const r of rules) {
    if (r.advice?.bn) bnParts.push(r.advice.bn);
    if (r.advice?.en) enParts.push(r.advice.en);
  }

  if (!bnParts.length && !enParts.length) return undefined;

  return {
    bn: bnParts.join(" "),
    en: enParts.join(" ")
  };
}


export function evaluateStageWeatherRules(
  cropDef: ICropDefinition,
  cropCycle: ICropCycle,
  weather: CurrentWeatherForRules
): StageWeatherAdviceResult {
  const stage = findActiveStage(cropDef, cropCycle);
  if (!stage || !stage.weatherRules?.length) {
    return { stage: undefined, matchedRules: [], combinedAdvice: undefined };
  }

  const matched = stage.weatherRules.filter((rule) =>
    matchesWeatherRule(rule, weather)
  );

  const combinedAdvice = combineLocalizedAdvices(matched);

  return {
    stage,
    matchedRules: matched,
    combinedAdvice
  };
}


