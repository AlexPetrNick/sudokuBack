import TalkingGroupModel from "../../models/TalkingGroupModel.js";
import User from "../../models/User.js";
import {getDataAccessToken} from "../added/workerToken.js";
import metaModel from "../../models/MetaModel.js";
import UserTextMessageModel from "../../models/UserTextMessageModel.js";
import {body} from "express-validator";
import {v4} from "uuid";
import userTextMessageModel from "../../models/UserTextMessageModel.js";


export const getDialogInfo = async (req, res) => {
    try {
        const query = req.query
        const {userId, ...dataToken} = getDataAccessToken(req.headers.authorization.split(' ')[1])

        if (Object.keys(query) === undefined) {
            res.json({message: "Нет дополнительных параметров 'query'"})
        }
        const userFromQuery = query['username']
        if (userFromQuery.length) {
            const userQuery = await User.findOne({username: userFromQuery})
            const group = await TalkingGroupModel.find({$and: [{usersId: userId},{usersId: userQuery}]})
            if (group.length) {
                const messages = await UserTextMessageModel.find({ talkingGroupId: group[0]._id })
                res.json({group, messages})
            }
            res.json({group})
        }

    } catch (e) {
        console.log(e)
    }
}


export const sendMessage = async (req, res) => {
    try {
        const query = req.query
        const {userId, ...dataToken} = getDataAccessToken(req.headers.authorization.split(' ')[1])
        const bodyReq = req.body
        const messageToUser = await User.findOne({username: bodyReq.username})

        const talkingGroup = await TalkingGroupModel.findOne({$and: [{usersId: messageToUser._id},{usersId: userId}]})
        if (talkingGroup) {
            const newMetaMess = await metaModel.insertMany([
                {
                    deleteUserId: null,
                    updateUserId: null,
                    updateDate: null,
                    deleteDate: null,
                }
            ])
            const newMessage = await userTextMessageModel.insertMany([
                {
                    userId: userId,
                    metaId: newMetaMess['_id'],
                    talkingGroupId: talkingGroup._id,
                    text: bodyReq.message,
                    prevText: null,
                    whoRead: [userId],
                    createDate: new Date()
                }
            ])
        } else {
            const newMeta = await metaModel.insertMany([
                {
                    deleteUserId: null,
                    updateUserId: null,
                    updateDate: null,
                    deleteDate: null,
                }
            ])
            const newTalking = await TalkingGroupModel.insertMany([
                {
                    metaId: newMeta['_id'],
                    usersId: [messageToUser._id, userId],
                    name: v4(),
                    individual: true,
                    createDate: new Date()
                }
            ])
            const newMetaMess = await metaModel.insertMany([
                {
                    deleteUserId: null,
                    updateUserId: null,
                    updateDate: null,
                    deleteDate: null,
                }
            ])
            const newMessage = await userTextMessageModel.insertMany([
                {
                    userId: userId,
                    metaId: newMetaMess['_id'],
                    talkingGroupId: newTalking['_id'],
                    text: bodyReq.message,
                    prevText: null,
                    whoRead: [userId],
                    createDate: new Date()
                }
            ])
        }
        res.json({ success: 'ok'})
    } catch (e) {
        console.log(e)
    }
}


