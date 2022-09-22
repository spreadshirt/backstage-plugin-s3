import { Config } from '@backstage/config';
import { S3 } from 'aws-sdk';
import { Logger } from 'winston';
import { BucketCredentials, CredentialsProvider, S3Platform } from '../types';

export class ConfigCredentialsProvider implements CredentialsProvider {
  constructor(readonly platforms: S3Platform[], readonly logger: Logger) {}

  static fromConfig(config: Config, logger: Logger): ConfigCredentialsProvider {
    const platforms: S3Platform[] = config
      .getConfigArray('platforms')
      .map(cfg => {
        const name = cfg.getOptionalString('name') || cfg.getString('endpoint');
        return {
          endpoint: cfg.getString('endpoint'),
          endpointName: name,
          credentials: {
            accessKeyId: cfg.getString('accessKeyId'),
            secretAccessKey: cfg.getString('secretAccessKey'),
          },
        };
      });

    return new ConfigCredentialsProvider(platforms, logger);
  }

  async getBucketCredentials(): Promise<BucketCredentials[]> {
    const bucketCreds: BucketCredentials[] = [];
    await Promise.all(
      this.platforms.map(async platform => {
        try {
          const s3Client = new S3({
            apiVersion: '2006-03-01',
            credentials: platform.credentials,
            endpoint: platform.endpoint,
            s3ForcePathStyle: true,
          });

          const bucketList: S3.ListBucketsOutput = await s3Client
            .listBuckets()
            .promise();

          const buckets =
            bucketList.Buckets?.map(b => b.Name || '').filter(b => b) || [];
          const creds: BucketCredentials[] = buckets.map(b => ({
            bucket: b,
            credentials: platform.credentials,
            endpoint: platform.endpoint,
            endpointName: platform.endpointName,
          }));
          bucketCreds.push(...creds);
        } catch (err) {
          this.logger.error(
            `Error fecthing credentials for buckets in ${platform.endpoint}: ${err}`,
          );
        }
      }),
    );

    return bucketCreds;
  }
}
