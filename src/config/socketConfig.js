const { Server } = require('socket.io');

// Socket.io Config 객체. 서버를 props로 받음
function createSocketServer(server) {
    const io = new Server(server, {
        pingTimeout: 25000,
        pingInterval: 25000,
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
        transports: ['websocket']
    });

    return io;
}

module.exports = { createSocketServer };