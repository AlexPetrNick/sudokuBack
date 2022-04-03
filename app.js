import express from 'express'
import path, {dirname} from 'path'
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import indexRouter from './routes/index.js'
import usersRouter from './routes/users.js'
import routerAuth from "./routes/authControl/authRouter.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', routerAuth)

export default app