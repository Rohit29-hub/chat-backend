import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import userRoute from './routes/userRoute'
import messageRoute from './routes/messageRoute';
import { connect_to_db } from './config/db';
import { jwtDecode } from 'jwt-decode';
import { updateUser } from './helper';

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

function findSocketId(receiverId: string) {
    for (const [key, value] of online_users.entries()) {
        if (value.user === receiverId) {
            return key;
        }
    }
    return null;
}


io.on('connection', (socket) => {
    try {
        const token = socket.handshake.auth.token.toString();
        const { profile }: any = jwtDecode(token);

        // Add or update the profile with an `online` field set to true
        updateUser(online_users, profile, socket.id);

        // Broadcast the updated list of online users
        io.emit('online_users', Array.from(online_users));

        // Listen for messages
        socket.on('message', (payload) => {
            const socketId = findSocketId(payload.receiver);
            if (socketId) {
                io.to(socketId).emit("message", payload);
            }
        });

        // On disconnect
        socket.on('disconnect', () => {
            const userProfile = online_users.get(socket.id);
            userProfile.status = 'offline';
            io.emit('online_users', Array.from(online_users));
        });

    } catch (error) {
        console.error('Error during connection:', error);
    }
});

// *** routing ***
app.use('/api/user', userRoute);
app.use('/api/message', messageRoute);

httpServer.listen(8000, () => console.log('Server running on http://localhost:8000'));
