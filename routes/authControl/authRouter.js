import {Router} from "express";
import {getUsers, login, registration} from "./authController.js";

const routerAuth = new Router()

routerAuth.post('/registration', registration)
routerAuth.post('/login', login)
routerAuth.get('/users', getUsers)

export default routerAuth