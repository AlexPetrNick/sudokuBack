import multer from 'multer'
import fs from 'fs'
import {log} from "debug";
import {getDataAccessToken} from "../common/added/workerToken.js";
import {conf} from "../config/config.js";



const storage = multer.diskStorage({
    destination(req, file, cb) {
        const {userId, ...dataToken} = getDataAccessToken(req.headers.authorization.split(' ')[1])
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
        console.log(req.headers)
        console.log(file)
        const extendFile = '.' + file.originalname.split('.')[1]
        const namefile = new Date().getTime().toString().replace('.','') + extendFile
        cb(null, namefile)
    },
})

export const mainMultier = multer({storage})

