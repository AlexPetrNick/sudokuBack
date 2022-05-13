import express from 'express'
import path, {dirname} from 'path'
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from 'cors'

import indexRouter from './routes/index.js'
import usersRouter from './routes/users.js'
import routerAuth from "./routes/authControl/authRouter.js";
import menuRouter from "./routes/menuControl/menuRouter.js";
import dialogRouter from "./routes/dialogControl/dialogRouter.js";
import multer from "multer";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(
    '/images',
    express.static(`${__dirname}/images/upload`)
);




const corsOptions = {
    origin: 'http://localhost:4000',
    // origin: true,
    credentials: true,
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))


app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/auth', routerAuth)
app.use('/menu', menuRouter)
app.use('/dialog', dialogRouter)


export default app