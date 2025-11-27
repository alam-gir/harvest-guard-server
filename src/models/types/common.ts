import { Schema } from "mongoose";

export type LocaleCode = "bn" | "en";

export interface LocalizedString {
  bn?: string;
  en?: string;
}

// Reusable Mongoose schema for LocalizedString
export const localizedStringSchema = new Schema<LocalizedString>(
  {
    bn: { type: String },
    en: { type: String }
  },
  { _id: false }
);
