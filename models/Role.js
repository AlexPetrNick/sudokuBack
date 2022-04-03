import mongoose from "mongoose";
const { Schema, model } = mongoose;

const Role = new Schema({
    value: {type: String, unique: true, default: 'User'}
})

export default model("Role", Role)