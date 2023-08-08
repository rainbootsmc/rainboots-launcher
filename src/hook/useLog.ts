import { LauncherLog } from '../../api/log.ts';
import { useCallback, useLayoutEffect, useRef } from 'react';
import { IpcRendererEvent } from 'electron';

type LauncherWindow = {
  launcher: {
    onLauncherLog: (callback: (e: IpcRendererEvent, log: LauncherLog) => void) => void
    offLauncherLog: (callback: (e: IpcRendererEvent, log: LauncherLog) => void) => void
  }
}

export const useLog = (handler: (log: LauncherLog) => void) => {
  const initializedRef = useRef(false);
  const internalHandler = useCallback((_e: IpcRendererEvent, log: LauncherLog) => handler(log), [handler]);
  useLayoutEffect(() => {
    if (initializedRef.current) {
      return;
    }
    initializedRef.current = true;

    const launcherWindow = window as never as LauncherWindow;
    launcherWindow.launcher.onLauncherLog(internalHandler);
    return () => launcherWindow.launcher.offLauncherLog(internalHandler);
  }, [handler, internalHandler]);
};
