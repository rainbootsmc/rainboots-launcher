import { z } from 'zod';
import { FabricVersion, getCurrentFabricVersion, getFabricProfileJson } from './external/fabric';
import { getInstanceDir } from './util/paths';
import path from 'path';
import fs, { createWriteStream } from 'fs';
import { ensureDir } from './util/files';
import fetch from 'node-fetch';
import { isJreInstalled } from './jre/installJre.ts';
import { getModInfo } from './external/modrinth.ts';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { getSettings, LauncherSettings } from './settings.ts';

export const ModEntry = z.object({
  slug: z.string(),
  version: z.union([z.literal('latest'), z.string()]),
});

export type ModEntry = z.infer<typeof ModEntry>

export const LauncherManifest = z.object({
  minecraft: z.string(),
  serverAddress: z.string(),
  mods: z.array(ModEntry),
});

export type LauncherManifest = z.infer<typeof LauncherManifest>

export type LaunchContext = {
  profileName: string,
  version: {
    minecraft: string
    fabricLoader: string
  }
  instanceDir: string
  settings: LauncherSettings
}

export type InitEnvResult = {
  java: {
    isCustom: boolean
    isInstalled: boolean
  }
}

export const DEFAULT_MANIFEST_URL = 'https://rainbootsmc.github.io/rainboots-launcher-manifest/manifest.json';
const installedModsPath = path.join(getInstanceDir(), 'installed_mods.json');
const modsDir = path.join(getInstanceDir(), 'mods');

export let manifest: LauncherManifest | undefined;
export let fabricVersion: FabricVersion | undefined;

export const getLaunchContext = async (): Promise<LaunchContext | undefined> => {
  if (fabricVersion == undefined) {
    return undefined;
  }
  return {
    profileName: fabricVersion.profile,
    version: {
      minecraft: fabricVersion.minecraft,
      fabricLoader: fabricVersion.loader,
    },
    instanceDir: getInstanceDir(),
    settings: getSettings(),
  };
};

export const initEnv = async (): Promise<InitEnvResult> => {
  manifest = await downloadManifest();
  fabricVersion = await initFabricLoader();
  await initMods();
  const settings = getSettings();
  return {
    java: {
      isCustom: settings.javaPath.length > 0,
      isInstalled: isJreInstalled(),
    },
  };
};

export const initFabricLoader = async (): Promise<FabricVersion | undefined> => {
  if (manifest == null) {
    return undefined;
  }
  const fabricVersion = await getCurrentFabricVersion(manifest.minecraft);
  const versionDir = path.join(getInstanceDir(), 'versions');
  const profileDir = path.join(versionDir, fabricVersion.profile);
  const profileJsonPath = path.join(profileDir, `${fabricVersion.profile}.json`);

  if (fs.existsSync(profileJsonPath)) {
    return fabricVersion;
  }

  ensureDir(profileDir);

  const fabricProfileJson = await getFabricProfileJson(fabricVersion);
  fs.writeFileSync(profileJsonPath, fabricProfileJson);
  return fabricVersion;
};

const downloadManifest = async (): Promise<LauncherManifest> => {
  const customManifestUrl = getSettings().manifest_url;
  const manifestUrl = customManifestUrl.length > 0 ? customManifestUrl : DEFAULT_MANIFEST_URL;
  return await fetch(manifestUrl)
    .then(r => r.json())
    .then(json => LauncherManifest.parse(json));
};

const initMods = async () => {
  if (manifest == undefined) {
    return;
  }
  ensureDir(getInstanceDir());

  const installedModFilenames = getInstalledModFilenames();
  deleteMods(installedModFilenames);

  const installTasks = manifest.mods.map(installMod);
  const filenames = await Promise.all(installTasks);
  saveInstalledModFilenames(filenames);
};

const getInstalledModFilenames = (): string[] => {
  ensureDir(path.dirname(installedModsPath));
  let json: string[] = [];
  try {
    json = z.array(z.string()).parse(JSON.parse(fs.readFileSync(installedModsPath).toString()));
  } catch (e) {
    // Empty
  }
  return json;
};

const saveInstalledModFilenames = (filenames: string[]) => {
  ensureDir(path.dirname(installedModsPath));
  fs.writeFileSync(installedModsPath, JSON.stringify(filenames));
};

const deleteMods = (filenames: string[]) => {
  ensureDir(modsDir);

  filenames.forEach(filename => {
    fs.unlinkSync(path.join(modsDir, filename));
  });
};

const installMod = async (modEntry: ModEntry): Promise<string> => {
  ensureDir(modsDir);
  const modInfo = await getModInfo(modEntry.slug, modEntry.version);
  const streamPipeline = promisify(pipeline);
  const body = await fetch(modInfo.url).then(r => r.body);
  if (body == undefined) {
    return Promise.reject();
  }
  await streamPipeline(body, createWriteStream(path.join(modsDir, modInfo.filename)));
  return modInfo.filename;
};
