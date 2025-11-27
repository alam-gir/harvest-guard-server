import { Response } from "express";
import { ApiSuccessResponse, ApiErrorResponse } from "../models/types/api";

export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  payload: ApiSuccessResponse<T>
): void => {
  res.status(statusCode).json(payload);
};

export const sendError = (
  res: Response,
  statusCode: number,
  payload: ApiErrorResponse
): void => {
  res.status(statusCode).json(payload);
};
