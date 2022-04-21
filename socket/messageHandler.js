import UserTextMessageModel from "../models/UserTextMessageModel.js";
import User from "../models/User.js";
import TalkingGroupModel from "../models/TalkingGroupModel.js";
import metaModel from "../models/MetaModel.js";
import userTextMessageModel from "../models/UserTextMessageModel.js";
import {v4} from "uuid";
import {log} from "debug";


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
                await userTextMessageModel.insertMany([
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
            })
        }
    }

    socket.on('msg:new', newMessageEvent)
    socket.on('msg:get', () => {
    })
    socket.on('msg:see', seeMessage)

}