// src/controllers/storage.controller.ts
import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendSuccess } from "../utils/sendResponse";
import { ApiError } from "../utils/ApiError";
import { StorageService } from "../services/storage.service";

export const startStorageController = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.authUser) {
      throw ApiError.unauthorized("Not authenticated");
    }

    const { cropCycleId } = req.params;
    const {
      storageType,
      storageLocation,
      estimatedWeightKg,
      currentMoisturePercent,
      storageStartedAt
    } = req.body || {};

    if (!cropCycleId) {
      throw ApiError.badRequest("cropCycleId is required");
    }
    if (!storageType) {
      throw ApiError.badRequest("storageType is required");
    }

    const crop = await StorageService.startStorage({
      farmerId: req.authUser.id,
      cropCycleId,
      storageType,
      storageLocation,
      estimatedWeightKg,
      currentMoisturePercent,
      storageStartedAt
    });

    return sendSuccess(res, 200, {
      success: true,
      message: "Storage started for crop",
      data: crop
    });
  }
);

export const updateStorageController = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.authUser) {
      throw ApiError.unauthorized("Not authenticated");
    }

    const { cropCycleId } = req.params;
    const {
      storageType,
      storageLocation,
      estimatedWeightKg,
      currentMoisturePercent
    } = req.body || {};

    if (!cropCycleId) {
      throw ApiError.badRequest("cropCycleId is required");
    }

    const crop = await StorageService.updateStorage({
      farmerId: req.authUser.id,
      cropCycleId,
      storageType,
      storageLocation,
      estimatedWeightKg,
      currentMoisturePercent
    });

    return sendSuccess(res, 200, {
      success: true,
      message: "Storage information updated",
      data: crop
    });
  }
);

export const completeStorageController = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.authUser) {
      throw ApiError.unauthorized("Not authenticated");
    }

    const { cropCycleId } = req.params;
    const { finalWeightKg, storageEndAt } = req.body || {};

    if (!cropCycleId) {
      throw ApiError.badRequest("cropCycleId is required");
    }

    const crop = await StorageService.completeStorage({
      farmerId: req.authUser.id,
      cropCycleId,
      finalWeightKg,
      storageEndAt
    });

    return sendSuccess(res, 200, {
      success: true,
      message: "Storage completed for crop",
      data: crop
    });
  }
);
