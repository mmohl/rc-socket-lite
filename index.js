const app = require('express')();
const server = require('http').createServer(app);
const options = { cors: { origin: '*' } };
const io = require('socket.io')(server, options);
const port = process.env.PORT || 3000;
const redis = require('socket.io-redis');

app.get('/', (req, res) => {
    res.json({ message: 'hai' })
});

io.adapter(redis(process.env.HEROKU_REDIS_COBALT_URL || 'redis://:p9b0431dbc26a3bb78405248f6c9ae30d722672c70a815ad301bd265020467bec@ec2-108-128-96-163.eu-west-1.compute.amazonaws.com:14429'));

io.on('connection', (socket) => {
    console.log(socket?.adapter?.rooms)
    socket.on('make-room', payload => {
        console.log(payload)
        // payload = JSON.parse(payload)
        
        const { roomName } = payload
        console.log(roomName)
        // io.sockets.adapter.rooms.get("room name")

        socket.join(roomName)


        // socket.emit(`${roomName}-callback`, JSON.stringify({ status: 1, message: "success create room" }))
        // socket.to(roomName).emit(`listen-room`, 'hai')
        // try {
        // } catch (error) {
        //     console.error(error)
        //     socket.to(`${roomName}`).emit(`${roomName}-callback`, JSON.stringify({ status: 0, message: "failed create room" }))
        // }
        socket.to(`${roomName}`).emit(`${roomName}-callback`, 'hai, it from server on created')
    })

    socket.on('join', payload => {
        payload = JSON.parse(payload)
        const { roomName } = payload
        console.log(roomName)

        socket.join(`${roomName}`)

        // socket.emit(`${roomName}-callback`, JSON.stringify({ status: 1, message: "success create room" }))
        socket.to(`${roomName}`).emit(`${roomName}-callback`, 'hai, it from server on join')
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