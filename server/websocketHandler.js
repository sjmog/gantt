class WebSocketHandler {
  constructor(roomManager) {
    this.roomManager = roomManager;
  }

  handleConnection(ws) {
    let clientRoomId = null;

    ws.on('message', (data) => {
      const message = JSON.parse(data);
      
      switch (message.type) {
        case 'join':
          this.handleJoin(ws, message);
          clientRoomId = message.roomId;
          break;
        case 'update':
          this.handleUpdate(ws, message);
          break;
      }
    });

    ws.on('close', () => {
      if (clientRoomId) {
        this.roomManager.leaveRoom(clientRoomId, ws);
      }
    });
  }

  handleJoin(ws, message) {
    const room = this.roomManager.joinRoom(message.roomId, ws);
    ws.send(JSON.stringify({
      type: 'sync',
      roomId: message.roomId,
      data: { tasks: room.tasks }
    }));
  }

  handleUpdate(ws, message) {
    const room = this.roomManager.updateRoom(message.roomId, message.data.tasks);
    if (room) {
      this.broadcastUpdate(ws, room, message);
    }
  }

  broadcastUpdate(sender, room, message) {
    room.clients.forEach((client) => {
      if (client !== sender && client.readyState === 1) {
        client.send(JSON.stringify({
          type: 'update',
          roomId: message.roomId,
          data: { tasks: room.tasks }
        }));
      }
    });
  }
}

export default WebSocketHandler;