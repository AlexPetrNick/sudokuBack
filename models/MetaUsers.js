import mongoose from "mongoose";
const { Schema, model } = mongoose;

const TalkingGroupModel = new Schema({
    userId: { type: [Schema.Types.ObjectId], ref:'User' },
    name: {type: String, unique: true},
    individual: {type: Boolean, default: true},
    createDate: { type: Date },
})

export default model("TalkingGroup", TalkingGroupModel)