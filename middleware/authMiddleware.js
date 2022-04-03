import jwt from 'jsonwebtoken'
import {conf} from "../config/config.js";

export const authMiddleware = (req, res, next) => {
    if (req.method === 'OPTION') {
        next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.status(403).json({message: "Пользователь не авторизован"})
        }
        req.user = jwt.verify(token, conf.secret)
        next()
    } catch (e) {
        console.log(e)
        return res.status(403).json({message: "Пользователь не авторизован"})
    }
}