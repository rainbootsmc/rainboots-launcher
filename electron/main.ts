import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { getAppDataDir } from '../api/util/paths.ts';
import storage from 'electron-json-storage';
import { createIPCHandler } from 'electron-trpc/main';
import { appRouter } from '../api/trpc.ts';
import { autoUpdater } from 'electron-updater';
import Logger, { ElectronLog } from 'electron-log';
import { UpdateAvailableLog, UpdateCompletedLog, UpdateProgressLog } from '../api/log.ts';

process.env.DIST = path.join(__dirname, '../dist');
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public');

export let mainWindow: BrowserWindow | null;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

async function createWindow() {
  autoUpdater.logger = Logger;
  (autoUpdater.logger as ElectronLog).transports.file.level = 'info';
  autoUpdater.forceDevUpdateConfig = true;

  autoUpdater.on('update-available', () => {
    mainWindow?.webContents.send('launcher-log', { type: 'update-available' } as UpdateAvailableLog);
  });

  autoUpdater.on('download-progress', info => {
    mainWindow?.webContents.send('launcher-log', { type: 'update-progress', percent: info.percent } as UpdateProgressLog);
  });

  autoUpdater.on('update-downloaded', () => {
    mainWindow?.webContents.send('launcher-log', { type: 'update-completed' } as UpdateCompletedLog);
  });

  autoUpdater.checkForUpdates().then();

  mainWindow = new BrowserWindow({
    icon: path.join(process.env.PUBLIC, 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: true,
      devTools: true,
    },
    titleBarStyle: 'hidden',
    resizable: false,
    backgroundColor: '#1c1f21',
    width: 768,
    height: 480,
  });

  mainWindow.setMenuBarVisibility(false);


  createIPCHandler({ router: appRouter, windows: [mainWindow] });

  if (VITE_DEV_SERVER_URL) {
    await mainWindow.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // await mainWindow.loadFile('dist/index.html');
    await mainWindow.loadFile(path.join(process.env.DIST, 'index.html'));
  }
}

app.on('window-all-closed', () => {
  mainWindow = null;
});

app.whenReady().then(createWindow);

storage.setDataPath(getAppDataDir());
