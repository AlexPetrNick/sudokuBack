import UserTextMessageModel from "../../models/UserTextMessageModel.js";
import User from "../../models/User.js";


export const getLastMessageTalking = (talkId) => {
    const a = UserTextMessageModel.find({talkingGroupId: talkId}).sort({createDate: -1})
            .limit(1)
    return a
}

export const getUserInfoWithoutPass = async (userId) => {
    // const listUser = await User.find({_id: userId})
    return new Promise((res,rej) => {
        res(User.find({_id: userId}))
    })


    // const userInfo = listUser.map(user => {
    //         return {
    //             username: user.username,
    //             email: user.email ? user.email : null,
    //             firstName: user.firstName ? user.firstName : null,
    //             lastName: user.lastName ? user.lastName : null,
    //         }
    //     })
}