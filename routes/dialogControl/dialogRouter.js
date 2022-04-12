import {Router} from "express";
import {getDialogInfo, sendMessage} from "../../common/Controller/dialogController.js";
import {authMiddleware} from "../../middleware/authMiddleware.js";


const dialogRouter = new Router()

dialogRouter.get('/get-dialog-info', getDialogInfo)
dialogRouter.post('/send-message', sendMessage)


export default dialogRouter