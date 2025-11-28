import { Types } from "mongoose";
import { Notification } from "../../models/Notification";
import { LocalizedString } from "../../models/types/common";

export class NotificationService {
  static async createRiskAlert(params: {
    farmerId: string | Types.ObjectId;
    cropCycleId?: string | Types.ObjectId;
    title: LocalizedString;
    body: LocalizedString;
  }) {
    const { farmerId, cropCycleId, title, body } = params;

    await Notification.create({
      farmer: new Types.ObjectId(farmerId),
      cropCycle: cropCycleId ? new Types.ObjectId(cropCycleId) : undefined,
      type: "risk_alert",
      title,
      body,
      isRead: false
    });
  }
}
