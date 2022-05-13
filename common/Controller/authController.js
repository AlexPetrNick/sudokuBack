import Role from "../../models/Role.js";
import User from "../../models/User.js";
import bcrypt from 'bcryptjs'
import {validationResult} from 'express-validator'
import {generateAccessToken, generateRefeshToken, getDataAccessToken} from "../added/workerToken.js";
import jwt from "jsonwebtoken";
import {conf} from "../../config/config.js";
import Token from "../../models/Token.js";
import TalkingGroupModel from "../../models/TalkingGroupModel.js";
import {getListCurrentFriend} from "../added/dbWorker.js";



export const registration = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({message: 'Ошибка при регистрации', errors})
        }
        const {username, password, ...ostBody} = req.body
        const candidate = await User.findOne({username})
        if (candidate) {
            return res.status(400).json({message: 'Пользователь с таким именени уже существует'})
        }
        const hashPasswrd = bcrypt.hashSync(password, 7)
        const userRoles = await Role.findOne({value: 'USER'})
        const user = new User({
            username,
            password: hashPasswrd,
            roles: [userRoles.value],
            email: ostBody.email ? ostBody.email : null,
            firstName: ostBody.firstName ? ostBody.firstName : null,
            lastName: ostBody.lastName ? ostBody.lastName : null
        })
        await user.save()
        return res.json({message: 'Пользователь успешно зарегистрирован'})
    } catch (e) {
        console.log(e)
        res.status(400).json({message: 'Registration error'})
    }
}

export const login = async (req, res) => {
    try {
        const {username, password} = req.body
        const user = await User.findOne({username})
        if (!user) {
            return res.status(400).json({message: `Пользователь ${username} не найден`})
        }
        const validpsw = bcrypt.compareSync(password, user.password)
        if (!validpsw) {
            return res.status(400).json({message: `Пароль неверный`})
        }
        const token = await Token.findOne({ user: user._id})
        if (token) {
            await Token.deleteOne({user: user._id})
        }
        const dataDialog = await getListCurrentFriend(user._id)
        const infoUser = await TalkingGroupModel.find({usersId: user._id})
            .then(data => {
                const accessToken = generateAccessToken(user._id, user.roles)
                const refreshToken = generateRefeshToken(user._id)
                const {password, ...infoUser} = user
                const {password:second, _id, ...correctInfo} = infoUser['_doc']
                const nameRooms = data.map(talk => talk.name)
                const images = {
                    origin: `${conf.staticImages}${user._id}/origin.jpg`,
                    cut: `${conf.staticImages}${user._id}/cut.jpg`
                }
                return {accessToken, refreshToken, infoUser:correctInfo, id:_id, images, nameRooms, dataDialog}
            })

        res.json(infoUser)
    } catch (e) {
        console.log(e)
        res.status(400).json({message: 'Login error'})
    }
}

export const refresh = async (req, res) => {
    try {
        const { refreshToken: oldRefreshToken } = req.body
        const { value, type, exp, ...tokenInfo } = jwt.verify(oldRefreshToken, conf.secret)
        if (type !== conf.token.refreshToken.typeToken) {
            return res.status(400).json({message: `Неверный тип токена`})
        }
        const foundToken = await Token.findOne({ value })
        const userToken = foundToken.user
        if (!foundToken) {
            return res.status(400).json({message: `Токен не найден`})
        }
        const foundRole = await User.findOne({_id: userToken})

        const token = await Token.findOne({ user: userToken})
        if (token) {
            await Token.deleteOne({user: userToken})
        }
        const accessToken = generateAccessToken(userToken, foundRole.roles[0])
        const refreshToken = generateRefeshToken(userToken)
        return res.json({refreshToken, accessToken})
    } catch (e) {
        console.log(e)
        return res.status(400).json({message: `Истек срок годности`, e})
    }
}


export const getUserData = async (req, res) => {
    try {
        const { userId, ...dataToken } = getDataAccessToken(req.headers.authorization.split(' ')[1])
        const user = await User.find({ _id: userId})
        const { username, roles, _id, ...dataUser} = user[0]
        return res.json({_id, username, roles})
    } catch (e) {
        console.log(e)
    }
}

export const getRooms = async (req, res) => {
    try {
        const { userId, ...dataToken } = getDataAccessToken(req.headers.authorization.split(' ')[1])


        const usersId = await TalkingGroupModel.find({usersId: userId})
            .then(data => {
                const nameRooms = data.map(talk => talk.name)
                res.json({nameRooms})
            })
    } catch (e) {
        console.log(e)
    }
}


