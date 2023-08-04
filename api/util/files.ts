import fs, { PathLike } from 'fs';

export const mkdirIfNotExists = (directory: PathLike) => {
  if (fs.existsSync(directory)) {
    return;
  }
  fs.mkdirSync(directory);
};

export const ensureDir = (directory: PathLike) => {
  if (fs.existsSync(directory)) {
    return;
  }
  fs.mkdirSync(directory, { recursive: true });
};
