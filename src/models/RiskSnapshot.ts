import { Schema, model, Document, Types } from "mongoose";
import { LocalizedString, localizedStringSchema } from "./types/common";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface IRiskInputs {
  temperatureC?: number;
  humidityPercent?: number;
  rainProbabilityPercent?: number;
  storageType?: string;
  currentMoisturePercent?: number;
}

export interface IRiskSnapshot extends Document {
  cropCycle: Types.ObjectId;
  farmer: Types.ObjectId;

  source: "scheduled_job" | "on_demand" | "weather_update";

  etclHours?: number;
  riskLevel?: RiskLevel;
  riskType?: string; // e.g. "Mold", "Aflatoxin", "High Moisture"

  summary?: LocalizedString;

  inputs?: IRiskInputs;

  createdAt: Date;
}

const riskInputsSchema = new Schema<IRiskInputs>(
  {
    temperatureC: Number,
    humidityPercent: Number,
    rainProbabilityPercent: Number,
    storageType: String,
    currentMoisturePercent: Number
  },
  { _id: false }
);

const riskSnapshotSchema = new Schema<IRiskSnapshot>(
  {
    cropCycle: { type: Schema.Types.ObjectId, ref: "CropCycle", required: true },
    farmer: { type: Schema.Types.ObjectId, ref: "Farmer", required: true },

    source: {
      type: String,
      enum: ["scheduled_job", "on_demand", "weather_update"],
      default: "scheduled_job"
    },

    etclHours: Number,
    riskLevel: {
      type: String,
      enum: ["low", "medium", "high", "critical"]
    },
    riskType: String,

    summary: localizedStringSchema,

    inputs: riskInputsSchema
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const RiskSnapshot = model<IRiskSnapshot>(
  "RiskSnapshot",
  riskSnapshotSchema
);
