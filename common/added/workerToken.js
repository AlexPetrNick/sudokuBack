import jwt from "jsonwebtoken";
import {conf} from "../../config/config.js";
import {v4} from 'uuid'
import Token from "../../models/Token.js";


export const generateAccessToken = (userId, roles) => {
    const payload = {
        userId, roles, type: conf.token.accessToken.typeToken
    }
    return jwt.sign(payload, conf.secret, {expiresIn: conf.token.accessToken.live})
}

export const generateRefeshToken = (userId) => {
    const value = v4()
    const payload = {
        value, type: conf.token.refreshToken.typeToken
    }
    saveToken(userId, value)
    return jwt.sign(payload, conf.secret, {expiresIn: conf.token.refreshToken.live})
}

export const saveToken = async (userId, token) => {
    await Token.create({ value: token, user: userId})
}

export const getDataAccessToken = (token) => {
    return jwt.verify(token, conf.secret)
}

