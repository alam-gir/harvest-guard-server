import { Schema, model, Document, Types } from "mongoose";
import { LocalizedString, localizedStringSchema } from "./types/common";

export type HealthScanType = "leaf" | "grain" | "other";

export interface IHealthScan extends Document {
  cropCycle: Types.ObjectId;
  farmer: Types.ObjectId;

  scanType: HealthScanType;
  imageUrl: string;

  aiLabel?: string;
  confidence?: number;

  aiSummary?: LocalizedString;
  recommendedActions?: LocalizedString;

  meta?: {
    modelName?: string;
    modelVersion?: string;
    latencyMs?: number;
  };

  createdAt: Date;
}

const healthScanSchema = new Schema<IHealthScan>(
  {
    cropCycle: { type: Schema.Types.ObjectId, ref: "CropCycle", required: true },
    farmer: { type: Schema.Types.ObjectId, ref: "Farmer", required: true },

    scanType: {
      type: String,
      enum: ["leaf", "grain", "other"],
      required: true
    },
    imageUrl: { type: String, required: true },

    aiLabel: String,
    confidence: Number,

    aiSummary: localizedStringSchema,
    recommendedActions: localizedStringSchema,

    meta: {
      modelName: String,
      modelVersion: String,
      latencyMs: Number
    }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const HealthScan = model<IHealthScan>("HealthScan", healthScanSchema);
