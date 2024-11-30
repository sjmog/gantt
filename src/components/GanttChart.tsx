import React, { useEffect, useRef, useState } from 'react';
import { format, addDays, startOfDay, differenceInDays } from 'date-fns';
import { Task } from '../types';
import { Download, Trash2 } from 'lucide-react';
import * as htmlToImage from 'html-to-image';

interface GanttChartProps {
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export function GanttChart({ tasks, onUpdateTask, onDeleteTask }: GanttChartProps) {
  const [startDate] = useState(startOfDay(new Date()));
  const chartRef = useRef<HTMLDivElement>(null);
  const daysToShow = 30;

  const exportChart = async () => {
    if (chartRef.current) {
      const dataUrl = await htmlToImage.toJpeg(chartRef.current);
      const link = document.createElement('a');
      link.download = `gantt-chart-${format(new Date(), 'yyyy-MM-dd')}.jpeg`;
      link.href = dataUrl;
      link.click();
    }
  };

  const handleTaskDrag = (taskId: string, newStartDay: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const duration = differenceInDays(new Date(task.endDate), new Date(task.startDate));
      const newStartDate = addDays(startDate, newStartDay);
      const newEndDate = addDays(newStartDate, duration);
      
      onUpdateTask({
        ...task,
        startDate: newStartDate.toISOString(),
        endDate: newEndDate.toISOString(),
      });
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Gantt Chart</h2>
        <button
          onClick={exportChart}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Download size={16} />
          Export as JPEG
        </button>
      </div>

      <div className="overflow-x-auto" ref={chartRef}>
        <div className="min-w-max">
          {/* Timeline header */}
          <div className="flex border-b">
            <div className="w-48 p-2 font-semibold">Task</div>
            {Array.from({ length: daysToShow }).map((_, index) => (
              <div
                key={index}
                className="w-16 p-2 text-center text-sm border-l"
              >
                {format(addDays(startDate, index), 'MMM d')}
              </div>
            ))}
          </div>

          {/* Tasks */}
          {tasks.map((task) => (
            <div key={task.id} className="flex border-b hover:bg-gray-50">
              <div className="w-48 p-2 flex items-center justify-between">
                <span>{task.title}</span>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="flex-1 relative h-12">
                {Array.from({ length: daysToShow }).map((_, index) => (
                  <div
                    key={index}
                    className="absolute top-0 bottom-0 w-16 border-l"
                    style={{ left: `${index * 4}rem` }}
                  />
                ))}
                <div
                  className="absolute top-2 h-8 rounded-md cursor-move"
                  style={{
                    left: `${differenceInDays(new Date(task.startDate), startDate) * 4}rem`,
                    width: `${differenceInDays(new Date(task.endDate), new Date(task.startDate)) * 4}rem`,
                    backgroundColor: task.color,
                  }}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', task.id);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}