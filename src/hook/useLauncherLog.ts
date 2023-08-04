import { LauncherListener } from '../../api/launcherListener.ts';
import { useCallback, useLayoutEffect, useRef } from 'react';
import { LauncherLog } from '../../api/log.ts';
import type { IpcRendererEvent } from 'electron';

type LauncherWindow = {
  launcher: {
    onLauncherLog: (callback: (e: IpcRendererEvent, log: LauncherLog) => void) => void
    offLauncherLog: (callback: (e: IpcRendererEvent, log: LauncherLog) => void) => void
  }
}

export const useLauncherLog = (listener: LauncherListener) => {
  const initializedRef = useRef(false);
  const handler = useCallback((_e: IpcRendererEvent, log: LauncherLog) => {
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
  useLayoutEffect(() => {
    if (initializedRef.current) {
      return;
    }
    initializedRef.current = true;
    const launcherWindow = window as never as LauncherWindow;
    launcherWindow.launcher.onLauncherLog(handler);
    return () => launcherWindow.launcher.offLauncherLog(handler);
  }, [handler]);
};
