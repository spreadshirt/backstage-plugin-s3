import { Config } from '@backstage/config';
import { LoggerService } from '@backstage/backend-plugin-api';
import { AllowedBuckets, BucketCredentials, S3Platform } from '../types';
import { CredentialsProvider } from '@spreadshirt/backstage-plugin-s3-viewer-node';
import { fetchBucketsForPlatform } from './utils';

export class ConfigCredentialsProvider implements CredentialsProvider {
  constructor(
    readonly platforms: S3Platform[],
    readonly logger: LoggerService,
    readonly allowedBuckets: AllowedBuckets[],
  ) {}

  static fromConfig(
    config: Config,
    logger: LoggerService,
    allowedBuckets: AllowedBuckets[],
  ): ConfigCredentialsProvider {
    const platforms: S3Platform[] = config
      .getConfigArray('platforms')
      .map(cfg => {
        const name = cfg.getOptionalString('name') || cfg.getString('endpoint');
        return {
          endpoint: cfg.getString('endpoint'),
          endpointName: name,
          region: cfg.getString('region'),
          credentials: {
            accessKeyId: cfg.getString('accessKeyId'),
            secretAccessKey: cfg.getString('secretAccessKey'),
          },
        };
      });

    return new ConfigCredentialsProvider(platforms, logger, allowedBuckets);
  }

  async getBucketCredentials(): Promise<BucketCredentials[]> {
    const bucketCreds: BucketCredentials[] = [];
    await Promise.all(
      this.platforms.map(async platform => {
        try {
          const buckets = await fetchBucketsForPlatform(
            platform,
            this.allowedBuckets,
          );
          const creds: BucketCredentials[] = buckets.map(b => ({
            bucket: b,
            credentials: platform.credentials,
            endpoint: platform.endpoint,
            endpointName: platform.endpointName,
            region: platform.region,
          }));
          bucketCreds.push(...creds);
        } catch (err) {
          this.logger.error(
            `Error fetching credentials for buckets in ${platform.endpoint}: ${err}`,
          );
        }
      }),
    );

    return bucketCreds;
  }
}
