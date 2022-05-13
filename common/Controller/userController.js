import {getDataAccessToken} from "../added/workerToken.js";
import User from "../../models/User.js";
import fs from "fs";
import {conf} from "../../config/config.js";
import path from "path";


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


export const loadImageOrigin = async (req, res) => {
    try {
        const {userId, ...dataToken} = getDataAccessToken(req.headers.authorization.split(' ')[1])
        const bodyReq = req.body
        const pathImg = conf.pathImagesUpload + `${userId}/`
        const files = fs.readdirSync(pathImg);
        const filter_file = files.filter(file => file.includes('origin'))[0]
        const sysPath = path.resolve()
        const fullPath = sysPath + pathImg.substr(1) + filter_file
        res.download(fullPath, 'pict.jpg')
    } catch (e) {
        console.log(e)
    }
}

export const loadImageCut = async (req, res) => {
    try {
        const {userId, ...dataToken} = getDataAccessToken(req.headers.authorization.split(' ')[1])
        const bodyReq = req.body
        const pathImg = conf.pathImagesUpload + `${userId}/`
        const files = fs.readdirSync(pathImg);
        const filter_file = files.filter(file => file.includes('cut'))[0]
        const sysPath = path.resolve()
        const fullPath = sysPath + pathImg.substr(1) + filter_file
        res.download(fullPath, 'pict.jpg')
    } catch (e) {
        console.log(e)
    }
}