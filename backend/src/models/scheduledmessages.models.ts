// ./models/scheduledmessages.models.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IScheduledMessage extends Document {
  authed_user: string;
  teamId: string;
  channel: string;
  text: string;
  schedule_time: Date;
  sent: boolean;
}

const ScheduledMessageSchema: Schema = new Schema({
  authed_user: { type: String, required: true },
  teamId: { type: String, required: true },
  channel: { type: String, required: true },
  text: { type: String, required: true },
  schedule_time: { type: Date, required: true },
  sent: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model<IScheduledMessage>('ScheduledMessage', ScheduledMessageSchema);
