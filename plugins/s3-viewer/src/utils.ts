import { S3_VIEWER_BUCKET } from "./constant";
import { Entity } from '@backstage/catalog-model';

/**
 * Converts a number of bytes into a human readable text.
 *
 * @param bytes Number of bytes
 * @param si `true` to use metric (SI) units. `false` to use binary (IEC) units
 * @param dp Number of decimal places to display
 * @returns Formatted size
 */
export function humanFileSize(bytes: number | undefined, si = true, dp = 1) {
  if (!bytes) {
    return '0 B';
  }

  const thresh = si ? 1000 : 1024;
  if (Math.abs(bytes) < thresh) {
    return `${bytes} B`;
  }

  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10 ** dp;

  let newBytes = bytes;

  do {
    newBytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(newBytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return `${newBytes.toFixed(dp)} ${units[u]}`;
}

/**
 * Gets the path used in the backend to fetch information of an object.
 * If the value is empty or a folder, it will return an empty path (no
 * object selected). Otherwise, it will return the current value.
 *
 * @param dir The pull path, which can be empty, a folder or a file path
 * @returns The path used to get the object information from the backend
 */
export function getPathFromUrlDir(dir: string | null): string {
  if (!dir || dir.endsWith('/')) {
    return '';
  }

  return dir;
}

/**
 * Get the folder from a full directory path. If the path is `null` or
 * empty, the folder will be also empty.
 *
 * Examples:
 * - `dir` is `test/folder/`. Then it will return the same
 * - `dir` is `test/folder/file.txt`. Then it will return `test/folder/`
 *
 * @param dir The full path used to fetch the current folder
 * @returns The current folder
 */
export function getFolderFromUrlDir(dir: string | null): string {
  if (!dir || dir === '/') {
    return '';
  }

  if (dir.endsWith('/')) {
    return dir;
  }

  const folder = dir.split('/').slice(0, -1).join('/');
  return folder ? `${folder}/` : folder;
}

export const isS3ViewerBucketAvailable = (entity: Entity): boolean =>
  Boolean(entity.metadata.annotations?.[S3_VIEWER_BUCKET]);

export function extractBucketAndPath(input: string): { bucket: string; path: string } {
  const [bucket, path = ''] = input.split(':');
  return { bucket, path };
}