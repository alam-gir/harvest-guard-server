import { Schema, model, Document, Types } from "mongoose";
import { LocalizedString, localizedStringSchema } from "./types/common";

export type NotificationType =
  | "weather_advisory"
  | "risk_alert"
  | "task_suggestion"
  | "badge_earned"
  | "system";

export interface INotification extends Document {
  farmer: Types.ObjectId;
  cropCycle?: Types.ObjectId;

  type: NotificationType;

  title: LocalizedString;
  body: LocalizedString;

  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    farmer: { type: Schema.Types.ObjectId, ref: "Farmer", required: true },
    cropCycle: { type: Schema.Types.ObjectId, ref: "CropCycle" },

    type: {
      type: String,
      enum: [
        "weather_advisory",
        "risk_alert",
        "task_suggestion",
        "badge_earned",
        "system"
      ],
      required: true
    },

    title: { type: localizedStringSchema, required: true },
    body: { type: localizedStringSchema, required: true },

    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Notification = model<INotification>(
  "Notification",
  notificationSchema
);
