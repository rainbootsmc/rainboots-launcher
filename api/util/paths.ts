import { app } from 'electron';
import path from 'path';

export const getAppDataDir = (): string => {
  return app.getPath('userData');
};

export const getJavaRuntimeDir = (): string => {
  return path.join(getAppDataDir(), 'Jre');
};

export const getInstanceDir = (): string => {
  return path.join(getAppDataDir(), 'Minecraft');
};
