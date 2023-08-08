import { z } from 'zod';

export const DataLog = z.object({
  type: z.literal('data'),
  message: z.string(),
});

export const DebugLog = z.object({
  type: z.literal('debug'),
  message: z.string(),
});

export const ProgressLog = z.object({
  type: z.literal('progress'),
  progressType: z.string(),
  task: z.number(),
  total: z.number(),
});

export const CloseLog = z.object({
  type: z.literal('close'),
});

export const UpdateAvailableLog = z.object({
  type: z.literal('update-available'),
});

export const UpdateProgressLog = z.object({
  type: z.literal('update-progress'),
  percent: z.number(),
});

export const UpdateCompletedLog = z.object({
  type: z.literal('update-completed'),
});

export const LauncherLog = z.union([
  DataLog,
  DebugLog,
  ProgressLog,
  CloseLog,
  UpdateAvailableLog,
  UpdateProgressLog,
  UpdateCompletedLog,
]);

export type DataLog = z.infer<typeof DataLog>
export type DebugLog = z.infer<typeof DebugLog>
export type ProgressLog = z.infer<typeof ProgressLog>
export type CloseLog = z.infer<typeof CloseLog>
export type LauncherLog = z.infer<typeof LauncherLog>
export type UpdateAvailableLog = z.infer<typeof UpdateAvailableLog>
export type UpdateProgressLog = z.infer<typeof UpdateProgressLog>
export type UpdateCompletedLog = z.infer<typeof UpdateCompletedLog>
