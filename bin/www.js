#!/usr/bin/env node
import debug, {log} from 'debug'
import mongoose from 'mongoose'
import http from "http";
import app from "../app.js";
import {generateSudoku} from "../common/Controller/sudokuController.js";


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

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
const server = http.createServer(app);


const startApp = async () => {
    try {
        const dbconnect = await mongoose.connect('mongodb://localhost:27017/Sudoku')
            .catch(e => {
                console.log(e)
            })
        server.listen(3000);
        server.on('error', onError);
        server.on('listening', onListening);
        // await generateSudoku(1000)
    } catch (e) {
        console.log(e)
    }
}

startApp()
