import { S3 } from 'aws-sdk';

export type BucketStats = {
  objects: number;
  size: number;
};

export type BucketDetails = {
  endpoint: string;
  endpointName: string;
  bucket: string;
  owner: string;
  policy: S3.Rules;
} & BucketStats;

export type KeyData = {
  name: string;
  isFolder: boolean;
};

export type ListBucketKeysResult = {
  totalBucketObjects: number;
  keys: KeyData[];
  keyCount: number;
  next: string | undefined;
};

export type FetchObjectResult = {
  name: string;
  bucket: string;
  etag: string;
  contentType: string;
  contentLength?: number;
  lastModified: string;
  downloadName: string;
  downloadUrl: string;
};
