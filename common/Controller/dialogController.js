import TalkingGroupModel from "../../models/TalkingGroupModel.js";
import User from "../../models/User.js";
import {getDataAccessToken} from "../added/workerToken.js";
import metaModel from "../../models/MetaModel.js";
import UserTextMessageModel from "../../models/UserTextMessageModel.js";
import userTextMessageModel from "../../models/UserTextMessageModel.js";
import {v4} from "uuid";
import mongoose from "mongoose";


export const getDialogInfo = async (req, res) => {
    try {
        const query = req.query
        const {userId, ...dataToken} = getDataAccessToken(req.headers.authorization.split(' ')[1])
        if (Object.keys(query) === undefined) {
            res.json({message: "Нет дополнительных параметров 'query'"})
        }
        const userFromQuery = query['username']
        if (userFromQuery.length) {
            const userQuery = await User.findOne({username: userFromQuery}).select(['_id', 'username', 'email', 'firstName', 'lastName'])

            const group = await TalkingGroupModel.find({$and: [{usersId: userId}, {usersId: userQuery}]})
            if (group.length) {
                await UserTextMessageModel.updateMany({$and: [{talkingGroupId: group[0]._id}, {whoRead: {$ne: userId}}]}, {
                    $push: { whoRead: userId }
                })
                const messages = await UserTextMessageModel.find({talkingGroupId: group[0]._id})
                res.json({userQuery, group, messages})
            }
            res.json({group})
        }

    } catch (e) {
        console.log(e)
    }
}


export const sendMessage = async (req, res) => {
    //TODO: Добавить обработчик если не найдено пользователя
    try {
        const query = req.query
        const {userId, ...dataToken} = getDataAccessToken(req.headers.authorization.split(' ')[1])
        const bodyReq = req.body
        const messageToUser = await User.findOne({username: bodyReq.username})

        const talkingGroup = await TalkingGroupModel.findOne({$and: [{usersId: messageToUser._id}, {usersId: userId}]})
        if (talkingGroup) {
            await metaModel.insertMany([
                {
                    deleteUserId: null,
                    updateUserId: null,
                    updateDate: null,
                    deleteDate: null,
                }
            ])
                .then(async (data) => {
                    await userTextMessageModel.insertMany([
                        {
                            userId: userId,
                            metaId: data[0]['_id'],
                            talkingGroupId: talkingGroup._id,
                            text: bodyReq.message,
                            prevText: null,
                            whoRead: [userId],
                            createDate: new Date()
                        }
                    ])
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
                return await TalkingGroupModel.insertMany([
                    {
                        metaId: data[0]['_id'],
                        usersId: [messageToUser._id, userId],
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
                        userId: userId,
                        metaId: data.newMeta[0]['_id'],
                        talkingGroupId: data.data[0]._id,
                        text: bodyReq.message,
                        prevText: null,
                        whoRead: [userId],
                        createDate: new Date()
                    }
                ])
            })
        }
        res.json({success: 'ok'})
    } catch (e) {
        console.log(e)
    }
}


