const socketIO = require('socket.io');

let io;

const initSocket = (server) => {
    io = socketIO(server, {
        cors: {
            origin: [process.env.FRONTEND_URL, process.env.ADMIN_URL],
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        console.log('🔌 New socket connection:', socket.id);

        // Admin joins
        socket.on('admin_join', () => {
            socket.join('admin_room');
            console.log('👤 Admin joined room');
        });

        // User joins
        socket.on('user_join', (userId) => {
            socket.join(`user_${userId}`);
            console.log(`👤 User ${userId} joined`);
        });

        // Disconnect
        socket.on('disconnect', () => {
            console.log('❌ Socket disconnected:', socket.id);
        });
    });
