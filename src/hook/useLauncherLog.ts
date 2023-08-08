import { LauncherListener } from '../../api/launcherListener.ts';
import { useCallback } from 'react';
import { LauncherLog } from '../../api/log.ts';
import { useLog } from '~/hook/useLog.ts';

export const useLauncherLog = (listener: LauncherListener) => {
  const handler = useCallback((log: LauncherLog) => {
    switch (log.type) {
    case 'data':
      listener.onDataLog(log.message);
      break;
    case 'debug':
      listener.onDebugLog(log.message);
      break;
    case 'progress':
      listener.onProgress({ type: log.progressType, task: log.task, total: log.total });
      break;
    case 'close':
      listener.onClose();
      break;
    }
  }, [listener]);
  useLog(handler);
};
