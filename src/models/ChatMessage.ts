import { Schema, model, Document, Types } from "mongoose";
import { LocaleCode } from "./types/common";

export type ChatRole = "farmer" | "assistant" | "system";

export interface IChatMessage extends Document {
  session: Types.ObjectId;
  farmer: Types.ObjectId;

  role: ChatRole;
  content: string;
  language: LocaleCode;

  createdAt: Date;
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    session: { type: Schema.Types.ObjectId, ref: "ChatSession", required: true },
    farmer: { type: Schema.Types.ObjectId, ref: "Farmer", required: true },

    role: {
      type: String,
      enum: ["farmer", "assistant", "system"],
      required: true
    },
    content: { type: String, required: true },
    language: {
      type: String,
      enum: ["bn", "en"],
      required: true
    }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ChatMessage = model<IChatMessage>(
  "ChatMessage",
  chatMessageSchema
);
