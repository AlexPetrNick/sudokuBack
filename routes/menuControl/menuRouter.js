import {Router} from "express";
import {
    clearDataUsers,
    getListGroup,
    getListMenuItem,
    getListUser
} from "../../common/Controller/menuController.js";


// routerAuth.post('/registration', [
//     check('username', 'Имя пользователя не может быть пустым').notEmpty(),
//     check('password', 'Пароль должен быть более 4 и меньше 10 символов').isLength({min:4, max: 10})
// ], registration)

const menuRouter = new Router()

menuRouter.get('/list_group', getListGroup)
menuRouter.get('/list_user', getListUser)
menuRouter.get('/list_menu_item', getListMenuItem)
menuRouter.get('/clear_data_users', clearDataUsers)

export default menuRouter