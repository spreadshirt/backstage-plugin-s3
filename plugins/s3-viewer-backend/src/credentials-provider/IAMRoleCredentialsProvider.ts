import { LoggerService } from '@backstage/backend-plugin-api';
import {
  AllowedBuckets,
  BucketCredentials,
  CredentialsProvider,
  S3Platform,
} from '../types';
import { Config } from '@backstage/config';
import { fetchBucketsForPlatform } from './utils';

/**
 * This class uses IAM Roles (https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html). Therefore, no
 * credentials are needed to access any bucket because, depending on the assumed role, you will be assigned
 * with temporary security credentials for your role session.
 */
export class IAMRoleCredentialsProvider implements CredentialsProvider {
  constructor(
    readonly platforms: S3Platform[],
    readonly logger: LoggerService,
    readonly allowedBuckets: AllowedBuckets[],
  ) {}

  static fromConfig(
    config: Config,
    logger: LoggerService,
    allowedBuckets: AllowedBuckets[],
  ): IAMRoleCredentialsProvider {
    const platforms: S3Platform[] = config
      .getConfigArray('platforms')
      .map(cfg => {
        const name = cfg.getOptionalString('name') || cfg.getString('endpoint');
        return {
          endpoint: cfg.getString('endpoint'),
          endpointName: name,
          region: cfg.getString('region'),
        };
      });

    return new IAMRoleCredentialsProvider(platforms, logger, allowedBuckets);
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
