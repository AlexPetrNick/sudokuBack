import {getDataAccessToken} from "../added/workerToken.js";
import User from "../../models/User.js";


export const changeUserHandler = async (req, res) => {
    try {
        const {userId, ...dataToken} = getDataAccessToken(req.headers.authorization.split(' ')[1])
        const staticField = ['username', '_id']
        const findUser = {"_id": userId}
        const bodyReq = req.body
        console.log(bodyReq)
        let updateField = {}
        await Object.keys(bodyReq).forEach((elem) => {
            if (!staticField.includes(elem)) {
                updateField[elem] = bodyReq[elem]
            }
        })
        await User.findOneAndUpdate(findUser, updateField)
        const userRet = await User.find(findUser).select(["_id","username","firstName","lastName","email"])
        console.log(userRet[0])
        res.json(userRet[0])

    } catch (e) {
        console.log(e)
    }
}