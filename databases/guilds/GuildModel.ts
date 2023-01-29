import { Document, Schema, model } from 'mongoose';

interface Guild extends Document {
    _id: string;
    channels: [string];
    roles: [string];
    userIntros: [{
        title: String,
        description: String,
        tags:[String],
        color:String
    }]
}

const GuildSchema: Schema = new Schema({
    _id: String,
    channels: [String],
    roles: [String],
    userIntros: [{
        title: String,
        description: String,
        tags:[String],
        color:String
    }]
});

export default model<Guild>("Guild", GuildSchema);