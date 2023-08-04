import fetch from 'node-fetch';
import last from 'just-last';

type ModrinthInfo = {
  projectId: string
  filename: string
  url: string
}

type ModrinthProjectResponse = {
  versions: string[]
}

type ModrinthVersionResponse = {
  project_id: string
  files: {
    url: string
    filename: string
  }[]
}

const MODRINTH_API_ENDPOINT = 'https://api.modrinth.com/v2';

export const getModInfo = async (slug: string, version: 'latest' | string): Promise<ModrinthInfo> => {
  try {
    if (version === 'latest') {
      return await fetch(`${MODRINTH_API_ENDPOINT}/project/${slug}`)
        .then(r => r.json())
        .then(j => j as ModrinthProjectResponse)
        .then(r => last(r.versions))
        .then(version => getModInfo(slug, version));
    } else {
      return await fetch(`${MODRINTH_API_ENDPOINT}/version/${version}`)
        .then(r => r.json())
        .then(j => j as ModrinthVersionResponse)
        .then(r => ({
          projectId: r.project_id,
          filename: r.files[0].filename,
          url: r.files[0].url,
        }) as ModrinthInfo);
    }
  } catch (e) {
    return Promise.reject(e);
  }
};
