import TalkingGroupModel from "../../models/TalkingGroupModel.js";
import UserTextMessageModel from "../../models/UserTextMessageModel.js";
import User from "../../models/User.js";


export const getListCurrentFriend = async (userId) => {
    return new Promise((resolve, reject) => {
        resolve(TalkingGroupModel.find({usersId: userId})
            .select({'usersId': 1, '_id': 1}))
    }).then((res) => {
        const menuIdUser = res.map(us => {
            return {
                friendId: us.usersId.filter(id => id.toString() !== userId.toString())[0].toString(),
                talkingId: us._id.toString()
            }
        })
        const friendIds = menuIdUser.map(us => us.friendId)
        const talkIds = menuIdUser.map(us => us.talkingId)
        return {friendIds, talkIds, menuIdUser}
    }).then((res) => {
        const {friendIds, talkIds, menuIdUser} = res
        const resultMessage = new Promise((res, rej) => {
            res(UserTextMessageModel.find({talkingGroupId: {$in: talkIds}}))
        })
        const resultUser = new Promise((res, rej) => {
            res(User.find({_id: {$in: friendIds}}))
        })
        return Promise.all([resultMessage, resultUser])
            .then(data => {
                const messData = data[0]
                const userData = data[1]

                return menuIdUser.map(data => {
                    const friend = userData.filter(us => us._id.toString() === data.friendId)
                    const filtFriend = friend.map(us => {
                        return {
                            id: us._id ? us._id : null,
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
            }).then(data => {
            return data
        })
    })
}

