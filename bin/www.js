#!/usr/bin/env node
import app from '../app.js'
import debug, {log} from 'debug'
import http from 'http'
import mongoose from 'mongoose'

let normalizePort = (val) => {
    let port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

let onError = (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
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


let port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
let server = http.createServer(app);

const startApp = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/mongo')
        server.listen(port);
        server.on('error', onError);
        server.on('listening', onListening);
    } catch (e) {
        console.log(e)
    }
}

startApp()

