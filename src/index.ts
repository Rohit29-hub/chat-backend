import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import userRoute from './routes/userRoute'
import messageRoute from './routes/messageRoute';
import { connect_to_db } from './config/db';
import { jwtDecode } from 'jwt-decode';

connect_to_db();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: '*',
        credentials: true
    },
});

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cors());

// the list of online users
const online_users = new Map();

io.on('connection', (socket) => {
    const token = socket.handshake.auth.token;
    const { profile }: any = jwtDecode(token);
    online_users.set(socket.id, profile);

    io.emit('online_users', Array.from(online_users));

    socket.on('message', (payload) => {
        io.to(payload.socketinfo.receiver).emit("message", payload);
    })

    socket.on('disconnect', () => {
        online_users.delete(socket.id);
        socket.disconnect();
        io.emit('all_users', Array.from(online_users));
    })

});

// *** routing ***
app.use('/api/user', userRoute);
app.use('/api/message', messageRoute);

httpServer.listen(8000, () => console.log('Server running on http://localhost:8000'));
