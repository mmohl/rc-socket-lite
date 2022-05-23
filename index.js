const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const port = 3000;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

app.get('/', (req, res) => {
    res.json({ message: 'hai' })
});

io.on('connection', (socket) => {
    socket.on('make-room', payload => {
        payload = JSON.parse(payload)

        const { roomName } = payload

        socket.join(`${roomName}`)

        console.log('created')

        socket.to(`${roomName}`).emit(`${roomName}-callback`, JSON.stringify({ status: 1, message: "success create room" }))
        // try {
        // } catch (error) {
        //     console.error(error)
        //     socket.to(`${roomName}`).emit(`${roomName}-callback`, JSON.stringify({ status: 0, message: "failed create room" }))
        // }
    })

    socket.on('quit-room', (payload) => {
        try {
            payload = JSON.parse(payload)

            const { roomName } = payload
            socket.leave(`${roomName}`)
        } catch (error) {
        }
    })

    socket.on('listen-room', (payload) => {
        try {
            payload = JSON.parse(payload)

            const { roomName, data } = payload
            socket.to(`${roomName}`).emit(data)
        } catch (error) {
            console.log(error)
        }
    })
});

httpServer.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});