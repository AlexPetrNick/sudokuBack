import {Router} from "express";
import {getUserData, login, refresh, registration} from "../../common/Controller/authController.js";
import {check} from 'express-validator'
import {authMiddleware} from "../../middleware/authMiddleware.js";
import cors from "cors";

const routerAuth = new Router()

routerAuth.post('/registration', [
    check('username', 'Имя пользователя не может быть пустым').notEmpty(),
    check('password', 'Пароль должен быть более 4 и меньше 10 символов').isLength({min:4, max: 10})
], registration)
routerAuth.post('/login', login)
routerAuth.post('/refresh', refresh)
routerAuth.get('/userdata', authMiddleware, getUserData)

export default routerAuth