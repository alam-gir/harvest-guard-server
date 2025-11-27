import { Schema, model, Document } from "mongoose";
import { LocalizedString, localizedStringSchema } from "./types/common";

export interface IBadgeDefinition extends Document {
  code: string; // e.g. "FIRST_STORAGE", "RISK_RESCUED"
  name: LocalizedString;
  description: LocalizedString;
  iconUrl?: string;

  createdAt: Date;
  updatedAt: Date;
}

const badgeDefinitionSchema = new Schema<IBadgeDefinition>(
  {
    code: { type: String, required: true, unique: true },
    name: { type: localizedStringSchema, required: true },
    description: { type: localizedStringSchema, required: true },
    iconUrl: String
  },
  { timestamps: true }
);

export const BadgeDefinition = model<IBadgeDefinition>(
  "BadgeDefinition",
  badgeDefinitionSchema
);
