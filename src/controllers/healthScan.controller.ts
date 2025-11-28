import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendSuccess } from "../utils/sendResponse";
import { HealthScanService } from "../services/healthScan.service";
import { ApiError } from "../utils/ApiError";
import { HealthScanType } from "../models/HealthScan";

export const createHealthScanController = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.authUser) {
      throw ApiError.unauthorized("Not authenticated");
    }

    const { cropCycleId, scanType, farmerNotes } = req.body || {};
    const imageFile = req.file;

    if (!cropCycleId) {
      throw ApiError.badRequest("cropCycleId is required");
    }
    if (!scanType) {
      throw ApiError.badRequest("scanType is required");
    }
    if (!imageFile) {
      throw ApiError.badRequest("image file is required");
    }

    const scan = await HealthScanService.createHealthScan({
      farmerId: req.authUser.id,
      cropCycleId,
      scanType: scanType as HealthScanType,
      base64Image: imageFile.buffer.toString("base64"),
      mimeType: imageFile.mimetype,
      farmerNotes
    });

    return sendSuccess(res, 201, {
      success: true,
      message: "Health scan completed",
      data: scan
    });
  }
);

export const listHealthScansForCropController = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.authUser) {
      throw ApiError.unauthorized("Not authenticated");
    }

    const { cropCycleId } = req.params;
    if (!cropCycleId) {
      throw ApiError.badRequest("cropCycleId is required");
    }

    const scans = await HealthScanService.listByCropCycle(
      req.authUser.id,
      cropCycleId
    );

    return sendSuccess(res, 200, {
      success: true,
      message: "Health scans fetched",
      data: scans
    });
  }
);

export const listHealthScansForFarmerController = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.authUser) {
      throw ApiError.unauthorized("Not authenticated");
    }

    const scans = await HealthScanService.listByFarmer(req.authUser.id);

    return sendSuccess(res, 200, {
      success: true,
      message: "All health scans fetched",
      data: scans
    });
  }
);
