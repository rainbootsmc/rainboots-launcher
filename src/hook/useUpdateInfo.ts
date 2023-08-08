import { useCallback, useState } from 'react';
import { LauncherLog } from '../../api/log.ts';
import { useLog } from '~/hook/useLog.ts';

type UpdateInfo = {
  updateAvailable: boolean,
  completed: boolean,
  progressPercent: number
}

export const useUpdateInfo = (): UpdateInfo => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  const logHandler = useCallback((log: LauncherLog) => {
    switch (log.type) {
    case 'update-available':
      setUpdateAvailable(true);
      break;
    case 'update-completed':
      setCompleted(true);
      break;
    case 'update-progress':
      setProgress(log.percent);
      break;
    }
  }, []);
  useLog(logHandler);
  return { updateAvailable, completed, progressPercent: progress };
};
