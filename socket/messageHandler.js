import UserTextMessageModel from "../models/UserTextMessageModel.js";
import User from "../models/User.js";


export const messageHandler = (io, socket) => {

    const getNewMessage = async () => {
        const a = UserTextMessageModel.find({_id: talkId}).sort({createDate: -1})
            .limit(1)
        return a
    }

    const seeMessage = async (arg) => {
        await UserTextMessageModel.updateOne(
            {_id: arg},
            {$push: {whoRead: socket.id}})
        socket.emit('msg:read', arg)
        console.log('Read mess')

    }

    socket.on('msg:add', () => {
    })
    socket.on('msg:get', () => {
    })
    socket.on('msg:see', seeMessage)

}