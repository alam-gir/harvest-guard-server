import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../middlewares/requireAuth";
import {
  createHealthScanController,
  listHealthScansForCropController,
  listHealthScansForFarmerController
} from "../controllers/healthScan.controller";

export const healthScanRouter = Router();

// Multer config for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

healthScanRouter.use(requireAuth);

// POST /v1/health-scans
healthScanRouter.post(
  "/",
  upload.single("image"),
  createHealthScanController
);

// GET /v1/health-scans
healthScanRouter.get("/", listHealthScansForFarmerController);

// GET /v1/health-scans/crop/:cropCycleId
healthScanRouter.get("/crop/:cropCycleId", listHealthScansForCropController);
