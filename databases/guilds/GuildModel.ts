import { Document, Schema, model } from 'mongoose';

interface Guild extends Document {
    _id: string;
    channels: [string];
    roles: [string];
    users: [string];
}

const GuildSchema: Schema = new Schema({
    _id: String,
    channels: [String],
    roles: [String],
    users: [String]
});

export default model<Guild>("Guild", GuildSchema);