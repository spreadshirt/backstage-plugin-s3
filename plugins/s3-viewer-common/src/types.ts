import { LifecycleRule } from '@aws-sdk/client-s3';

export type BucketStats = {
  objects: number;
  size: number;
};

export type BucketDetails = {
  endpoint: string;
  endpointName: string;
  bucket: string;
  owner: string;
  policy: LifecycleRule[];
} & BucketStats;

export type KeyData = {
  name: string;
  isFolder: boolean;
};

export type ListBucketKeysResult = {
  totalBucketObjects: number;
  keys: KeyData[];
  next: string | undefined;
};

export type FetchObjectResult = {
  name: string;
  bucket: string;
  etag: string;
  contentType: string;
  contentEncoding?: string;
  contentLength?: number;
  lastModified: string;
  downloadName: string;
  downloadUrl: string;
};

export type S3Platform = {
  endpoint: string;
  endpointName: string;
  region: string;
  credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
  };
};

export type BucketCredentials = S3Platform & {
  bucket: string;
};

export type AllowedBuckets = {
  platform: string;
  buckets: string[];
};
