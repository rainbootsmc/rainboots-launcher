import { getLaunchContext } from './initEnv';
import path from 'path';
import { getJavaRuntimeDir } from './util/paths';
import { Client, ILauncherOptions, IUser } from 'minecraft-launcher-core';
import { mainWindow } from '../electron/main.ts';
import { CloseLog, DataLog, DebugLog, ProgressLog } from './log.ts';

export const launchGame = async (user: IUser) => {
  const launchContext = await getLaunchContext();
  if (launchContext == undefined) {
    return;
  }
  const { profileName, version, settings, instanceDir } = launchContext;
  const javaPath: string = settings.javaPath.length > 0
    ? settings.javaPath
    : path.join(getJavaRuntimeDir(), 'bin', 'java');
  const options: ILauncherOptions = {
    clientPackage: undefined,
    authorization: new Promise(resolve => resolve(user)),
    root: instanceDir,
    javaPath: javaPath,
    version: {
      number: version.minecraft,
      type: 'release',
      custom: profileName,
    },
    window: {
      width: settings.window.width,
      height: settings.window.height,
      fullscreen: settings.window.fullscreen,
    },
    memory: {
      min: `${settings.memory.min}M`,
      max: `${settings.memory.max}M`,
    },
  };

  const client = new Client();

  client.on('data', e => {
    mainWindow?.webContents.send('launcher-log', { type: 'data', message: e } as DataLog);
  });
  client.on('debug', e => {
    mainWindow?.webContents.send('launcher-log', { type: 'debug', message: e } as DebugLog);
  });
  client.on('progress', e => {
    mainWindow?.webContents.send('launcher-log', {
      type: 'progress',
      progressType: e.type as string,
      task: e.task as number,
      total: e.total as number,
    } as ProgressLog);
  });
  client.on('close', () => {
    mainWindow?.webContents.send('launcher-log', { type: 'close' } as CloseLog);
  });

  await client.launch(options);
};
