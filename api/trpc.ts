import { initTRPC } from '@trpc/server';
import { mainWindow } from '../electron/main.ts';
import { getLaunchContext, initEnv } from './initEnv.ts';
import { installJre } from './jre/installJre.ts';
import { ZodMclcUser } from './util/auth.ts';
import { IUser } from 'minecraft-launcher-core';
import { launchGame } from './launch.ts';
import { app, shell } from 'electron';
import { getInstanceDir } from './util/paths.ts';
import path from 'path';
import { getCachedUser, logout, refreshOrLoginMclcUser } from './auth.ts';
import { getSettings, settingsFilePath } from './settings.ts';

const t = initTRPC.create({ isServer: true });
const procedure = t.procedure;

export const appRouter = t.router({
  closeWindow: procedure.mutation(() => app.quit()),
  minimizeWindow: procedure.mutation(() => mainWindow?.minimize()),
  openInstanceDir: procedure.mutation(() => shell.showItemInFolder(path.join(getInstanceDir(), '.fabric'))),
  openSettingsFile: procedure.mutation(async () => {
    getSettings();
    await shell.openPath(settingsFilePath);
  }),
  getVersion: procedure.query(() => app.getVersion()),

  initEnv: procedure.mutation(async () => await initEnv()),
  startAuth: procedure.mutation(async () => refreshOrLoginMclcUser()),
  installJava: procedure.mutation(async () => await installJre()),
  logout: procedure.mutation(() => logout()),
  getCachedUser: procedure.query(() => getCachedUser() ?? null),
  getLaunchContext: procedure.query(async () => await getLaunchContext()),
  getSettings: procedure.query(() => getSettings()),
  launchGame: procedure.input(ZodMclcUser).mutation(async (opts) => {
    const user = opts.input as IUser;
    await launchGame(user);
  }),
});

export type AppRouter = typeof appRouter;
