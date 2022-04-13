import User from "../../models/User.js";
import {getDataAccessToken} from "../added/workerToken.js";
import TalkingGroupModel from "../../models/TalkingGroupModel.js";
import UserTextMessageModel from "../../models/UserTextMessageModel.js";


export const getListGroup = async (req, res) => {
    try {
        const {userId, ...dataToken} = getDataAccessToken(req.headers.authorization.split(' ')[1])
        const usersId = await TalkingGroupModel.find({usersId: userId})
            .select({'usersId': 1, '_id': 1})
        const menuIdUser = usersId.map(us => {
            console.log(us)
            return {
                friendId: us.usersId.filter(id => id.toString() !== userId)[0].toString(),
                talkingId: us._id.toString()
            }
        })
        const friendIds = menuIdUser.map(us => us.friendId)
        const talkIds = menuIdUser.map(us => us.talkingId)
        const dataMessagesProm = new Promise((res, rej) => {
            res(UserTextMessageModel.find({talkingGroupId: {$in: talkIds}}))
        })
        const dataUsersProm = new Promise((res, rej) => {
            res(User.find({_id: {$in: friendIds}}))
        })
        Promise.all([dataMessagesProm, dataUsersProm])
            .then(data => {
                const messData = data[0]
                const userData = data[1]

                const dataGroup = menuIdUser.map(data => {
                    const friend = userData.filter(us => us._id.toString() === data.friendId)
                    const filtFriend = friend.map(us => {
                        return {
                            username: us.username,
                            email: us.email ? us.email : null,
                            firstName: us.firstName ? us.firstName : null,
                            lastName: us.lastName ? us.lastName : null,
                        }
                    })

                    const talkRaw = messData.filter(ms => ms.talkingGroupId.toString() === data.talkingId)
                    const talk = talkRaw.slice(-1)
                    return {
                        friend: filtFriend[0],
                        talking: talk[0]
                    }
                })

                res.json({dataGroup})
            })

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
            const email = u.email ? u.email : null
            const firstName = u.firstName ? u.firstName : null
            const lastName = u.lastName ? u.lastName : null
            return {
                username, email, firstName, lastName
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