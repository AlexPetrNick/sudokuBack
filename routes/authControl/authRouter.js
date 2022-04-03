import {Router} from "express";
import {getUsers, login, registration} from "./authController.js";
import {check} from 'express-validator'

const routerAuth = new Router()

routerAuth.post('/registration', [
    check('username', 'Имя пользователя не может быть пустым').notEmpty(),
    check('password', 'Пароль должен быть более 4 и меньше 10 символов').isLength({min:4, max: 10})
], registration)
routerAuth.post('/login', login)
routerAuth.get('/users', getUsers)

export default routerAuth