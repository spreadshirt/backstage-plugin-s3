import { Config } from '@backstage/config';
import express from 'express';
import Router from 'express-promise-router';
import {
  BucketStatsProvider,
  BucketsProvider,
  CredentialsProvider,
  S3Api,
} from '@spreadshirt/backstage-plugin-s3-viewer-node';
import { S3BucketsProvider } from './S3BucketsProvider';
import { S3Client } from './S3Api';
import {
  AuthService,
  DiscoveryService,
  HttpAuthService,
  LoggerService,
  PermissionsService,
  readSchedulerServiceTaskScheduleDefinitionFromConfig,
  SchedulerService,
  SchedulerServiceTaskScheduleDefinition,
} from '@backstage/backend-plugin-api';
import { assertError, NotAllowedError, NotFoundError } from '@backstage/errors';
import {
  AuthorizeResult,
  PolicyDecision,
  QueryPermissionRequest,
} from '@backstage/plugin-permission-common';
import {
  BucketDetailsFilters,
  permissions,
} from '@spreadshirt/backstage-plugin-s3-viewer-common';
import { getCombinedCredentialsProvider } from '../credentials-provider';
import cookieParser from 'cookie-parser';
import { HumanDuration } from '@backstage/types';
import { matches, transformConditions } from '../permissions';

export interface S3Environment {
  auth: AuthService;
  logger: LoggerService;
  config: Config;
  scheduler: SchedulerService;
  discovery: DiscoveryService;
  permissions: PermissionsService;
  httpAuth: HttpAuthService;
}

export interface S3BuilderReturn {
  router: express.Router;
}

export class S3Builder {
  private refreshInterval: HumanDuration | undefined;
  private client?: S3Api;
  private credentialsProvider?: CredentialsProvider;
  private bucketsProvider?: BucketsProvider;
  private statsProvider?: BucketStatsProvider;

  constructor(protected readonly env: S3Environment) {}

  static createBuilder(env: S3Environment) {
    return new S3Builder(env);
  }

  public async build(): Promise<S3BuilderReturn> {
    const { logger, config, scheduler, discovery } = this.env;

    logger.info('Initializing S3 backend');

    if (!config.has('s3')) {
      logger.warn('Failed to initialize S3 backend: s3 config is missing');
      return {
        router: Router(),
      };
    }

    // Temporarily maintain support for the `setRefreshInterval` method if the configuration
    // is not used. Remove it in some of the next releases. Added a deprecation for now
    const fallbackSchedule = this.refreshInterval
      ? { frequency: this.refreshInterval, timeout: this.refreshInterval }
      : undefined;

    const schedule: SchedulerServiceTaskScheduleDefinition | undefined =
      config.has('s3.bucketRefreshSchedule')
        ? readSchedulerServiceTaskScheduleDefinitionFromConfig(
            config.getConfig('s3.bucketRefreshSchedule'),
          )
        : fallbackSchedule;

    const credentialsProvider =
      this.credentialsProvider ?? this.buildCredentialsProvider();

    this.bucketsProvider =
      this.bucketsProvider ??
      S3BucketsProvider.create(
        logger,
        scheduler,
        credentialsProvider,
        this.statsProvider,
        schedule,
      );

    this.client =
      this.client ??
      new S3Client({
        bucketsProvider: this.bucketsProvider,
        discoveryApi: discovery,
      });

    if (this.client.setBucketsProvider) {
      this.client.setBucketsProvider(this.bucketsProvider);
    }

    const router = this.buildRouter(this.client);

    return {
      router: router,
    };
  }

  private buildCredentialsProvider(): CredentialsProvider {
    return getCombinedCredentialsProvider(this.env.config, this.env.logger);
  }

  /**
   * Overwrites the current s3 client.
   *
   * @param client - The new S3 client
   * @returns
   */
  public setClient(client: S3Api) {
    this.client = client;
    return this;
  }

  /**
   * Overwrites the credentials provider.
   *
   * @param credentialsProvider - The new credentials provider
   * @returns
   */
  public setCredentialsProvider(credentialsProvider: CredentialsProvider) {
    this.credentialsProvider = credentialsProvider;
    return this;
  }

  /**
   * Overwrites the bucket provider.
   *
   * @param bucketsProvider - The new bucket provider
   * @returns
   */
  public setBucketsProvider(bucketsProvider: BucketsProvider) {
    this.bucketsProvider = bucketsProvider;
    return this;
  }

  /**
   * Sets a new bucket stats provider. By default this is undefined.
   *
   * @param bucketStatsProvider - The new bucket stats provider
   * @returns
   */
  public setBucketStatsProvider(bucketStatsProvider: BucketStatsProvider) {
    this.statsProvider = bucketStatsProvider;
    return this;
  }

  /**
   * Sets the refresh interval for the radosgw-admin provider.
   * By default, the refresh is not enabled, set this value to
   * allow reloading the buckets.
   *
   * @param refreshInterval - The refresh interval to reload buckets
   * @returns
   * @deprecated Now the refresh interval is set via the app-config.yaml file.
   * Define `s3.bucketRefreshSchedule` in your configuration file.
   */
  public setRefreshInterval(refreshInterval: HumanDuration) {
    this.env.logger.warn(
      "The method setRefreshInterval is deprecated. Please define the refresh interval via the config file in 's3.bucketRefreshSchedule' instead",
    );
    this.refreshInterval = refreshInterval;
    return this;
  }

  /**
   * Analyzes the identity of the user that made the request and checks
   * for permissions to make such request. Throws an error if the request
   * is not authorized or the user has no permissions.
   *
   * @param request - The received request
   * @param permission - The permission to be checked by the backend
   * @returns The decision made by the backend
   */
  private async evaluateRequest(
    request: express.Request,
    permission: QueryPermissionRequest,
  ): Promise<{
    decision: PolicyDecision;
  }> {
    const credentials = await this.env.httpAuth.credentials(request, {
      allowLimitedAccess: true,
    });

    const decision = (
      await this.env.permissions.authorizeConditional([permission], {
        credentials,
      })
    )[0];

    if (decision.result === AuthorizeResult.DENY) {
      throw new NotAllowedError('Unauthorized');
    }

    return { decision };
  }

  /**
   * Parses the decision retuned by the permission backend into a bucket filter, which
   * is used in the bucketsProvider to return only the allowed buckets.
   *
   * @param decision - The decision returned by the permission backend
   * @returns The filter used if the decision is conditional. `undefined` otherwise
   */
  protected getBucketFilter(
    decision: PolicyDecision,
  ): BucketDetailsFilters | undefined {
    if (decision.result !== AuthorizeResult.CONDITIONAL) {
      return undefined;
    }
    return transformConditions(decision.conditions);
  }

  /**
   * Receives the decision made and checks if the user is allowed to make such request.
   *
   * It throws an error if the bucket is not found or if the user is not
   * authorized to request data for a certain bucket.
   *
   * @param endpoint - The endpoint where the bucket is
   * @param bucket - The bucket name
   * @param decision - The decision returned by the permission backend
   */
  protected requireBucketPermission(
    endpoint: string,
    bucket: string,
    decision: PolicyDecision,
  ) {
    const bucketInfo = this.bucketsProvider?.getBucketInfo(endpoint, bucket);
    if (!bucketInfo) {
      throw new NotFoundError();
    }

    const filter = this.getBucketFilter(decision);
    if (!matches(bucketInfo, filter)) {
      throw new NotAllowedError();
    }
  }

  /**
   * Builds the backend routes for S3.
   *
   * @param client - The S3 client used to list the secrets.
   * @returns The generated backend router
   */
  protected buildRouter(client: S3Api): express.Router {
    const router = Router();
    router.use(express.json());
    router.use(cookieParser());

    router.get('/health', (_, res) => {
      res.json({ status: 'ok' });
    });

    router.get('/cookie', async (req, res) => {
      const credentials = await this.env.httpAuth.credentials(req, {
        allowLimitedAccess: true,
        allow: ['user'],
      });

      const { expiresAt } = await this.env.httpAuth.issueUserCookie(res, {
        credentials,
      });
      res.status(200).json({ expiresAt: expiresAt.toISOString() });
    });

    router.get('/buckets', async (req, res) => {
      const { decision } = await this.evaluateRequest(req, {
        permission: permissions.s3BucketList,
      });

      const filter = this.getBucketFilter(decision);
      const buckets = this.bucketsProvider?.getAllBuckets(filter);
      if (!buckets) {
        throw new NotFoundError();
      }
      res.json(buckets);
    });

    router.get('/buckets/by-endpoint', async (req, res) => {
      const { decision } = await this.evaluateRequest(req, {
        permission: permissions.s3BucketList,
      });

      const filter = this.getBucketFilter(decision);
      const { endpoint } = req.query;
      const bucketsByEndpoint = this.bucketsProvider?.getBucketsByEndpoint(
        endpoint as string,
        filter,
      );
      if (!bucketsByEndpoint) {
        throw new NotFoundError();
      }
      res.json(bucketsByEndpoint);
    });

    router.get('/buckets/grouped', async (req, res) => {
      const { decision } = await this.evaluateRequest(req, {
        permission: permissions.s3BucketList,
      });

      const { bucketName } = req.query;

      const permissionFilter = this.getBucketFilter(decision);

      const paramFilters: BucketDetailsFilters[] = [];

      if (bucketName) {
        paramFilters.push({
          property: 'bucket',
          values: [bucketName.toString()],
        });
      }

      const finalFilter: BucketDetailsFilters = {
        allOf: [
          ...(paramFilters.length ? [{ allOf: paramFilters }] : []),
          ...(permissionFilter ? [permissionFilter] : []),
        ],
      };

      const groupedBuckets =
        this.bucketsProvider?.getGroupedBuckets(finalFilter);
      if (!groupedBuckets) {
        throw new NotFoundError();
      }
      res.json(groupedBuckets);
    });

    router.get('/bucket/:bucket', async (req, res) => {
      const { decision } = await this.evaluateRequest(req, {
        permission: permissions.s3BucketRead,
      });

      const { bucket } = req.params;
      const { endpoint } = req.query;
      const bucketInfo = this.bucketsProvider?.getBucketInfo(
        endpoint as string,
        bucket,
      );
      if (!bucketInfo) {
        throw new NotFoundError();
      }

      const filter = this.getBucketFilter(decision);
      if (!matches(bucketInfo, filter)) {
        throw new NotAllowedError();
      }
      res.json(bucketInfo);
    });

    router.get('/bucket/:bucket/keys', async (req, res) => {
      const { decision } = await this.evaluateRequest(req, {
        permission: permissions.s3BucketRead,
      });

      const { bucket } = req.params;
      const { continuationToken, pageSize, folder, prefix, endpoint } =
        req.query;

      this.requireBucketPermission(endpoint as string, bucket, decision);

      const keys = await client.listBucketKeys(
        endpoint as string,
        bucket,
        continuationToken as string,
        Number(pageSize as string),
        folder as string,
        prefix as string,
      );
      res.json(keys);
    });

    router.get('/bucket/:bucket/:key', async (req, res) => {
      const { decision } = await this.evaluateRequest(req, {
        permission: permissions.s3ObjectRead,
      });

      const { bucket, key } = req.params;
      const { endpoint } = req.query;

      this.requireBucketPermission(endpoint as string, bucket, decision);

      const object = await client.headObject(endpoint as string, bucket, key);
      res.json(object);
    });

    router.get('/stream/:bucket/:key', async (req, res) => {
      const { decision } = await this.evaluateRequest(req, {
        permission: permissions.s3ObjectDownload,
      });

      const { bucket, key } = req.params;
      const { endpoint } = req.query;

      this.requireBucketPermission(endpoint as string, bucket, decision);

      const object = await client.headObject(endpoint as string, bucket, key);
      res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${object.downloadName}"`,
      );
      res.setHeader('Content-Type', object.contentType);
      if (object.contentLength) {
        res.setHeader('Content-Length', object.contentLength);
      }

      const body = await client.streamObject(endpoint as string, bucket, key);
      body.on('error', err => {
        assertError(err);
        this.env.logger.error(err.message);
        res.status(400).send(err.message);
      });
      body.on('data', data => res.write(data));
      body.on('end', () => res.send());
    });

    return router;
  }
}
