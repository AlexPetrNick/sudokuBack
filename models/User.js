import mongoose from "mongoose";
const { Schema, model } = mongoose;


const User = new Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    roles: [{type: String, ref: 'Role'}]
})

export default model('User', User)