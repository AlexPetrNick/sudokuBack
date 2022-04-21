import User from "../../models/User.js";
import {getDataAccessToken} from "../added/workerToken.js";
import TalkingGroupModel from "../../models/TalkingGroupModel.js";
import UserTextMessageModel from "../../models/UserTextMessageModel.js";
import {getListCurrentFriend} from "../added/dbWorker.js";
import {log} from "debug";

export const getListGroup = async (req, res) => {
    try {
        const {userId, ...dataToken} = getDataAccessToken(req.headers.authorization.split(' ')[1])
        const data = await getListCurrentFriend(userId)
        res.json({data})
    } catch (e) {

    }
}

export const getListUser = async (req, res) => {
    try {
        const query = req.query
        const {userId, ...dataToken} = getDataAccessToken(req.headers.authorization.split(' ')[1])
        const usersId = await TalkingGroupModel.find({usersId: userId})
            .select({'usersId': 1})
        const menuIdUser = usersId.map(us => {
            return us.usersId.filter(id => id.toString() !== userId)[0]
        })
        const idNotInTalking = menuIdUser.map(id => id.toString())
        idNotInTalking.push(userId)
        const listUserNotInTalking = await User.find({_id: {$nin: idNotInTalking}})

        const result = listUserNotInTalking.map(u => {
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