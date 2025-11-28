import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendSuccess } from "../utils/sendResponse";
import { CropCycleService } from "../services/cropCycle.service";
import { ApiError } from "../utils/ApiError";
import { TypedRequestBody } from "../models/types/requests";
import { CropLifecycleStage } from "../models/CropCycle";

export const createCropCycleController = catchAsync(
  async (req: TypedRequestBody<{
    cropDefinitionCode: string;
    varietyName?: string;
    fieldName?: string;
    fieldAreaDecimal?: number;
    startMode: CropLifecycleStage;
    startDate?: string;
  }>, res: Response) => {
    if (!req.authUser) {
      throw ApiError.unauthorized("Not authenticated");
    }

    const { cropDefinitionCode, varietyName, fieldName, fieldAreaDecimal, startMode, startDate } =
      req.body || {};

    // Very light backend checks (frontend should validate more)
    if (!cropDefinitionCode) {
      throw ApiError.badRequest("cropDefinitionCode is required");
    }
    if (!startMode || ![
        "planned",
        "planted",
        "growing",
        "pre_harvest",
        "harvested",
        "stored",
        "completed"
      ].includes(startMode)) {
      throw ApiError.badRequest("startMode must be 'planned' ,'planted', 'growing', 'pre_harvest', 'harvested', 'stored' or 'completed'");
    }

    const cropCycle = await CropCycleService.createCropCycle({
      farmerId: req.authUser.id,
      cropDefinitionCode,
      varietyName,
      fieldName,
      fieldAreaDecimal,
      startMode,
      startDate
    });

    return sendSuccess(res, 201, {
      success: true,
      message: "Crop added successfully",
      data: cropCycle
    });
  }
);

export const listFarmerCropsController = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.authUser) {
      throw ApiError.unauthorized("Not authenticated");
    }

    const includeCompleted = req.query.includeCompleted === "true";

    const crops = await CropCycleService.listFarmerCrops(req.authUser.id, {
      includeCompleted
    });

    return sendSuccess(res, 200, {
      success: true,
      message: "Crops fetched successfully",
      data: crops
    });
  }
);

export const getCropCycleController = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.authUser) {
      throw ApiError.unauthorized("Not authenticated");
    }

    const { id } = req.params;
    if (!id) {
      throw ApiError.badRequest("Crop id is required");
    }

    const crop = await CropCycleService.getCropCycleById(req.authUser.id, id);

    return sendSuccess(res, 200, {
      success: true,
      message: "Crop fetched successfully",
      data: crop
    });
  }
);

export const updateCropStageController = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.authUser) {
      throw ApiError.unauthorized("Not authenticated");
    }

    const { id } = req.params;
    const { newStage, date } = req.body || {};

    if (!id) {
      throw ApiError.badRequest("Crop id is required");
    }
    if (!newStage || ![
        "planned",
        "planted",
        "growing",
        "pre_harvest",
        "harvested",
        "stored",
        "completed"
      ].includes(newStage)) {
      throw ApiError.badRequest(
        "newStage must be 'planned' ,'planted', 'growing', 'pre_harvest', 'harvested', 'stored' or 'completed'"
      );
    }

    const crop = await CropCycleService.updateStage({
      farmerId: req.authUser.id,
      cropCycleId: id,
      newStage,
      date
    });

    return sendSuccess(res, 200, {
      success: true,
      message: "Crop stage updated successfully",
      data: crop
    });
  }
);
