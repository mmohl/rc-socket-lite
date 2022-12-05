const app = require('express')();
const server = require('http').createServer(app);
const options = { cors: { origin: '*' } };
const io = require('socket.io')(server, options);
const port = process.env.PORT || 3000;
const redis = require('socket.io-redis');
const os = require('os')

app.get('/', (req, res) => {
    res.json({ message: 'hai' })
});

io.adapter(redis(process.env.REDIS_TLS_URL));

io.on('connection', (socket) => {
    // console.log(socket?.adapter?.rooms)
    socket.on('make-room', payload => {

        console.log(payload)
        // payload = JSON.parse(payload)

        const { roomName } = payload
        socket.join(roomName)

        let isRoomExists = true
        socket.to(`${roomName}`).emit(`${roomName}-callback`, JSON.stringify({ status: 1, message: isRoomExists ? "success create room" : 'success join room' }))
        // socket.to(roomName).emit(`listen-room`, 'hai')
        // try {
        // } catch (error) {
        //     console.error(error)
        //     socket.to(`${roomName}`).emit(`${roomName}-callback`, JSON.stringify({ status: 0, message: "failed create room" }))
        // }
        // socket.to(`${roomName}`).emit(`${roomName}-callback`, 'hai, it from server on created')
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
            const { roomName } = payload
            console.log(`quit room: ${roomName}`)
            socket.leave(`${roomName}`)
            socket.close()
        } catch (error) {
        }
    })

    socket.on('listen-room', (payload) => {
        try {
            const { roomName } = payload
            console.log(payload)
            socket.to(`${roomName}`).emit(`${roomName}-callback`, JSON.stringify({ ...payload }))
        } catch (error) {
            console.log(error)
        }
    })

    socket.on('update-progress', (payload) => {
        try {
            let totalRAM = os.totalmem()
            let totalMem = (totalRAM / (1024 * 1024))
            let freeRAM = os.freemem()
            let totalFreeMem = (freeRAM / (1024 * 1024))

            const { roomName } = payload
            console.log(payload)

            console.log(`RAM: ${totalFreeMem}/${totalMem}`)
            socket.to(`${roomName}`).emit(`${roomName}-callback`, JSON.stringify({ ...payload }))
        } catch (error) {
            console.log(error)
        }
    })
});

server.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});