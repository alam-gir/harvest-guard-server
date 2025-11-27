import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { AuthSession } from "../models/AuthSession";
import { ApiError } from "../utils/ApiError";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw ApiError.unauthorized("Missing or invalid Authorization header");
    }

    const token = authHeader.split(" ")[1];

    const payload = verifyAccessToken(token!);

    // Check session status
    const session = await AuthSession.findById(payload.sessionId);

    if (!session || !session.isActive) {
      throw ApiError.unauthorized("Session is no longer active");
    }

    req.authUser = {
      id: payload.sub,
      role: payload.role,
      sessionId: payload.sessionId
    };

    return next();
  } catch (err: any) {
    // If verifyAccessToken threw jwt errors, wrap them
    if (err.name === "TokenExpiredError") {
      return next(ApiError.unauthorized("Access token expired"));
    }
    if (err.name === "JsonWebTokenError") {
      return next(ApiError.unauthorized("Invalid access token"));
    }

    return next(err);
  }
};
