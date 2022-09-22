import {
  BucketCredentials,
  BucketsProvider,
  BucketStatsProvider,
  CredentialsProvider,
} from '../types';
import { BucketDetails } from '@spreadshirt/backstage-plugin-s3-viewer-common';
import { Logger } from 'winston';
import { S3 } from 'aws-sdk';
import { Config } from '@backstage/config';
import { HumanDuration, PluginTaskScheduler } from '@backstage/backend-tasks';

export class S3BucketsProvider implements BucketsProvider {
  private buckets: BucketDetails[];
  private bucketCreds: BucketCredentials[];

  constructor(
    readonly logger: Logger,
    readonly scheduler: PluginTaskScheduler,
    readonly credentialsProvider: CredentialsProvider,
    readonly statsProvider: BucketStatsProvider | undefined,
    readonly excludedBucket: { [key: string]: string[] },
    readonly refreshInterval: HumanDuration | undefined,
  ) {
    this.buckets = [];
    this.bucketCreds = [];
  }

  static async create(
    logger: Logger,
    config: Config,
    scheduler: PluginTaskScheduler,
    credentialsProvider: CredentialsProvider,
    statsProvider: BucketStatsProvider | undefined,
    refreshInterval: HumanDuration | undefined,
  ): Promise<S3BucketsProvider> {
    const excludedBuckets: { [key: string]: string[] } = {};
    Object.entries(config.getOptional('s3.excludedBuckets') ?? {}).forEach(
      ([platform, buckets]) => {
        excludedBuckets[platform] = buckets as string[];
      },
    );

    const bucketsProvider = new S3BucketsProvider(
      logger,
      scheduler,
      credentialsProvider,
      statsProvider,
      excludedBuckets,
      refreshInterval,
    );
    await bucketsProvider.start();

    return bucketsProvider;
  }

  async start(): Promise<void> {
    await this.fetchBuckets();
    if (this.refreshInterval) {
      await this.scheduler.scheduleTask({
        id: 'refresh-s3-buckets',
        fn: async () => this.fetchBuckets(),
        frequency: this.refreshInterval,
        timeout: this.refreshInterval,
      });
    }
  }

  async fetchBuckets(): Promise<void> {
    const bucketDetails: BucketDetails[] = [];
    const bucketCredentials =
      await this.credentialsProvider.getBucketCredentials();
    await Promise.all(
      bucketCredentials.map(async creds => {
        try {
          const s3Client = new S3({
            apiVersion: '2006-03-01',
            credentials: creds.credentials,
            endpoint: creds.endpoint,
            s3ForcePathStyle: true,
          });

          const owner: S3.GetBucketAclOutput = await s3Client
            .getBucketAcl({
              Bucket: creds.bucket,
            })
            .promise();

          const details: BucketDetails = {
            bucket: creds.bucket,
            owner: owner.Owner?.DisplayName || '',
            objects: 0,
            size: 0,
            endpoint: creds.endpoint,
            endpointName: creds.endpointName,
            policy: [],
          };

          if (this.statsProvider) {
            try {
              const stats = await this.statsProvider.getStats(
                creds.endpoint,
                creds.bucket,
              );
              details.objects = stats.objects;
              details.size = stats.size;
            } catch (err) {
              this.logger.error(
                `Could not fetch stats for ${creds.bucket} in ${creds.endpoint}: ${err}`,
              );
            }
          }

          await s3Client
            .getBucketLifecycle({
              Bucket: creds.bucket,
            })
            .promise()
            .then(value => (details.policy = value.Rules || []))
            .catch(
              // This catches an error if the lifecycle is not defined.
              // Just skip this error an continue processing
              _ => {},
            );

          bucketDetails.push(details);
        } catch (err) {
          this.logger.error(
            `Error fetching data for bucket "${creds.bucket}", skipping. ${err}`,
          );
        }
      }),
    );

    this.buckets = bucketDetails;
    this.bucketCreds = bucketCredentials;
  }

  getAllBuckets(): string[] {
    return this.buckets.map(b => b.bucket).sort();
  }

  getBucketsByEndpoint(endpoint: string): string[] {
    return this.buckets
      .filter(b => b.endpoint === endpoint || b.endpointName === endpoint)
      .map(b => b.bucket)
      .sort();
  }

  getGroupedBuckets(): Record<string, string[]> {
    const bucketsByEndpoint: Record<string, string[]> = {};

    this.buckets.forEach(b => {
      const endpoint = b.endpointName;
      if (!bucketsByEndpoint[endpoint]) {
        bucketsByEndpoint[endpoint] = [];
      }
      if (!bucketsByEndpoint[endpoint].includes(b.bucket)) {
        bucketsByEndpoint[endpoint].push(b.bucket);
      }
    });

    Object.keys(bucketsByEndpoint).forEach(key => {
      bucketsByEndpoint[key] = bucketsByEndpoint[key].sort();
    });

    return bucketsByEndpoint;
  }

  getBucketInfo(endpoint: string, bucket: string): BucketDetails | undefined {
    return this.buckets.find(
      b =>
        b.bucket === bucket &&
        (b.endpoint === endpoint || b.endpointName === endpoint),
    );
  }

  getCredentialsForBucket(
    endpoint: string,
    bucket: string,
  ): BucketCredentials | undefined {
    return this.bucketCreds.find(
      b =>
        b.bucket === bucket &&
        (b.endpoint === endpoint || b.endpointName === endpoint),
    );
  }
}
