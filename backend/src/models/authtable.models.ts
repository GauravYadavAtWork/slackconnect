// ./models/authtable.models.ts (my workflow)
import mongoose, { Schema, Document } from 'mongoose';

export interface ISlackUser extends Document {
    authed_user: string;
    access_token: string;
    refresh_token: string;
    teamid: string;
    expires_at: Date;
}

const SlackUserSchema: Schema = new Schema({
    authed_user: {type: String, required: true, unique: true},
    access_token: { type: String, required: true },
    refresh_token: { type: String, required: true },
    teamid: { type: String, required: true },
    expires_at: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.model<ISlackUser>('SlackUser', SlackUserSchema);
