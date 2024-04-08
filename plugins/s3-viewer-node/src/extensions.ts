import { createExtensionPoint } from '@backstage/backend-plugin-api';
import {
  BucketStatsProvider,
  BucketsProvider,
  CredentialsProvider,
  S3Api,
} from './api';

export interface S3ViewerExtensionPoint {
  setClient(client: S3Api): void;
  setCredentialsProvider(credentialsProvider: CredentialsProvider): void;
  setBucketsProvider(bucketsProvider: BucketsProvider): void;
  setBucketStatsProvider(bucketStatsProvider: BucketStatsProvider): void;
}

export const s3ViewerExtensionPoint =
  createExtensionPoint<S3ViewerExtensionPoint>({
    id: 's3-viewer.configuration',
  });
