const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

io.on('connection', (socket) => {
    socket.on('create-room', payload => {

        try {
            payload = JSON.parse(payload)

            const { roomName } = payload
            await socket.join(roomName)

            socket.to(roomName).emit(`${roomName}-callback`, JSON.stringify({ status: 1, message: "success create room" }))
        } catch (error) {
            socket.to(roomName).emit(`${roomName}-callback`, JSON.stringify({ status: 0, message: "failed create room" }))
        }
    })

    socket.on('leave-room', payload => {
        try {
            payload = JSON.parse(payload)

            const { roomName } = payload
            await socket.leave(roomName)
        } catch (error) {
        }
    })

    socket.on('listen-room', payload => {
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