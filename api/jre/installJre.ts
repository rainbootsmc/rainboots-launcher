import tmp from 'tmp';
import fetch from 'node-fetch';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import tar from 'tar';
import yauzl from 'yauzl';
import { getJavaRuntimeDir } from '../util/paths.ts';

type OS = 'aix' | 'mac' | 'linux' | 'solaris' | 'windows'
type Arch = 'x64' | 'x32' | 's390x' | 'ppc64'

const JAVA_VERSION = 17;

export const isJreInstalled = (): boolean => {
  const javaRuntimeDir = getJavaRuntimeDir();
  return fs.existsSync(javaRuntimeDir);
};

export const installJre = async (_os?: OS): Promise<string> => {
  const javaRuntimeDir = getJavaRuntimeDir();
  if (fs.existsSync(javaRuntimeDir)) {
    return javaRuntimeDir;
  }

  const os = _os ?? getOs();
  const arch = getArch();
  if (os == undefined) {
    return Promise.reject(new Error('Unsupported operating system'));
  }
  if (arch == undefined) {
    return Promise.reject(new Error('Unsupported architecture'));
  }

  const url = `https://api.adoptopenjdk.net/v3/assets/latest/${JAVA_VERSION}/hotspot?architecture=${arch}&image_type=jre&os=${os}&vendor=adoptopenjdk`;
  const tmpDir = tmp.dirSync({ prefix: 'jre' }).name;

  const json = (await fetch(url).then(res => res.json()) as any)[0];

  const extractedDir = await downloadAll(tmpDir, json.binary.package.link)
    .then(verify)
    .then(extract);

  const innerDirName = `${json.release_name}-jre`;
  const runtimeDir = path.join(extractedDir, innerDirName);

  fs.renameSync(runtimeDir, javaRuntimeDir);
  return javaRuntimeDir;
};

const extract = async (file: string): Promise<string> => {
  const dir = path.join(path.dirname(file), 'jre');
  return createDir(dir).then(() => {
    return path.extname(file) === '.zip'
      ? extractZip(file, dir)
      : extractTarGz(file, dir);
  });
};

const extractZip = async (file: string, dir: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    yauzl.open(file, { lazyEntries: true }, (err, zipFile) => {
      if (err) reject(err);

      zipFile.readEntry();
      zipFile.on('entry', entry => {
        const entryPath = path.join(dir, entry.fileName);

        if (/\/$/.test(entry.fileName)) {
          fs.mkdir(entryPath, { recursive: true }, err => {
            if (err && err.code !== 'EEXIST') reject(err);

            zipFile.readEntry();
          });
        } else {
          zipFile.openReadStream(entry, (err, readStream) => {
            if (err) reject(err);

            readStream.on('end', () => {
              zipFile.readEntry();
            });
            readStream.pipe(fs.createWriteStream(entryPath));
          });
        }
      });
      zipFile.once('close', () => {
        fs.unlink(file, err => {
          if (err) reject(err);
          resolve(dir);
        });
      });
    });
  });
};

const extractTarGz = async (file: string, dir: string): Promise<string> => {
  return tar.x({ file: file, cwd: dir }).then(() => {
    return new Promise((resolve, reject) => {
      fs.unlink(file, err => {
        if (err) reject(err);
        resolve(dir);
      });
    });
  });
};

const verify = async (file: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(file + '.sha256.txt', 'utf-8', (err, data) => {
      if (err) reject(err);

      genChecksum(file).then(checksum => {
        checksum === data.split('  ')[0]
          ? resolve(file)
          : reject(new Error('File and checksum don\'t match'));
      });
    });
  });
};

const genChecksum = (file: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject(err);

      resolve(
        crypto
          .createHash('sha256')
          .update(data)
          .digest('hex'),
      );
    });
  });
};

const downloadAll = async (dir: string, url: string): Promise<string> => {
  const result = await Promise.all([
    download(dir, url + '.sha256.txt'),
    download(dir, url),
  ]);
  return result[1];
};

const download = async (dir: string, url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    createDir(dir)
      .then(() => fetch(url))
      .then(res => {
        const destFile = path.join(dir, path.basename(url));
        const destStream = fs.createWriteStream(destFile);
        res.body!.pipe(destStream).on('finish', () => resolve(destFile));
      })
      .catch(err => reject(err));
  });
};

const createDir = async (dir: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.access(dir, err => {
      if (err && err.code === 'ENOENT') {
        fs.mkdir(dir, err => {
          if (err) reject(err);
          resolve();
        });
      } else if (!err) resolve();
      else reject(err);
    });
  });
};

const getArch = (): Arch | undefined => {
  if (/^ppc64|s390x|x32|x64$/g.test(process.arch)) {
    return process.arch as Arch;
  } else if (process.arch === 'ia32') {
    return 'x32';
  } else {
    return undefined;
  }
};

const getOs = (): OS | undefined => {
  switch (process.platform) {
  case 'aix':
    return 'aix';
  case 'darwin':
    return 'mac';
  case 'linux':
    return 'linux';
  case 'sunos':
    return 'solaris';
  case 'win32':
    return 'windows';
  default:
    return undefined;
  }
};
