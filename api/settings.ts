import fs from 'fs';
import path from 'path';
import { getAppDataDir } from './util/paths';
import { z } from 'zod';

export const LauncherSettings = z.object({
  __comment__: z.ostring(),
  manifest_url: z.string(),
  javaPath: z.string(),
  memory: z.object({
    min: z.number(),
    max: z.number(),
  }),
  window: z.object({
    width: z.number(),
    height: z.number(),
    fullscreen: z.boolean(),
  }),
});

export type LauncherSettings = z.infer<typeof LauncherSettings>;

const DEFAULT_SETTINGS: LauncherSettings = {
  __comment__: '設定を誤ると起動できなくなります！何をしているのか自分で分かる人だけ編集してください！',
  manifest_url: '',
  javaPath: '',
  memory: {
    min: 1024,
    max: 4196,
  },
  window: {
    width: 854,
    height: 480,
    fullscreen: false,
  },
};

export const settingsFilePath = path.join(getAppDataDir(), 'launcher_settings.json');

export const getSettings = (): LauncherSettings => {
  try {
    if (fs.existsSync(settingsFilePath)) {
      const string = fs.readFileSync(settingsFilePath).toString();
      return LauncherSettings.parse(JSON.parse(string));
    }
  } catch (e) {
    console.error(e);
  }
  fs.writeFileSync(settingsFilePath, JSON.stringify(DEFAULT_SETTINGS, null, '  '));
  return DEFAULT_SETTINGS;
};
