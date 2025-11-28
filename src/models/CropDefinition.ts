import { Schema, model, Document } from "mongoose";
import { LocalizedString, localizedStringSchema } from "./types/common";

export type LogicalPhase =
  | "growing"
  | "pre_harvest"
  | "harvest_window"
  | "post_harvest";

export interface IWeatherCondition {
  minTempC?: number;
  maxTempC?: number;
  minHumidity?: number;
  maxHumidity?: number;
  minRainProb?: number;
  maxRainProb?: number;
}

export interface IWeatherRule {
  condition: IWeatherCondition;
  advice: LocalizedString;
}

export interface IStageDefinition {
  key: string; // "seedling", "tillering", "flowering"...
  order: number;
  logicalPhase: LogicalPhase;
  minDayFromPlanting: number;
  maxDayFromPlanting: number;

  name: LocalizedString;

  wateringAdvice?: LocalizedString;
  fertilizerAdvice?: LocalizedString;
  generalAdvice?: LocalizedString;

  commonIssues?: LocalizedString[];

  weatherRules?: IWeatherRule[];
}

export interface IStorageProfile {
  idealHumidity: number;
  badHumidity: number;
  idealTemperature: number;
  badTemperature: number;
  sensitiveToRain: boolean;

  // storageType will be a code we define elsewhere (e.g. "JUTE_BAG_STACK")
  recommendedStorageTypes: string[];

  storageHints?: LocalizedString[];

  highHumidityMessageTemplate?: LocalizedString;
  highTemperatureMessageTemplate?: LocalizedString;
}

export interface ICropDefinition extends Document {
  code: string;              // "paddy", "tomato"
  name: LocalizedString;     // { bn: "ধান", en: "Paddy" }
  varieties?: LocalizedString[];
  isActive: boolean;

  stages: IStageDefinition[];
  storageProfile: IStorageProfile;

  createdAt: Date;
  updatedAt: Date;
}

const weatherConditionSchema = new Schema<IWeatherCondition>(
  {
    minTempC: Number,
    maxTempC: Number,
    minHumidity: Number,
    maxHumidity: Number,
    minRainProb: Number,
    maxRainProb: Number
  },
  { _id: false }
);

const weatherRuleSchema = new Schema<IWeatherRule>(
  {
    condition: weatherConditionSchema,
    advice: localizedStringSchema
  },
  { _id: false }
);

const stageDefinitionSchema = new Schema<IStageDefinition>(
  {
    key: { type: String, required: true },
    order: { type: Number, required: true },
    logicalPhase: {
      type: String,
      enum: ["growing", "pre_harvest", "harvest_window", "post_harvest"],
      required: true
    },
    minDayFromPlanting: { type: Number, required: true },
    maxDayFromPlanting: { type: Number, required: true },

    name: { type: localizedStringSchema, required: true },

    wateringAdvice: localizedStringSchema,
    fertilizerAdvice: localizedStringSchema,
    generalAdvice: localizedStringSchema,

    commonIssues: { type: [localizedStringSchema], default: [] },
    weatherRules: { type: [weatherRuleSchema], default: [] }
  },
  { _id: false }
);

const storageProfileSchema = new Schema<IStorageProfile>(
  {
    idealHumidity: { type: Number, required: true },
    badHumidity: { type: Number, required: true },
    idealTemperature: { type: Number, required: true },
    badTemperature: { type: Number, required: true },
    sensitiveToRain: { type: Boolean, default: true },
    recommendedStorageTypes: { type: [String], default: [] },
    storageHints: { type: [localizedStringSchema], default: [] },
    highHumidityMessageTemplate: localizedStringSchema,
    highTemperatureMessageTemplate: localizedStringSchema
  },
  { _id: false }
);

const cropDefinitionSchema = new Schema<ICropDefinition>(
  {
    code: { type: String, required: true, unique: true },
    name: { type: localizedStringSchema, required: true },
    varieties: { type: [localizedStringSchema], default: [] },
    isActive: { type: Boolean, default: true },

    stages: { type: [stageDefinitionSchema], default: [] },
    storageProfile: { type: storageProfileSchema, required: true }
  },
  { timestamps: true }
);

export const CropDefinition = model<ICropDefinition>(
  "CropDefinition",
  cropDefinitionSchema
);
