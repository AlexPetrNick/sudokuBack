import {Router} from "express";
import {deleteMessage, editMessage, getDialogInfo, sendMessage} from "../../common/Controller/dialogController.js";
import {authMiddleware} from "../../middleware/authMiddleware.js";


const dialogRouter = new Router()

dialogRouter.get('/get-dialog-info', getDialogInfo)
dialogRouter.post('/send-message', sendMessage)
dialogRouter.put('/edit_message', editMessage)
dialogRouter.delete('/delete_message', deleteMessage)


export default dialogRouter