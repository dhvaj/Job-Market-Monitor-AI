import { LogEntry } from '../types';

export const createLog = (
  level: LogEntry['level'],
  message: string
): LogEntry => ({
  id: Math.random().toString(36).substring(7),
  timestamp: new Date(),
  level,
  message,
});
