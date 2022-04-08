import mongoose from "mongoose";
const { Schema, model } = mongoose;


const User = new Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    roles: [{type: String, ref: 'Role'}],
    email: {type: String },
    firstName: {type: String },
    lastName: {type: String }

})

export default model('User', User)