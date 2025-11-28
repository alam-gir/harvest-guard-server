// src/routes/cropCycle.routes.ts
import { Router } from "express";
import {
  createCropCycleController,
  listFarmerCropsController,
  getCropCycleController,
  updateCropStageController
} from "../controllers/cropCycle.controller";
import { requireAuth } from "../middlewares/requireAuth";

export const cropCycleRouter = Router();

// All endpoints require auth
cropCycleRouter.use(requireAuth);

// POST /v1/crops
cropCycleRouter.post("/", createCropCycleController);

// GET /v1/crops
cropCycleRouter.get("/", listFarmerCropsController);

// GET /v1/crops/:id
cropCycleRouter.get("/:id", getCropCycleController);

// PATCH /v1/crops/:id/stage
cropCycleRouter.patch("/:id/stage", updateCropStageController);
