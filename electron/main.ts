import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { getAppDataDir } from '../api/util/paths.ts';
import storage from 'electron-json-storage';
import { createIPCHandler } from 'electron-trpc/main';
import { appRouter } from '../api/trpc.ts';
import { autoUpdater } from 'electron-updater';

process.env.DIST = path.join(__dirname, '../dist');
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public');

export let mainWindow: BrowserWindow | null;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

async function createWindow() {
  await autoUpdater.checkForUpdatesAndNotify();

  mainWindow = new BrowserWindow({
    icon: path.join(process.env.PUBLIC, 'electron-vite.svg'),
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
