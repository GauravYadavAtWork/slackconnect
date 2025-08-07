// ./models/authtable.models.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ISlackUser extends Document {
    authed_user: string;
    access_token: string;
    refresh_token: string;
}

const SlackUserSchema: Schema = new Schema({
    authed_user: {type: String, required: true},
    access_token: { type: String, required: true },
    refresh_token: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<ISlackUser>('SlackUser', SlackUserSchema);
