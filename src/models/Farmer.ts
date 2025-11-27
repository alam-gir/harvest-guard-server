import { Schema, model, Document } from "mongoose";
import { LocaleCode } from "./types/common";

export interface ILocation {
  division: string;
  district: string;
  upazila: string;
  village?: string;
}

export interface IEarnedBadge {
  badgeCode: string;
  earnedAt: Date;
}

export interface IFarmer extends Document {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;

  preferredLanguage: LocaleCode;

  location?: ILocation;

  stats: {
    totalCropsTracked: number;
    totalBatchesStored: number;
    estimatedLossAvoidedKg?: number;
  };

  earnedBadges: IEarnedBadge[];

  createdAt: Date;
  updatedAt: Date;
}

const locationSchema = new Schema<ILocation>(
  {
    division: String,
    district: String,
    upazila: String,
    village: String
  },
  { _id: false }
);

const earnedBadgeSchema = new Schema<IEarnedBadge>(
  {
    badgeCode: { type: String, required: true },
    earnedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const farmerSchema = new Schema<IFarmer>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    phone: String,

    preferredLanguage: {
      type: String,
      enum: ["bn", "en"],
      default: "bn"
    },

    location: locationSchema,

    stats: {
      totalCropsTracked: { type: Number, default: 0 },
      totalBatchesStored: { type: Number, default: 0 },
      estimatedLossAvoidedKg: { type: Number, default: 0 }
    },

    earnedBadges: { type: [earnedBadgeSchema], default: [] }
  },
  { timestamps: true }
);

export const Farmer = model<IFarmer>("Farmer", farmerSchema);
