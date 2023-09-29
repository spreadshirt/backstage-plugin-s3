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
