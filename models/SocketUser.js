import mongoose from "mongoose";
const { Schema, model } = mongoose;

const SocketUser = new Schema({
    userId: { type: String, ref:'User' },
    socketId: { type: String }
})

export default model("SocketUser", SocketUser)