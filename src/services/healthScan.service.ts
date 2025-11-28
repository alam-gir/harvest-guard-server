import { Types } from "mongoose";
import { HealthScan, HealthScanType, IHealthScan } from "../models/HealthScan";
import { CropCycle } from "../models/CropCycle";
import { Farmer } from "../models/Farmer";
import { ApiError } from "../utils/ApiError";
import { getAiClient } from "./ai";
import { LocalizedString, LocalizedStringArray } from "../models/types/common";
import { ICropDefinition } from "../models/CropDefinition";
import { uploadFile } from "./storage/r2.client";

export interface CreateHealthScanInput {
  farmerId: string;
  cropCycleId: string;
  scanType: HealthScanType;
  base64Image: string;
  mimeType: string;
  farmerNotes?: string; 
}

const ls = (bn: string, en: string): LocalizedString => ({ bn, en });

export class HealthScanService {
  static async createHealthScan(input: CreateHealthScanInput): Promise<IHealthScan> {
    const { farmerId, cropCycleId, scanType, base64Image, mimeType, farmerNotes } = input;

    if (!base64Image) {
      throw ApiError.badRequest("image is required");
    }

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

    const cropDef = cropCycle.cropDefinition as ICropDefinition;
    const baseNameBn: string = cropDef?.name?.bn || "";
    const baseNameEn: string = cropDef?.name?.en || "";

    const varietyBn = (cropCycle as any).variety?.bn;
    const varietyEn = (cropCycle as any).variety?.en;

    const cropNameBn = [baseNameBn, varietyBn].filter(Boolean).join(" - ");
    const cropNameEn = [baseNameEn, varietyEn].filter(Boolean).join(" - ");

    // Stage display names from definition if possible
    const stageKey = cropCycle.stage; // "planned" | "planted" | "harvested" | ...
    const matchingStage = cropDef?.stages?.find((s: any) => s.key === stageKey);
    const stageNameBn: string | undefined = matchingStage?.name?.bn;
    const stageNameEn: string | undefined = matchingStage?.name?.en;

    // Determine locale preference
    const locale: "bn" | "en" =
      farmer.preferredLanguage === "en" ? "en" : "bn";

    const aiClient = getAiClient();

    // Perform AI scan and R2 upload concurrently
    const [aiResult, imageUrl] = await Promise.all([
      aiClient.analyzeHealthScan({
        cropName: locale === "bn" ? cropNameBn || cropNameEn : cropNameEn || cropNameBn,
        stageKey,
        stageNameBn,
        stageNameEn,
        scanType,
        base64Image,
        mimeType,
        farmerNotesBn: farmerNotes,
        locale
      }),
      uploadFile({
        buffer: Buffer.from(base64Image, "base64"),
        mimetype: mimeType,
        folder: "health-scans"
      })
    ]);

    const doc: Partial<IHealthScan> = {
      cropCycle: cropCycle._id,
      farmer: farmer._id,
      scanType,
      imageUrl,
      aiLabel: aiResult.label,
      confidence: aiResult.confidence,
      aiSummary: aiResult.summary,
      recommendedActions: aiResult.recommendedActions,
      meta: {
        modelName: aiResult.modelName,
        modelVersion: aiResult.modelVersion,
        latencyMs: aiResult.latencyMs
      }
    };

    const scan = await HealthScan.create(doc as IHealthScan);
    return scan;
  }

  static async listByCropCycle(
    farmerId: string,
    cropCycleId: string
  ): Promise<IHealthScan[]> {
    const scans = await HealthScan.find({
      farmer: new Types.ObjectId(farmerId),
      cropCycle: new Types.ObjectId(cropCycleId)
    })
      .sort({ createdAt: -1 })
      .lean();

    return scans;
  }

  static async listByFarmer(farmerId: string): Promise<IHealthScan[]> {
    const scans = await HealthScan.find({
      farmer: new Types.ObjectId(farmerId)
    })
      .sort({ createdAt: -1 })
      .lean();

    return scans;
  }
}
