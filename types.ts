export interface DeviceState {
  status: 'online' | 'offline' | 'booting' | 'shutting_down';
  ipAddress: string;
  macAddress: string;
  lastSeen: string;
  cpuLoad: number;
  temp: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'ai';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}