import { LoggerService } from '@backstage/backend-plugin-api';
import {
  AllowedBuckets,
  BucketCredentials,
  CredentialsProvider,
  S3Platform,
} from '../types';
import { Config } from '@backstage/config';
import { S3 } from '@aws-sdk/client-s3';

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
          const s3Client = new S3({
            apiVersion: '2006-03-01',
            endpoint: platform.endpoint,
            region: platform.region,
            forcePathStyle: true,
          });

          const bucketList = await s3Client.listBuckets({});

          const buckets =
            bucketList.Buckets?.map(b => b.Name || '')
              .filter(b => b)
              .filter(b => {
                const allowedBuckets =
                  this.allowedBuckets.find(
                    a => a.platform === platform.endpointName,
                  )?.buckets || [];

                // If no allowedBuckets defined for the platform, all its buckets are allowed by default
                if (allowedBuckets.length === 0) {
                  return true;
                }

                return allowedBuckets.some(a => {
                  // Add the start/end of regular expression, so no unexpected matches happen
                  // Example: `test` should't match `test-one`, but `test.*` should.
                  return b.match(`^${a}$`);
                });
              }) || [];
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
