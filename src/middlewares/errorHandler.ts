import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { sendError } from "../utils/sendResponse";
import { env } from "../config/env";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err);

  // If it's our custom ApiError
  if (err instanceof ApiError) {
    return sendError(res, err.statusCode, {
      success: false,
      message: err.message,
      errorCode: err.errorCode || "UNKNOWN_ERROR",
      details: err.details // <-- FIELD ERRORS COME HERE
    });
  }

  // Mongoose validation errors
  if (err?.name === "ValidationError") {
    const fieldErrors: Record<string, string> = {};
    for (const key in err.errors) {
      fieldErrors[key] = err.errors[key].message;
    }

    return sendError(res, 400, {
      success: false,
      message: "Validation error",
      errorCode: "MONGOOSE_VALIDATION_ERROR",
      details: fieldErrors
    });
  }

  // Any other error
  return sendError(res, 500, {
    success: false,
    message: "Internal server error",
    errorCode: "INTERNAL_ERROR",
    details: env.nodeEnv === "development" ? err : undefined
  });
};
