import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import collaboratorRoutes from "./routes/collaboratorRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();
app.use(cors());

// app.use(express.json());
app.use(express.json({limit: '50mb'}));

dotenv.config();

connectDB();

app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/collaborators', collaboratorRoutes);
app.use('/api/tasks', taskRoutes);

app.use('/uploads', express.static(path.resolve('uploads')));

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
    console.log('Servidor iniciado en el puerto: ' + PORT);
});

// Definir Socket.io
import { Server } from "socket.io";

const io = new Server(server, {
    cors: {
        origin: true,
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('Conectado a Socket.io');

    socket.on('load projects', (user) => {
        socket.join(user);
    });

    socket.on('editing projects', () => {
        io.emit('edited projects');
    });

    socket.on('edit profile', () => {
        io.emit('edited profile');
    });

    socket.on('editing collaborators', () => {
        io.emit('edited contributors');
    });
});