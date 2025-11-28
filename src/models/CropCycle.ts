import { Schema, model, Document, Types } from "mongoose";
import { IFarmer } from "./Farmer";
import { ICropDefinition } from "./CropDefinition";
import { LocalizedString, localizedStringSchema } from "./types/common";

export type CropLifecycleStage =
  | "planned"
  | "planted"
  | "growing"
  | "pre_harvest"
  | "harvested"
  | "stored"
  | "completed";

export interface IFieldLocation {
  division?: string;
  district?: string;
  upazila?: string;
  village?: string;
}

export interface IFieldInfo {
  name?: string;
  areaDecimal?: number; // you can add other units if needed
  location?: IFieldLocation;
}

export interface IStorageLocation {
  division?: string;
  district?: string;
  upazila?: string;
  description?: string;
}

export interface IBatchInfo {
  estimatedWeightKg?: number;
  finalWeightKg?: number;

  storageType?: string; // code like "JUTE_BAG_STACK", "SILO", etc.
  storageLocation?: IStorageLocation;

  currentMoisturePercent?: number;
}

export interface IRiskSummary {
  currentRiskLevel?: "low" | "medium" | "high" | "critical";
  lastETCLHours?: number;
  lastRiskReason?: string;
  lastUpdatedAt?: Date;
}

export interface IDatesInfo {
  plannedPlantingAt?: Date;
  plantedAt?: Date;
  expectedHarvestAt?: Date;
  harvestedAt?: Date;
  storageStartedAt?: Date;
  storageEndAt?: Date;
}

export interface ICropCycle extends Document {
  farmer: Types.ObjectId | IFarmer;
  cropDefinition: Types.ObjectId | ICropDefinition;     
  variety?: LocalizedString;

  stage: CropLifecycleStage;

  fieldInfo?: IFieldInfo;
  dates: IDatesInfo;

  batchInfo?: IBatchInfo;
  riskSummary?: IRiskSummary;

  createdAt: Date;
  updatedAt: Date;
}

const fieldLocationSchema = new Schema<IFieldLocation>(
  {
    division: String,
    district: String,
    upazila: String,
    village: String
  },
  { _id: false }
);

const fieldInfoSchema = new Schema<IFieldInfo>(
  {
    name: String,
    areaDecimal: Number,
    location: fieldLocationSchema
  },
  { _id: false }
);

const storageLocationSchema = new Schema<IStorageLocation>(
  {
    division: String,
    district: String,
    upazila: String,
    description: String
  },
  { _id: false }
);

const batchInfoSchema = new Schema<IBatchInfo>(
  {
    estimatedWeightKg: Number,
    finalWeightKg: Number,
    storageType: String,
    storageLocation: storageLocationSchema,
    currentMoisturePercent: Number
  },
  { _id: false }
);

const riskSummarySchema = new Schema<IRiskSummary>(
  {
    currentRiskLevel: {
      type: String,
      enum: ["low", "medium", "high", "critical"]
    },
    lastETCLHours: Number,
    lastRiskReason: String,
    lastUpdatedAt: Date
  },
  { _id: false }
);

const datesInfoSchema = new Schema<IDatesInfo>(
  {
    plannedPlantingAt: Date,
    plantedAt: Date,
    expectedHarvestAt: Date,
    harvestedAt: Date,
    storageStartedAt: Date,
    storageEndAt: Date
  },
  { _id: false }
);

const cropCycleSchema = new Schema<ICropCycle>(
  {
    farmer: { type: Schema.Types.ObjectId, ref: "Farmer", required: true },
    cropDefinition: { type: Schema.Types.ObjectId, ref: "CropDefinition", required: true },
    variety: {type: localizedStringSchema, default: {}},

    stage: {
      type: String,
      enum: [
        "planned",
        "planted",
        "growing",
        "pre_harvest",
        "harvested",
        "stored",
        "completed"
      ],
      default: "planned"
    },

    fieldInfo: fieldInfoSchema,
    dates: { type: datesInfoSchema, default: {} },

    batchInfo: batchInfoSchema,
    riskSummary: riskSummarySchema
  },
  { timestamps: true }
);

export const CropCycle = model<ICropCycle>("CropCycle", cropCycleSchema);
