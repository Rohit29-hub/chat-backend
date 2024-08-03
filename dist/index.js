"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const messageRoute_1 = __importDefault(require("./routes/messageRoute"));
const db_1 = require("./config/db");
const jwt_decode_1 = require("jwt-decode");
(0, db_1.connect_to_db)();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '*',
        credentials: true
    },
});
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// the list of online users
const online_users = new Map();
io.on('connection', (socket) => {
    const token = socket.handshake.auth.token;
    const { profile } = (0, jwt_decode_1.jwtDecode)(token);
    online_users.set(socket.id, profile);
    io.emit('online_users', Array.from(online_users));
    socket.on('message', (payload) => {
        io.to(payload.socketinfo.receiver).emit("message", payload);
    });
    socket.on('disconnect', () => {
        online_users.delete(socket.id);
        socket.disconnect();
        io.emit('all_users', Array.from(online_users));
    });
});
// *** routing ***
app.use('/api/user', userRoute_1.default);
app.use('/api/message', messageRoute_1.default);
httpServer.listen(8000, () => console.log('Server running on http://localhost:8000'));
