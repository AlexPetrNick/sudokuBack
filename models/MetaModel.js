import mongoose from "mongoose";
const { Schema, model } = mongoose;

const MetaModel = new Schema({
    deleteUserId: { type: Schema.Types.ObjectId, ref:'User' },
    updateUserId: { type: Schema.Types.ObjectId, ref:'User' },
    updateDate: { type: Date },
    deleteDate: { type: Date },

})

export default model("Meta", MetaModel)