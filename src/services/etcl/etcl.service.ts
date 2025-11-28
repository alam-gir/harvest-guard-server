// src/services/etcl/etcl.service.ts
import { Types } from "mongoose";
import { Farmer } from "../../models/Farmer";
import { CropCycle, ICropCycle } from "../../models/CropCycle";
import { RiskSnapshot } from "../../models/RiskSnapshot";
import { ApiError } from "../../utils/ApiError";
import { LocalizedString } from "../../models/types/common";
import { getWeatherClient } from "../weather";
import { computeEtcl } from "./etclLogic";
import { EtclContext, EtclComputationResult } from "./etcl.types";
import { NotificationService } from "../notification/notification.service";
import { evaluateStageWeatherRules } from "./stageWeatherRules";
import { ICropDefinition } from "../../models/CropDefinition";

const ls = (bn: string, en: string): LocalizedString => ({ bn, en });

export interface ComputeEtclInput {
  farmerId: string;
  cropCycleId: string;
  source: "scheduled_job" | "on_demand" | "weather_update";

  latitude: number;
  longitude: number;

  currentMoisturePercent?: number;
}

export interface EtclServiceResponse {
  snapshotId: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  riskType: string;
  etclHours: number | null;
  summary: LocalizedString;
}

export class EtclService {
  static async computeForCropCycle(
    input: ComputeEtclInput
  ): Promise<EtclServiceResponse> {
    const {
      farmerId,
      cropCycleId,
      source,
      latitude,
      longitude,
      currentMoisturePercent
    } = input;

    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      throw ApiError.badRequest("Farmer not found");
    }

    const cropCycle = await CropCycle.findOne({
      _id: new Types.ObjectId(cropCycleId),
      farmer: new Types.ObjectId(farmerId)
    }).populate("cropDefinition");

    if (!cropCycle) {
      throw ApiError.notFound("Crop not found for this farmer");
    }

    const cropDef = cropCycle.cropDefinition as ICropDefinition | null;
    if (!cropDef || !cropDef.storageProfile) {
      throw ApiError.badRequest("Storage profile missing for this crop");
    }

    const storageProfile = cropDef.storageProfile;

    const cropName: LocalizedString = {
      bn: cropDef.name?.bn || "",
      en: cropDef.name?.en || ""
    };

    const weatherClient = getWeatherClient();
    const weather = await weatherClient.getCurrentWeather({ latitude, longitude });

    const effectiveMoisture =
      typeof currentMoisturePercent === "number"
        ? currentMoisturePercent
        : cropCycle.batchInfo?.currentMoisturePercent;

    const ctx: EtclContext = {
      cropName,
      idealHumidity: storageProfile.idealHumidity,
      badHumidity: storageProfile.badHumidity,
      idealTemperature: storageProfile.idealTemperature,
      badTemperature: storageProfile.badTemperature,
      sensitiveToRain: storageProfile.sensitiveToRain,

      currentMoisturePercent: effectiveMoisture,
      temperatureC: weather.temperatureC,
      humidityPercent: weather.humidityPercent,
      rainProbabilityPercent: weather.rainProbabilityPercent
    };

    // 1) Core ETCL calculation
    const comp: EtclComputationResult = computeEtcl(ctx, {
      highHumidityTemplate: storageProfile.highHumidityMessageTemplate,
      highTemperatureTemplate: storageProfile.highTemperatureMessageTemplate
    });

    // 2) Stage-specific weather rules
    const stageAdvice = evaluateStageWeatherRules(
      cropDef,
      cropCycle as ICropCycle,
      {
        temperatureC: weather.temperatureC,
        humidityPercent: weather.humidityPercent,
        rainProbabilityPercent: weather.rainProbabilityPercent
      }
    );

    // 3) Merge ETCL summary + stage-specific advice
    const summaryBnParts: string[] = [comp.summary.bn ?? ""];
    const summaryEnParts: string[] = [comp.summary.en ?? ""];

    if (stageAdvice.combinedAdvice?.bn) {
      summaryBnParts.push(stageAdvice.combinedAdvice.bn);
    }
    if (stageAdvice.combinedAdvice?.en) {
      summaryEnParts.push(stageAdvice.combinedAdvice.en);
    }

    const finalSummary: LocalizedString = {
      bn: summaryBnParts.join(" "),
      en: summaryEnParts.join(" ")
    };

    // 4) Persist RiskSnapshot
    const snapshot = await RiskSnapshot.create({
      cropCycle: cropCycle._id,
      farmer: cropCycle.farmer._id,
      source,
      etclHours: comp.etclHours ?? undefined,
      riskLevel: comp.riskLevel,
      riskType: comp.riskType,
      summary: finalSummary,
      inputs: {
        temperatureC: weather.temperatureC ?? undefined,
        humidityPercent: weather.humidityPercent ?? undefined,
        rainProbabilityPercent: weather.rainProbabilityPercent ?? undefined,
        storageType: cropCycle.batchInfo?.storageType,
        currentMoisturePercent: effectiveMoisture
      }
    });

    // 5) Update CropCycle.riskSummary
    cropCycle.riskSummary = {
      currentRiskLevel: comp.riskLevel,
      lastETCLHours: comp.etclHours ?? undefined,
      lastRiskReason:
        farmer.preferredLanguage === "en"
          ? finalSummary.en
          : finalSummary.bn,
      lastUpdatedAt: new Date()
    };

    await cropCycle.save();

    // 6) Notifications
    // Risk alerts (same as before)
    if (comp.riskLevel === "high" || comp.riskLevel === "critical") {
      const title: LocalizedString =
        comp.riskLevel === "critical"
          ? ls(
              "জরুরি ঝুঁকি: ফসল দ্রুত নষ্ট হওয়ার সম্ভাবনা",
              "Critical risk: high chance of rapid spoilage"
            )
          : ls(
              "উচ্চ ঝুঁকি: সংরক্ষণ অবস্থা দ্রুত পরীক্ষা করুন",
              "High risk: check storage conditions soon"
            );

      await NotificationService.createRiskAlert({
        farmerId: farmer._id,
        cropCycleId: cropCycle._id,
        title,
        body: finalSummary
      });
    }

    // Optional: if we have stage weather advice but risk is not high/critical,
    // later we can add a NotificationType.weather_advisory here.
    // For now we just keep it attached in summary.

    return {
      snapshotId: snapshot._id.toString(),
      riskLevel: comp.riskLevel,
      riskType: comp.riskType,
      etclHours: comp.etclHours,
      summary: finalSummary
    };
  }
}
