import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/sendResponse";

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  return sendError(res, 404, {
    success: false,
    message: "Route not found",
    errorCode: "ROUTE_NOT_FOUND"
  });
};
