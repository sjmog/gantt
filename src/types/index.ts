export interface Task {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  color: string;
}

export interface Room {
  id: string;
  tasks: Task[];
  lastActivity: number;
}

export type WebSocketMessage = {
  type: 'join' | 'update' | 'sync' | 'error';
  roomId: string;
  data?: any;
};