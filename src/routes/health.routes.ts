import { Router, Request, Response } from "express";

export const healthRouter = Router();

healthRouter.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "API is healthy"
  });
});
