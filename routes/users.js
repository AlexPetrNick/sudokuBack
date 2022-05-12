import express from 'express'
import {changeUserHandler, loadImage} from "../common/Controller/userController.js";
import {mainMultier} from "../middleware/multerUpload.js";


const router = new express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.put('/change_user', changeUserHandler)
router.post('/upload_image', mainMultier.single('avatar'), loadImage)

export default router;
