import { Schema, model, Document, Types } from "mongoose";
import { IFarmer } from "./Farmer";

export interface IAuthSession extends Document {
  farmer: Types.ObjectId | IFarmer;
  userAgent?: string;
  deviceName?: string;
  ipAddress?: string;

  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  revokedAt?: Date;
  expiresAt?: Date;
}

const authSessionSchema = new Schema<IAuthSession>(
  {
    farmer: { type: Schema.Types.ObjectId, ref: "Farmer", required: true },
    userAgent: String,
    deviceName: String,
    ipAddress: String,

    isActive: { type: Boolean, default: true },
    revokedAt: Date,
    expiresAt: Date
  },
  { timestamps: true }
);

// index to auto-clean expired sessions if set expiresAt
authSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const AuthSession = model<IAuthSession>("AuthSession", authSessionSchema);
