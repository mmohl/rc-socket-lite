const app = require('express')();
const server = require('http').createServer(app);
const options = { cors: { origin: '*' } };
const io = require('socket.io')(server, options);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.json({ message: 'hai' })
});

io.on('connection', (socket) => {
    console.log(socket?.adapter?.rooms)
    socket.on('make-room', payload => {
        console.log(payload)
        // payload = JSON.parse(payload)
        
        const { roomName } = payload
        // io.sockets.adapter.rooms.get("room name")

        socket.join(roomName)

        // console.log('created')

        // socket.emit(`${roomName}-callback`, JSON.stringify({ status: 1, message: "success create room" }))
        socket.to(roomName).emit(`listen-room`, 'hai')
        // try {
        // } catch (error) {
        //     console.error(error)
        //     socket.to(`${roomName}`).emit(`${roomName}-callback`, JSON.stringify({ status: 0, message: "failed create room" }))
        // }
    })

    socket.on('join', payload => {
        payload = JSON.parse(payload)

        const { roomName } = payload

        socket.join(`${roomName}`)

        // socket.emit(`${roomName}-callback`, JSON.stringify({ status: 1, message: "success create room" }))
        socket.to(`${roomName}`).emit(`listen-room`, 'hai')
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

server.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});