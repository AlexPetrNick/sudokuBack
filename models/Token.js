import mongoose from "mongoose";
const { Schema, model } = mongoose;

const Token = new Schema({
    value: {type: String },
    user: { type: Schema.Types.ObjectId, ref:'User'}
})

export default model("Token", Token)