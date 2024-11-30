class RoomManager {
  constructor() {
    this.rooms = new Map();
    this.startCleanupInterval();
  }

  startCleanupInterval() {
    setInterval(() => {
      const now = Date.now();
      for (const [roomId, room] of this.rooms.entries()) {
        if (now - room.lastActivity > 60 * 60 * 1000) {
          this.rooms.delete(roomId);
        }
      }
    }, 60 * 1000);
  }

  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  createRoom(roomId) {
    const room = {
      id: roomId,
      tasks: [],
      clients: new Set(),
      lastActivity: Date.now()
    };
    this.rooms.set(roomId, room);
    return room;
  }

  joinRoom(roomId, clientId) {
    let room = this.getRoom(roomId);
    if (!room) {
      room = this.createRoom(roomId);
    }
    room.clients.add(clientId);
    room.lastActivity = Date.now();
    return room;
  }

  updateRoom(roomId, tasks) {
    const room = this.getRoom(roomId);
    if (room) {
      room.tasks = tasks;
      room.lastActivity = Date.now();
    }
    return room;
  }

  leaveRoom(roomId, clientId) {
    const room = this.getRoom(roomId);
    if (room) {
      room.clients.delete(clientId);
      if (room.clients.size === 0) {
        this.rooms.delete(roomId);
      }
    }
  }
}

export default RoomManager;