import { EtclContext, EtclComputationResult } from "./etcl.types";
import { LocalizedString } from "../../models/types/common";
import { renderLocalizedTemplate } from "../../utils/localizedTemplate";

const ls = (bn: string, en: string): LocalizedString => ({ bn, en });

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}

export function computeEtcl(
  ctx: EtclContext,
  options?: {
    highHumidityTemplate?: LocalizedString;
    highTemperatureTemplate?: LocalizedString;
  }
): EtclComputationResult {
  const {
    cropName,
    idealHumidity,
    badHumidity,
    idealTemperature,
    badTemperature,
    sensitiveToRain,
    currentMoisturePercent,
    temperatureC,
    humidityPercent,
    rainProbabilityPercent
  } = ctx;

  // Moisture / humidity stress
  let humidityStress = 0;
  if (
    typeof humidityPercent === "number" &&
    badHumidity > idealHumidity
  ) {
    const diff = humidityPercent - idealHumidity;
    const span = badHumidity - idealHumidity;
    humidityStress = clamp01(diff / span);
  }

  // Temperature stress
  let tempStress = 0;
  if (
    typeof temperatureC === "number" &&
    badTemperature > idealTemperature
  ) {
    const diff = temperatureC - idealTemperature;
    const span = badTemperature - idealTemperature;
    tempStress = clamp01(diff / span);
  }

  // Rain stress (if storage is sensitive to rain)
  let rainStress = 0;
  if (sensitiveToRain && typeof rainProbabilityPercent === "number") {
    rainStress = clamp01(rainProbabilityPercent / 100);
  }

  const maxStress = Math.max(humidityStress, tempStress, rainStress);

  // Map stress to risk buckets & ETCL hours
  let riskLevel: "low" | "medium" | "high" | "critical" = "low";
  let etclHours: number | null = 96; // base safe window (approx 4 days)

  if (maxStress <= 0.2) {
    riskLevel = "low";
    etclHours = 96;
  } else if (maxStress <= 0.5) {
    riskLevel = "medium";
    etclHours = 48;
  } else if (maxStress <= 0.8) {
    riskLevel = "high";
    etclHours = 24;
  } else {
    riskLevel = "critical";
    etclHours = 6;
  }

  // Decide riskType based on dominating factor
  let riskType = "Normal";

  if (maxStress === 0) {
    riskType = "Normal";
  } else if (humidityStress >= tempStress && humidityStress >= rainStress) {
    riskType = "High humidity";
  } else if (tempStress >= humidityStress && tempStress >= rainStress) {
    riskType = "High temperature";
  } else if (rainStress >= humidityStress && rainStress >= tempStress) {
    riskType = "High rain probability";
  } else {
    riskType = "Combined risk";
  }

// Format numbers for user-facing text
  const fmt1 = (v?: number | null) =>
    typeof v === "number" ? Number(v.toFixed(1)) : undefined;
  const fmt0 = (v?: number | null) =>
    typeof v === "number" ? Math.round(v) : undefined;

  const displayTemp = fmt1(temperatureC);
  const displayIdealTemp = fmt1(idealTemperature);
  const displayHumidity = fmt0(humidityPercent);
  const displayIdealHumidity = fmt0(idealHumidity);
  const displayMoisture = fmt1(currentMoisturePercent);

  const humidityMessage = renderLocalizedTemplate(
    options?.highHumidityTemplate,
    {
      // always give cropName
      cropName: cropName.bn || cropName.en || "ফসল",

      // both humidity-style placeholders
      currentHumidity: displayHumidity ?? "–",
      idealHumidity: displayIdealHumidity ?? idealHumidity,

      // both moisture-style placeholders
      currentMoisture: displayMoisture ?? "–",
      idealMoisture: displayIdealHumidity ?? idealHumidity
    }
  );

  const tempMessage = renderLocalizedTemplate(
    options?.highTemperatureTemplate,
    {
      cropName: cropName.bn || cropName.en || "ফসল",
      currentTemp: displayTemp ?? "–",
      idealTemp: displayIdealTemp ?? idealTemperature
    }
  );

  const bnParts: string[] = [];
  const enParts: string[] = [];

  if (humidityMessage?.bn) bnParts.push(humidityMessage.bn);
  if (tempMessage?.bn) bnParts.push(tempMessage.bn);

  if (humidityMessage?.en) enParts.push(humidityMessage.en);
  if (tempMessage?.en) enParts.push(tempMessage.en);

  // Add generic fallback
  if (!bnParts.length) {
    if (riskLevel === "low") {
      bnParts.push(
        "বর্তমান তাপমাত্রা ও আর্দ্রতায় সংরক্ষণের ঝুঁকি কম। তবে নিয়মিত বাতাস চলাচল ও পরিষ্কার-পরিচ্ছন্নতা ঠিক রাখুন।"
      );
    } else {
      bnParts.push(
        "বর্তমান তাপমাত্রা ও আর্দ্রতায় ফসল নষ্ট হওয়ার ঝুঁকি বাড়তে পারে। যত দ্রুত সম্ভব গুদাম ও সংরক্ষণ ব্যবস্থা পরীক্ষা করুন।"
      );
    }
  }

  if (!enParts.length) {
    if (riskLevel === "low") {
      enParts.push(
        "At the current temperature and humidity, storage risk is low. Keep ventilation and cleanliness in good condition."
      );
    } else {
      enParts.push(
        "At the current temperature and humidity, the risk of spoilage may increase. Please check your storage conditions soon."
      );
    }
  }

  // Add ETCL info to summary
  if (etclHours !== null) {
    bnParts.push(
      `এই অবস্থায় আনুমানিক ${etclHours} ঘণ্টার মধ্যে উল্লেখযোগ্য ক্ষতি শুরু হতে পারে।`
    );
    enParts.push(
      `In this condition, significant losses may start in approximately ${etclHours} hours.`
    );
  } else {
    bnParts.push(
      "পর্যাপ্ত তথ্য না থাকায় সঠিক সময় অনুমান করা যায়নি। সংরক্ষণ ব্যবস্থা নিয়মিত নজরে রাখুন।"
    );
    enParts.push(
      "Due to limited data, we cannot estimate the exact time to damage. Please monitor your storage frequently."
    );
  }

  const summary: LocalizedString = {
    bn: bnParts.join(" "),
    en: enParts.join(" ")
  };

  return {
    etclHours,
    riskLevel,
    riskType,
    summary
  };
}
