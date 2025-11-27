import { Router } from "express";
import {
  registerFarmerController,
  loginFarmerController,
  refreshTokenController,
  logoutCurrentSessionController,
  logoutAllSessionsController
} from "../controllers/auth.controller"
import { requireAuth } from "../middlewares/requireAuth";

export const authRouter = Router();

// POST /v1/auth/register
authRouter.post("/register", registerFarmerController);

// POST /v1/auth/login
authRouter.post("/login", loginFarmerController);

// POST /v1/auth/refresh
authRouter.post("/refresh", refreshTokenController);

// POST /v1/auth/logout  (current device)
authRouter.post("/logout", requireAuth, logoutCurrentSessionController);

// POST /v1/auth/logout-all  (all devices)
authRouter.post("/logout-all", requireAuth, logoutAllSessionsController);
