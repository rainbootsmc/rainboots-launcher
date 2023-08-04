import path from 'path';
import { getAppDataDir } from './util/paths';
import { ZodMclcUser, ZodMSAuthToken } from './util/auth';
import { Auth, Minecraft } from 'msmc';
import { safeStorage } from 'electron';
import fs from 'fs';
import { mainWindow } from '../electron/main.ts';

const tokenFilePath = path.join(getAppDataDir(), 'Token');
const userCachePath = path.join(getAppDataDir(), 'UserCache');

export const refreshOrLoginMclcUser = async (): Promise<ZodMclcUser> => {
  const auth = new Auth('select_account');

  try {
    if (fs.existsSync(tokenFilePath)) {
      const buffer = fs.readFileSync(tokenFilePath);
      const decrypted = safeStorage.decryptString(buffer);
      const msAuthToken = ZodMSAuthToken.parse(JSON.parse(decrypted));
      const xbox = await auth.refresh(msAuthToken);
      saveToken(xbox.msToken);

      const minecraft = await xbox.getMinecraft();
      updateUser(minecraft);
      return ZodMclcUser.parse(minecraft.mclc());
    }
  } catch (e) {
    console.error(e);
  }

  const xbox = await auth.launch('raw');
  saveToken(xbox.msToken);

  const minecraft = await xbox.getMinecraft();
  updateUser(minecraft);
  return ZodMclcUser.parse(minecraft.mclc());
};

const saveToken = (msAuthToken: ZodMSAuthToken) => {
  const encrypted = safeStorage.encryptString(JSON.stringify(msAuthToken));
  fs.writeFileSync(tokenFilePath, encrypted);
};

export type MinecraftUserData = {
  uuid: string
  username: string
}

export const getCachedUser = (): MinecraftUserData | undefined => {
  try {
    if (!fs.existsSync(userCachePath)) {
      return undefined;
    }
    const content = fs.readFileSync(userCachePath).toString();
    return JSON.parse(content) as MinecraftUserData;
  } catch (e) {
    return undefined;
  }
};

const updateUser = (minecraft: Minecraft) => {
  const profile = minecraft.profile;
  if (profile == undefined) {
    return;
  }
  const data: MinecraftUserData = {
    uuid: profile.id,
    username: profile.name,
  };
  fs.writeFileSync(userCachePath, JSON.stringify(data));
  mainWindow?.webContents.send('update-user', data);
};

export const logout = () => {
  mainWindow?.webContents.send('update-user', null);
  fs.unlinkSync(userCachePath);
  fs.unlinkSync(tokenFilePath);
};
