import { Schema, model, Document, Types } from "mongoose";

export interface IChatSession extends Document {
  farmer: Types.ObjectId;
  activeCropCycle?: Types.ObjectId;

  startedAt: Date;
  lastActivityAt: Date;
}

const chatSessionSchema = new Schema<IChatSession>(
  {
    farmer: { type: Schema.Types.ObjectId, ref: "Farmer", required: true },
    activeCropCycle: { type: Schema.Types.ObjectId, ref: "CropCycle" },

    startedAt: { type: Date, default: Date.now },
    lastActivityAt: { type: Date, default: Date.now }
  },
  { timestamps: false }
);

export const ChatSession = model<IChatSession>(
  "ChatSession",
  chatSessionSchema
);
