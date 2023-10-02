import {
  BucketStatsProvider,
  BucketsProvider,
  CredentialsProvider,
} from '@spreadshirt/backstage-plugin-s3-viewer-node';
import {
  BucketCredentials,
  BucketDetails,
  BucketDetailsFilters,
} from '@spreadshirt/backstage-plugin-s3-viewer-common';
import { LoggerService } from '@backstage/backend-plugin-api';
import { S3 } from '@aws-sdk/client-s3';
import {
  PluginTaskScheduler,
  TaskScheduleDefinition,
} from '@backstage/backend-tasks';
import { matches } from '../permissions';

export class S3BucketsProvider implements BucketsProvider {
  private buckets: BucketDetails[];
  private bucketCreds: BucketCredentials[];

  constructor(
    readonly logger: LoggerService,
    readonly scheduler: PluginTaskScheduler,
    readonly credentialsProvider: CredentialsProvider,
    readonly statsProvider: BucketStatsProvider | undefined,
    readonly schedule: TaskScheduleDefinition | undefined,
  ) {
    this.buckets = [];
    this.bucketCreds = [];
  }

  static create(
    logger: LoggerService,
    scheduler: PluginTaskScheduler,
    credentialsProvider: CredentialsProvider,
    statsProvider: BucketStatsProvider | undefined,
    schedule: TaskScheduleDefinition | undefined,
  ): S3BucketsProvider {
    const bucketsProvider = new S3BucketsProvider(
      logger,
      scheduler,
      credentialsProvider,
      statsProvider,
      schedule,
    );
    // Don't wait for bucket fetch. This speeds up the backend startup process.
    bucketsProvider.start();

    return bucketsProvider;
  }

  async start(): Promise<void> {
    await this.fetchBuckets();
    if (this.schedule) {
      await this.scheduler.scheduleTask({
        id: 'refresh-s3-buckets',
        fn: async () => this.fetchBuckets(),
        frequency: this.schedule.frequency,
        timeout: this.schedule.timeout,
        initialDelay: this.schedule.initialDelay,
        scope: this.schedule.scope,
      });
    }
  }

  async fetchBuckets(): Promise<void> {
    this.logger.info('Fetching S3 buckets...');
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
            region: creds.region,
            forcePathStyle: true,
          });

          const owner = await s3Client.getBucketAcl({ Bucket: creds.bucket });

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
            .getBucketLifecycleConfiguration({
              Bucket: creds.bucket,
            })
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
    this.logger.info(`Fetched ${this.buckets.length} S3 buckets`);
  }

  getAllBuckets(filter?: BucketDetailsFilters): string[] {
    return this.buckets
      .filter(b => matches(b, filter))
      .map(b => b.bucket)
      .sort();
  }

  getBucketsByEndpoint(
    endpoint: string,
    filter?: BucketDetailsFilters,
  ): string[] {
    return this.buckets
      .filter(b => matches(b, filter))
      .filter(b => b.endpoint === endpoint || b.endpointName === endpoint)
      .map(b => b.bucket)
      .sort();
  }

  getGroupedBuckets(filter?: BucketDetailsFilters): Record<string, string[]> {
    const bucketsByEndpoint: Record<string, string[]> = {};

    this.buckets
      .filter(bucket => matches(bucket, filter))
      .forEach(b => {
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
