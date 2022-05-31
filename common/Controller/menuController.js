import User from "../../models/User.js";
import {getDataAccessToken} from "../added/workerToken.js";
import TalkingGroupModel from "../../models/TalkingGroupModel.js";
import UserTextMessageModel from "../../models/UserTextMessageModel.js";
import {getListCurrentFriend} from "../added/dbWorker.js";
import {log} from "debug";
import MetaModel from "../../models/MetaModel.js";

export const getListGroup = async (req, res) => {
    try {
        const query = req.query
        const {userId, ...dataToken} = getDataAccessToken(req.headers.authorization.split(' ')[1])
        let readyData = await getListCurrentFriend(userId)
        if (query.user) {
            readyData = await readyData.filter(dataUsers => dataUsers.friend.username === query.user)
        }
        res.json({data:readyData})
    } catch (e) {

    }
}

export const getListUser = async (req, res) => {
    try {
        const query = req.query
        const {userId} = getDataAccessToken(req.headers.authorization.split(' ')[1])
        let resultUser = []
        const usersId = await TalkingGroupModel.find({usersId: userId}).select({'usersId': 1})
        const menuIdUser = usersId.map(us => us.usersId.filter(id => id.toString() !== userId)[0])
        const idNotInTalking = await menuIdUser.map(id => id.toString())
        idNotInTalking.push(userId)
        resultUser = await User.find({_id: {$nin: idNotInTalking}})
        if (query.filter) {
            resultUser = await resultUser.filter(user => user.username.includes(query.filter))
        }
        const result = await resultUser.map(u => {
            const username = u.username
            const id = u._id
            const email = u.email ? u.email : null
            const firstName = u.firstName ? u.firstName : null
            const lastName = u.lastName ? u.lastName : null
            return {
                username, email, firstName, lastName, id
            }
        })
        res.json({result})
    } catch (e) {
        console.log(e)
    }
}

export const getListMenuItem = async (req, res) => {
    try {

    } catch (e) {

    }
}


export const clearDataUsers = async (req, res) => {
    try {
        const clearMeta = await MetaModel.deleteMany({deleteUserId: null})
        const clearMessages = await UserTextMessageModel.deleteMany({cntLike: 0})
        const clearTalking = await TalkingGroupModel.deleteMany({individual: true})
        res.json({clearMeta, clearMessages, clearTalking})
    } catch (e) {
        console.log(e)
    }
}
