#!/usr/bin/env node
import app from '../app.js'
import debug, {log} from 'debug'
import http from 'http'
import mongoose from 'mongoose'
import {Server} from 'socket.io'
import {messageHandler} from "../socket/messageHandler.js";
import User from "../models/User.js";
import SocketUser from "../models/SocketUser.js";


let normalizePort = (val) => {
    let port = parseInt(val, 10);
    if (isNaN(port)) return val
    if (port >= 0) return port;
    return false;
}

let onError = (error) => {
    if (error.syscall !== 'listen') throw error;
    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

let onListening = () => {
    let addr = server.address();
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

let client = 0
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        allowEIO3: true,
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,

    },
    transport: ['websocket']
});

const startApp = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/mongo')
        server.listen(3000);
        server.on('error', onError);
        server.on('listening', onListening);

        const handleConnect = (socket) => {
            console.log('A user connected')
            new Promise((res, rej) => {
                res(SocketUser.find({userId: socket.handshake.query.idUser}))
            })
                .then(data => {
                    if (data.length) {
                        new Promise((res, rej) => {
                            res(SocketUser.deleteMany({userId: socket.handshake.query.idUser}))
                        })
                    }
                })
                .then(() => {
                    SocketUser.insertMany({
                        userId: socket.handshake.query.idUser,
                        socketId: socket.id
                    })
                })

            messageHandler(io, socket)

            socket.on('joinRoom', (room) => {
                socket.join(room)
                socket.to(room).emit('hi:user', room)
            })

            socket.on('disconnect', function () {
                console.log('user disconnected');
                    new Promise((res, rej) => {
                        res(SocketUser.deleteMany({userId: socket.handshake.query.idUser}))
                    })
            });
        }

        io.on('connection', handleConnect)


    } catch (e) {
        console.log(e)
    }
}

startApp()

