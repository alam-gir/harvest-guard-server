import { Schema } from "mongoose";

export type LocaleCode = "bn" | "en";

export interface LocalizedString {
  bn?: string;
  en?: string;
}

export interface LocalizedStringArray {
  bn?: string[];
  en?: string[];
}

// Reusable Mongoose schema for LocalizedString
export const localizedStringSchema = new Schema<LocalizedString>(
  {
    bn: { type: String },
    en: { type: String }
  },
  { _id: false }
);

// Reusable Mongoose schema for an array of localized strings
export const localizedStringArraySchema = new Schema<LocalizedStringArray>(
  {
    bn: [{ type: String }],
    en: [{ type: String }]
  },
  { _id: false }
);
