const fs = require('fs');
const express = require('express');
const app = express();
const http = require('http');

// var privateKey = fs.readFileSync('key.pem');
// var certificate = fs.readFileSync('cert.pem');

const server = http.createServer(app)
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: '*' } });

app.get('/', (req, res) => {
    return res.json({ message: 'hello' })
})

io.on('connection', async (socket) => {
    socket.on('create-room', payload => {

        try {
            payload = JSON.parse(payload)

            const { roomName } = payload
            socket.join(roomName)

            socket.to(roomName).emit(`${roomName}-callback`, JSON.stringify({ status: 1, message: "success create room" }))
        } catch (error) {
            socket.to(roomName).emit(`${roomName}-callback`, JSON.stringify({ status: 0, message: "failed create room" }))
        }
    })

    socket.on('leave-room', async (payload) => {
        try {
            payload = JSON.parse(payload)

            const { roomName } = payload
            socket.leave(roomName)
        } catch (error) {
        }
    })

    socket.on('listen-room', async (payload) => {
        try {
            payload = JSON.parse(payload)

            const { roomName, data } = payload
            socket.to(`${roomName}`).emit(data)
        } catch (error) {
            console.log(error)
        }
    })
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});