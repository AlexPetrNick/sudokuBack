import mongoose from "mongoose";
const { Schema, model } = mongoose;

const UserTextMessageModel = new Schema({
    userId: { type: Schema.Types.ObjectId, ref:'User' },
    metaId: { type: Schema.Types.ObjectId, ref:'Meta' },
    talkingGroupId: { type: Schema.Types.ObjectId, ref:'TalkingGroup' },
    text: { type: String },
    prevText: { type: String, default: '' },
    cntLike: { type: Number, default: 0 },
    cntWatch: { type: Number, default: 0 },
    whoRead: {type: [Schema.Types.ObjectId], ref: 'User'},
    createDate: { type: Date },
})

export default model("UserTextMessage", UserTextMessageModel)