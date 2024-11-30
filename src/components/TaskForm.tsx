import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { nanoid } from 'nanoid';

interface TaskFormProps {
  onAddTask: (task: any) => void;
}

const COLORS = [
  '#60A5FA', // blue-400
  '#34D399', // emerald-400
  '#F87171', // red-400
  '#FBBF24', // amber-400
  '#A78BFA', // violet-400
];

export function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 3); // Default duration: 3 days

      onAddTask({
        id: nanoid(),
        title: title.trim(),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-b">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter task name"
        className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        type="submit"
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        <Plus size={16} />
        Add Task
      </button>
    </form>
  );
}