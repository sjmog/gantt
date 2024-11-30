import React, { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { RoomEntry } from './components/RoomEntry';
import { GanttChart } from './components/GanttChart';
import { TaskForm } from './components/TaskForm';
import { Task } from './types';

function App() {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  const connectToRoom = useCallback((roomId: string) => {
    const socket = io('http://localhost:3001');

    socket.on('connect', () => {
      socket.emit('join', { roomId });
    });

    socket.on('sync', ({ tasks }) => {
      setTasks(tasks);
    });

    socket.on('update', ({ tasks }) => {
      setTasks(tasks);
    });

    socket.on('disconnect', () => {
      setTimeout(() => connectToRoom(roomId), 1000);
    });

    setSocket(socket);
  }, []);

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  const handleJoinRoom = (newRoomId: string) => {
    setRoomId(newRoomId);
    connectToRoom(newRoomId);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    const newTasks = tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(newTasks);
    socket?.emit('update', { roomId, tasks: newTasks });
  };

  const handleAddTask = (newTask: Task) => {
    const newTasks = [...tasks, newTask];
    setTasks(newTasks);
    socket?.emit('update', { roomId, tasks: newTasks });
  };

  const handleDeleteTask = (taskId: string) => {
    const newTasks = tasks.filter(task => task.id !== taskId);
    setTasks(newTasks);
    socket?.emit('update', { roomId, tasks: newTasks });
  };

  if (!roomId) {
    return <RoomEntry onJoinRoom={handleJoinRoom} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-indigo-600 text-white p-4">
        <h1 className="text-2xl font-bold">Room: {roomId}</h1>
      </header>
      <main>
        <TaskForm onAddTask={handleAddTask} />
        <GanttChart
          tasks={tasks}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      </main>
    </div>
  );
}

export default App;