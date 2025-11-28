import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendSuccess } from "../utils/sendResponse";
import { ApiError } from "../utils/ApiError";
import { EtclService } from "../services/etcl/etcl.service";

export const computeEtclController = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.authUser) {
      throw ApiError.unauthorized("Not authenticated");
    }

    const { cropCycleId } = req.params;
    const { latitude, longitude, currentMoisturePercent, source } = req.body || {};

    if (!cropCycleId) {
      throw ApiError.badRequest("cropCycleId is required");
    }
    if (typeof latitude !== "number" || typeof longitude !== "number") {
      throw ApiError.badRequest("latitude and longitude are required as numbers");
    }

    const riskSource =
      source === "weather_update" || source === "scheduled_job"
        ? source
        : "on_demand";

    const result = await EtclService.computeForCropCycle({
      farmerId: req.authUser.id,
      cropCycleId,
      source: riskSource,
      latitude,
      longitude,
      currentMoisturePercent:
        typeof currentMoisturePercent === "number"
          ? currentMoisturePercent
          : undefined
    });

    return sendSuccess(res, 200, {
      success: true,
      message: "ETCL computed successfully",
      data: result
    });
  }
);
