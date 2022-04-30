import UserTextMessageModel from "../models/UserTextMessageModel.js";
import userTextMessageModel from "../models/UserTextMessageModel.js";
import TalkingGroupModel from "../models/TalkingGroupModel.js";
import metaModel from "../models/MetaModel.js";
import {v4} from "uuid";
import SocketUser from "../models/SocketUser.js";


export const messageHandler = (io, socket) => {

    const seeMessage = async (arg, currId) => {
        console.log(currId)
        await UserTextMessageModel.updateOne(
            {_id: arg},
            {$push: {whoRead: currId}})
        socket.emit('msg:read', arg)

    }

    const newMessageEvent = async (getUserID, message, room, currId) => {
        const talkingGroup = await TalkingGroupModel.findOne({$and: [{usersId: currId}, {usersId: getUserID}]})
        if (talkingGroup) {
            return await metaModel.insertMany([
                {
                    deleteUserId: null,
                    updateUserId: null,
                    updateDate: null,
                    deleteDate: null,
                }
            ])
                .then(async (data) => {
                    console.log(currId)
                    return await userTextMessageModel.insertMany([
                        {
                            userId: currId,
                            metaId: data[0]['_id'],
                            talkingGroupId: talkingGroup._id,
                            text: message,
                            prevText: null,
                            whoRead: [currId],
                            createDate: new Date()
                        }
                    ])
                })
                .then(data => {
                    io.sockets.in(room).emit('msg:newcr', data[0]._id, currId, data[0].talkingGroupId, data[0].text, getUserID)
                })

        } else {
            const name_def = v4()
            await metaModel.insertMany([
                {
                    deleteUserId: null,
                    updateUserId: null,
                    updateDate: null,
                    deleteDate: null,
                }
            ]).then(async data => {
                console.log(currId)
                console.log(getUserID)
                return await TalkingGroupModel.insertMany([
                    {
                        metaId: data[0]['_id'],
                        usersId: [currId, getUserID],
                        name: name_def,
                        individual: true,
                        createDate: new Date()
                    }
                ])
            }).then(async data => {
                const newMeta = await metaModel.insertMany([
                    {
                        deleteUserId: null,
                        updateUserId: null,
                        updateDate: null,
                        deleteDate: null,
                    }
                ])
                return {data, newMeta}
            }).then(async data => {
                const messageNew = await userTextMessageModel.insertMany([
                    {
                        userId: currId,
                        metaId: data.newMeta[0]['_id'],
                        talkingGroupId: data.data[0]._id,
                        text: message,
                        prevText: null,
                        whoRead: [currId],
                        createDate: new Date()
                    }
                ])
                return {data, messageNew}
            })
                .then(dataIn => {
                    const {data, messageNew} = dataIn
                    const nameRoom = data.data[0].name
                    socket.join(nameRoom)
                    new Promise((res, rej) => {
                        res(SocketUser.find({userId:getUserID}))
                    }).then((dataSocket) => {
                        if (dataSocket.length) {
                            socket.to(dataSocket[0].socketId).emit('msg:newroom', nameRoom)
                            socket.to(dataSocket[0].socketId).emit('user:newfriend', nameRoom)
                        }
                    })
                    return {data, messageNew, nameRoom}
                })
                .then(dataIn => {
                    const {data, messageNew, nameRoom} = dataIn
                    console.log(socket.rooms)
                    io.sockets.in(nameRoom).emit('msg:newcr', messageNew[0]._id, currId, messageNew[0].talkingGroupId, messageNew[0].text, getUserID)
                })
        }
    }

    const readAllMsg = async (idFriend) => {
        const userId = socket.handshake.query.idUser
        const talking = await TalkingGroupModel.findOne({$and:[{usersId:idFriend},{usersId: userId}]})
        await UserTextMessageModel.updateMany({$and: [{talkingGroupId: talking._id}, {whoRead: {$ne: userId}}]}, {
            $push: { whoRead: userId }
        })
    }

    const joinRoomHnd = (room) => {
        socket.join(room)
        console.log(`User join to room ${room}`)
    }

    socket.on('msg:new', newMessageEvent)
    socket.on('msg:get', () => {
    })
    socket.on('msg:see', seeMessage)
    socket.on('msg:joinroom', joinRoomHnd)
    socket.on('msg:readallmsg', readAllMsg)

}