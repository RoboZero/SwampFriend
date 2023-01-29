import { Document, Schema, model } from 'mongoose';

interface Guild extends Document {
    _id: String;
    channels: [String];
    roles: [String];
    userIntros: [{
        userId: String,
        title: String,
        description: String,
        tags:[String],
        color:String,
    }]
}

const GuildSchema: Schema = new Schema({
    _id: String,
    channels: [String],
    roles: [String],
    userIntros: [{
        userId: String,
        title: String,
        description: String,
        tags:[String],
        color:String,
        _id:false
    }]
});

export default model<Guild>("Guild", GuildSchema);