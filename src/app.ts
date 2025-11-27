import express, { Application } from "express";
import cors from "cors";
import { router } from "./routes";
import { notFoundHandler } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/errorHandler";
import cookieParser from "cookie-parser";

export const createApp = (): Application => {
  const app = express();

  app.use(cors({
    origin: "*",
    credentials: true
  }));

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use("/v1", router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
