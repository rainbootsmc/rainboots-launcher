import { z } from 'zod';

const ProgressArgs = z.object({
  type: z.string(),
  task: z.number(),
  total: z.number(),
});

export const LauncherListener = z.object({
  onDataLog: z.function().args(z.string()),
  onDebugLog: z.function().args(z.string()),
  onProgress: z.function().args(ProgressArgs),
  onClose: z.function(),
});

export type LauncherListener = z.infer<typeof LauncherListener>
