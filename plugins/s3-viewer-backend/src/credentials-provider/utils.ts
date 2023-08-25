import { S3 } from '@aws-sdk/client-s3';
import { AllowedBuckets, S3Platform } from '../types';

export async function fetchBucketsForPlatform(
  platform: S3Platform,
  allowedBuckets: AllowedBuckets[],
): Promise<string[]> {
  const s3Client = new S3({
    apiVersion: '2006-03-01',
    credentials: platform.credentials,
    endpoint: platform.endpoint,
    region: platform.region,
    forcePathStyle: true,
  });

  const bucketList = await s3Client.listBuckets({});

  const buckets =
    bucketList.Buckets?.map(b => b.Name || '')
      .filter(b => b)
      .filter(b => {
        const bucketsAllowed =
          allowedBuckets.find(a => a.platform === platform.endpointName)
            ?.buckets || [];

        // If no allowedBuckets defined for the platform, all its buckets are allowed by default
        if (bucketsAllowed.length === 0) {
          return true;
        }

        return bucketsAllowed.some(a => {
          // Add the start/end of regular expression, so no unexpected matches happen
          // Example: `test` should't match `test-one`, but `test.*` should.
          return b.match(`^${a}$`);
        });
      }) || [];

  return buckets;
}
