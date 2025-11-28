import { Router } from "express";
import { healthRouter } from "./health.routes";
import { authRouter } from "./auth.routes";
import { cropCycleRouter } from "./cropCycle.routes";
import { healthScanRouter } from "./healthScan.routes";

export const router = Router();

router.use("/health", healthRouter);

router.use("/auth", authRouter);

router.use("/crops", cropCycleRouter);

router.use("/health-scans", healthScanRouter);
