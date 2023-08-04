import { IpcRendererEvent } from 'electron';
import { MinecraftUserData } from '../../api/auth.ts';
import { useCallback, useLayoutEffect } from 'react';

type LauncherWindow = {
  launcher: {
    onUserUpdate: (callback: (e: IpcRendererEvent, data: MinecraftUserData) => void) => void
    offUserUpdate: (callback: (e: IpcRendererEvent, data: MinecraftUserData) => void) => void
  }
}

export const useAuthListener = (listener: (data: MinecraftUserData) => void) => {
  const callback = useCallback((_e: IpcRendererEvent, data: MinecraftUserData) => {
    listener(data);
  }, [listener]);
  useLayoutEffect(() => {
    const launcherWindow = window as never as LauncherWindow;
    launcherWindow.launcher.onUserUpdate(callback);
    return () => launcherWindow.launcher.offUserUpdate(callback);
  }, [callback]);
};
