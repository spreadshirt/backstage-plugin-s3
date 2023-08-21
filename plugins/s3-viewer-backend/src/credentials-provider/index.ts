import { Config } from '@backstage/config';
import { LoggerService } from '@backstage/backend-plugin-api';
import {
  AllowedBuckets,
  BucketCredentials,
  CredentialsProvider,
} from '../types';
import { ConfigCredentialsProvider } from './ConfigCredentialsProvider';
import { RadosGwCredentialsProvider } from './RadosGwCredentialsProvider';

class CombinedCredentialsProvider implements CredentialsProvider {
  constructor(readonly credentialsProviders: CredentialsProvider[]) {}

  async getBucketCredentials(): Promise<BucketCredentials[]> {
    return await Promise.all(
      this.credentialsProviders.map(async locator =>
        locator.getBucketCredentials(),
      ),
    )
      .then(res => {
        return res.flat();
      })
      .catch(e => {
        throw e;
      });
  }
}

export const getCombinedCredentialsProvider = (
  rootConfig: Config,
  logger: LoggerService,
): CombinedCredentialsProvider => {
  const allowedBuckets: AllowedBuckets[] = [];
  rootConfig.getOptionalConfigArray('s3.allowedBuckets')?.forEach(c =>
    allowedBuckets.push({
      platform: c.getString('platform'),
      buckets: c.getStringArray('buckets'),
    }),
  );

  const credentialsProvider = rootConfig
    .getConfigArray('s3.bucketLocatorMethods')
    .map(clusterLocatorMethod => {
      const type = clusterLocatorMethod.getString('type');
      switch (type) {
        case 'config':
          return ConfigCredentialsProvider.fromConfig(
            clusterLocatorMethod,
            logger,
            allowedBuckets,
          );
        case 'radosgw-admin':
          return RadosGwCredentialsProvider.fromConfig(
            clusterLocatorMethod,
            logger,
            allowedBuckets,
          );
        default:
          throw new Error(`Unsupported s3.bucketLocatorMethods: "${type}"`);
      }
    });

  return new CombinedCredentialsProvider(credentialsProvider);
};
