import mongoose from "mongoose";
const { Schema, model } = mongoose;

const TalkingGroupModel = new Schema({
    metaId: { type: Schema.Types.ObjectId, ref:'Meta' },
    usersId: { type: [Schema.Types.ObjectId], ref:'User' },
    name: {type: String, unique: true},
    individual: {type: Boolean, default: true}
})

export default model("TalkingGroup", TalkingGroupModel)