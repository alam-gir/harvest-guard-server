import { Types } from "mongoose";
import { CropCycle, CropLifecycleStage, ICropCycle } from "../models/CropCycle";
import { CropDefinition } from "../models/CropDefinition";
import { ApiError } from "../utils/ApiError";
import { CreateCropCycleInput, UpdateStageInput } from "../models/types/cropCycle.types";
import { Farmer } from "../models/Farmer";
import { LocalizedString } from "../models/types/common";

export class CropCycleService {
  // Create a new crop cycle for a farmer
  static async createCropCycle(input: CreateCropCycleInput): Promise<ICropCycle> {
    const {
      farmerId,
      cropDefinitionCode,
      varietyName,
      fieldName,
      fieldAreaDecimal,
      startMode,
      startDate
    } = input;

    if (!cropDefinitionCode) {
      throw ApiError.badRequest("cropDefinitionCode is required");
    }

    const cropDef = await CropDefinition.findOne({
      code: cropDefinitionCode,
      isActive: true
    });

    if (!cropDef) {
      throw ApiError.badRequest("Invalid cropDefinitionCode");
    }

    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      throw ApiError.badRequest("Farmer not found!");
    }
    
    const now = new Date();
    const parsedStartDate = startDate ? new Date(startDate) : now;

    let stage: CropLifecycleStage = "planned";
    const dates: Partial<ICropCycle["dates"]> = {};

    if (startMode === "planned") {
      stage = "planned";
      dates.plannedPlantingAt = parsedStartDate;
    } else if (startMode === "planted") {
      stage = "planted";
      dates.plantedAt = parsedStartDate;
    } else if (startMode === "harvested") {
      stage = "harvested";
      dates.harvestedAt = parsedStartDate;
    } else if (startMode === "stored") {
      stage = "stored";
      dates.storageStartedAt = parsedStartDate;
    } else {
      throw ApiError.badRequest("Invalid startMode");
    }

    let variety :LocalizedString | undefined = undefined;

    if(varietyName && cropDef.varieties?.length){
      variety = cropDef.varieties.filter(v => v.bn == varietyName || v.en == varietyName)[0]
    }

    const cropCycle = await CropCycle.create({
      farmer: farmer._id,
      cropDefinition: cropDef._id,
      variety: variety,
      fieldInfo: {
        name: fieldName,
        areaDecimal: fieldAreaDecimal
      },
      dates,
      stage,
      riskSummary: {
        currentRiskLevel: "low"
      }
    });
    
    return cropCycle;
  }

  // List farmer's crops, with optional stage filter
  static async listFarmerCrops(
    farmerId: string,
    options?: { includeCompleted?: boolean }
  ): Promise<ICropCycle[]> {
    const query: any = {
      farmer: new Types.ObjectId(farmerId)
    };

    if (!options?.includeCompleted) {
      // Filter out completed cycles by default
      query.stage = { $ne: "completed" };
    }

    return CropCycle.find(query)
      .populate("cropDefinition")
      .sort({ "dates.plantedAt": -1, createdAt: -1 })
      .lean();
  }

  static async getCropCycleById(
    farmerId: string,
    cropCycleId: string
  ): Promise<ICropCycle> {
    const cropCycle = await CropCycle.findOne({
      _id: cropCycleId,
      farmer: farmerId
    }).populate("cropDefinition");

    if (!cropCycle) {
      throw ApiError.notFound("Crop not found for this farmer");
    }

    return cropCycle;
  }

  static async updateStage(input: UpdateStageInput): Promise<ICropCycle> {
    const { farmerId, cropCycleId, newStage, date } = input;

    const cropCycle = await CropCycle.findOne({
      _id: cropCycleId,
      farmer: farmerId
    });

    if (!cropCycle) {
      throw ApiError.notFound("Crop not found");
    }

    const now = new Date();
    const effectiveDate = date ? new Date(date) : now;

    switch (newStage) {
      case "planted":
        cropCycle.stage = "planted";
        cropCycle.dates.plantedAt = effectiveDate;
        break;
      case "harvested":
        cropCycle.stage = "harvested";
        cropCycle.dates.harvestedAt = effectiveDate;
        break;
      case "stored":
        cropCycle.stage = "stored";
        cropCycle.dates.storageStartedAt = effectiveDate;
        break;
      case "completed":
        cropCycle.stage = "completed";
        cropCycle.dates.storageEndAt = effectiveDate;
        break;
      default:
        throw ApiError.badRequest("Unsupported stage transition");
    }

    await cropCycle.save();
    await cropCycle.populate("cropDefinition");

    return cropCycle;
  }
}
