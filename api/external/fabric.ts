type FabricVersionResponse = {
  loader: {
    version: string
  }
}[]

export type FabricVersion = {
  minecraft: string;
  loader: string;
  profile: string;
}

const FABRIC_API_ENDPOINT = 'https://meta2.fabricmc.net/v2';

export const getCurrentFabricVersion = async (minecraftVersion: string): Promise<FabricVersion> => {
  return await fetch(`${FABRIC_API_ENDPOINT}/versions/loader/${minecraftVersion}`)
    .then(r => r.json())
    .then(json => json as FabricVersionResponse)
    .then(r => r[0].loader.version)
    .then(loaderVersion => ({
      minecraft: minecraftVersion,
      loader: loaderVersion,
      profile: `fabric-loader-${loaderVersion}-${minecraftVersion}`,
    }));
};

export const getFabricProfileJson = async (version: FabricVersion): Promise<string> => {
  return await fetch(`${FABRIC_API_ENDPOINT}/versions/loader/${version.minecraft}/${version.loader}/profile/json`)
    .then(r => r.json())
    .then(j => JSON.stringify(j));
};
