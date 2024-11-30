import { createServer } from 'http';
import { Server } from 'socket.io';
import RoomManager from './roomManager.js';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const roomManager = new RoomManager();

io.on('connection', (socket) => {
  let currentRoomId = null;

  socket.on('join', ({ roomId }) => {
    currentRoomId = roomId;
    const room = roomManager.joinRoom(roomId, socket.id);
    socket.join(roomId);
    socket.emit('sync', { tasks: room.tasks });
  });

  socket.on('update', ({ roomId, tasks }) => {
    const room = roomManager.updateRoom(roomId, tasks);
    if (room) {
      socket.to(roomId).emit('update', { tasks: room.tasks });
    }
  });

  socket.on('disconnect', () => {
    if (currentRoomId) {
      roomManager.leaveRoom(currentRoomId, socket.id);
    }
  });
});

httpServer.listen(3001);