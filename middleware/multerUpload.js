import multer from 'multer'
import fs from 'fs'
import {log} from "debug";
import {getDataAccessToken} from "../common/added/workerToken.js";
import {conf} from "../config/config.js";

const getUserInfo = (req) => {
    return getDataAccessToken(req.headers.authorization.split(' ')[1])
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        const { userId } = getUserInfo(req)
        const pathImg = conf.pathImagesUpload
        const files = fs.readdirSync(pathImg);
        if (!files.includes(userId)) {
            fs.mkdir(pathImg + userId, err => {
                if(err) throw err; // не удалось создать папку
                console.log('Папка успешно создана');
            });
        }
        cb(null, pathImg + userId + '/')
    },
    filename(req, file, cb) {
        const { userId } = getUserInfo(req)
        const pathImg = conf.pathImagesUpload + `${userId}/`
        const files = fs.readdirSync(pathImg)
        let filterImage = []
        if (file.originalname.split('.')[0] === conf.nameAddOriginImage) {
            filterImage = files.filter(img => img.includes(conf.nameAddOriginImage))
        } else {
            filterImage = files.filter(img => !img.includes(conf.nameAddOriginImage))
        }
        filterImage.map(img => fs.unlinkSync(pathImg + img))
        cb(null, file.originalname)
    },
})

export const mainMultier = multer({storage})

