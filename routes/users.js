import express from 'express'
import {changeUserHandler} from "../common/Controller/userController.js";


const router = new express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.put('/change_user', changeUserHandler)

export default router;
