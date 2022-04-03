import Role from "../../models/Role.js";
import User from "../../models/User.js";
import bcrypt from 'bcryptjs'
import { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import {conf} from "../../config/config.js";

const generateAccessToken = (id, roles) => {
    const payload = {
        id, roles
    }
    return jwt.sign(payload, conf.secret, {expiresIn: "24h"})
}

export const registration = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({message: 'Ошибка при регистрации', errors})
        }
        const {username, password} = req.body
        const candidate = await User.findOne({username})
        if (candidate) {
            return res.status(400).json({message: 'Пользователь с таким именени уже существует'})
        }
        const hashPasswrd = bcrypt.hashSync(password, 7)
        const userRoles = await Role.findOne({value: 'USER'})
        const user = new User({
            username,
            password: hashPasswrd,
            roles: [userRoles.value]
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
        const { username, password} = req.body
        const user = await User.findOne({username})
        if (!user) {
            return res.status(400).json({message: `Пользователь ${username} не найден`})
        }
        const validpsw = bcrypt.compareSync(password, user.password)
        if (!validpsw) {
            return res.status(400).json({message: `Пароль неверный`})
        }
        const token = generateAccessToken(user._id, user.roles)
        return res.json({token})
    } catch (e) {
        console.log(e)
        res.status(400).json({message: 'Login error'})
    }
}
export const getUsers = async (req, res) => {
    try {
        const user = await User.find()
        return res.json({user})
    } catch (e) {
        console.log(e)
    }
}