import { z } from 'zod';

// Zod Schema (simulating Pydantic)
export const JobSchema = z.object({
  id: z.string(),
  title: z.string(),
  company: z.string(),
  location: z.string(),
  description: z.string(),
  postedAt: z.string(),
  salary: z.string().optional(),
});

export type Job = z.infer<typeof JobSchema>;

export interface ScrapeResult {
  success: boolean;
  data?: Job[];
  error?: string;
}

export interface AnalysisResult {
  jobId: string;
  rating: number;
  reasoning: string;
  keyMatch: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export interface UserSettings {
  skills: string;
  discordWebhook: string;
  minRatingForNotify: number;
}
