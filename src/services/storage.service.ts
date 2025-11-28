// src/services/storage.service.ts
import { Types } from "mongoose";
import { CropCycle, ICropCycle } from "../models/CropCycle";
import { Farmer } from "../models/Farmer";
import { ApiError } from "../utils/ApiError";
import {
  StartStorageInput,
  UpdateStorageInput,
  CompleteStorageInput
} from "../models/types/cropCycle.types";

export class StorageService {
  static async startStorage(input: StartStorageInput): Promise<ICropCycle> {
    const {
      farmerId,
      cropCycleId,
      storageType,
      storageLocation,
      estimatedWeightKg,
      currentMoisturePercent,
      storageStartedAt
    } = input;

    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      throw ApiError.badRequest("Farmer not found");
    }

    const cropCycle = await CropCycle.findOne({
      _id: new Types.ObjectId(cropCycleId),
      farmer: new Types.ObjectId(farmerId)
    });

    if (!cropCycle) {
      throw ApiError.notFound("Crop not found for this farmer");
    }

    // Only allow starting storage from harvested / pre_harvest
    if (
      cropCycle.stage !== "harvested" &&
      cropCycle.stage !== "pre_harvest" &&
      cropCycle.stage !== "stored"
    ) {
      throw ApiError.badRequest(
        "Storage can only be started from harvested or pre-harvest stage"
      );
    }

    const startDate = storageStartedAt ? new Date(storageStartedAt) : new Date();

    cropCycle.stage = "stored";
    cropCycle.dates.storageStartedAt = startDate;

    // Initialize or update batchInfo
    cropCycle.batchInfo = {
      ...(cropCycle.batchInfo || {}),
      storageType,
      storageLocation: {
        ...(cropCycle.batchInfo?.storageLocation || {}),
        ...(storageLocation || {})
      },
      estimatedWeightKg:
        typeof estimatedWeightKg === "number"
          ? estimatedWeightKg
          : cropCycle.batchInfo?.estimatedWeightKg,
      currentMoisturePercent:
        typeof currentMoisturePercent === "number"
          ? currentMoisturePercent
          : cropCycle.batchInfo?.currentMoisturePercent
    };

    await cropCycle.save();
    await cropCycle.populate("cropDefinition");

    return cropCycle;
  }

  static async updateStorage(input: UpdateStorageInput): Promise<ICropCycle> {
    const {
      farmerId,
      cropCycleId,
      storageType,
      storageLocation,
      estimatedWeightKg,
      currentMoisturePercent
    } = input;

    const cropCycle = await CropCycle.findOne({
      _id: new Types.ObjectId(cropCycleId),
      farmer: new Types.ObjectId(farmerId)
    });

    if (!cropCycle) {
      throw ApiError.notFound("Crop not found for this farmer");
    }

    if (cropCycle.stage !== "stored") {
      throw ApiError.badRequest("Storage details can only be updated in stored stage");
    }

    cropCycle.batchInfo = {
      ...(cropCycle.batchInfo || {}),
      storageType: storageType ?? cropCycle.batchInfo?.storageType,
      storageLocation: {
        ...(cropCycle.batchInfo?.storageLocation || {}),
        ...(storageLocation || {})
      },
      estimatedWeightKg:
        typeof estimatedWeightKg === "number"
          ? estimatedWeightKg
          : cropCycle.batchInfo?.estimatedWeightKg,
      currentMoisturePercent:
        typeof currentMoisturePercent === "number"
          ? currentMoisturePercent
          : cropCycle.batchInfo?.currentMoisturePercent
    };

    await cropCycle.save();
    await cropCycle.populate("cropDefinition");

    return cropCycle;
  }

  static async completeStorage(
    input: CompleteStorageInput
  ): Promise<ICropCycle> {
    const { farmerId, cropCycleId, finalWeightKg, storageEndAt } = input;

    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      throw ApiError.badRequest("Farmer not found");
    }

    const cropCycle = await CropCycle.findOne({
      _id: new Types.ObjectId(cropCycleId),
      farmer: new Types.ObjectId(farmerId)
    });

    if (!cropCycle) {
      throw ApiError.notFound("Crop not found for this farmer");
    }

    if (cropCycle.stage !== "stored") {
      throw ApiError.badRequest(
        "Storage can only be completed from stored stage"
      );
    }

    const endDate = storageEndAt ? new Date(storageEndAt) : new Date();

    cropCycle.stage = "completed";
    cropCycle.dates.storageEndAt = endDate;

    cropCycle.batchInfo = {
      ...(cropCycle.batchInfo || {}),
      finalWeightKg:
        typeof finalWeightKg === "number"
          ? finalWeightKg
          : cropCycle.batchInfo?.finalWeightKg
    };

    await cropCycle.save();
    await cropCycle.populate("cropDefinition");

    // Update farmer stats
    farmer.stats.totalBatchesStored = (farmer.stats.totalBatchesStored || 0) + 1;
    await farmer.save();

    return cropCycle;
  }
}
