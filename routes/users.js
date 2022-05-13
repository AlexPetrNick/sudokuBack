import express from 'express'
import {changeUserHandler, loadImageCut, loadImageOrigin} from "../common/Controller/userController.js";
import {mainMultier} from "../middleware/multerUpload.js";


const router = new express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.put('/change_user', changeUserHandler)
router.post('/upload_image_origin', mainMultier.single('avatar'), loadImageOrigin)
router.post('/upload_image_cut', mainMultier.single('avatar'), loadImageCut)

export default router;
