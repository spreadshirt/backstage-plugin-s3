import { Config } from '@backstage/config';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import {
  BucketsProvider,
  BucketStatsProvider,
  CredentialsProvider,
} from '../types';
import { S3BucketsProvider } from './S3BucketsProvider';
import { S3Client } from './S3Api';
import {
  errorHandler,
  PluginEndpointDiscovery,
  TokenManager,
} from '@backstage/backend-common';
import { PluginTaskScheduler } from '@backstage/backend-tasks';
import { HumanDuration } from '@backstage/types';
import {
  assertError,
  AuthenticationError,
  NotAllowedError,
} from '@backstage/errors';
import { IdentityApi } from '@backstage/plugin-auth-node';
import {
  AuthorizePermissionRequest,
  AuthorizeResult,
  PermissionEvaluator,
  PolicyDecision,
  QueryPermissionRequest,
} from '@backstage/plugin-permission-common';
import { permissions } from '@spreadshirt/backstage-plugin-s3-viewer-common';
import { getCombinedCredentialsProvider } from '../credentials-provider';
import cookieParser from 'cookie-parser';
import { noopMiddleware, s3Middleware } from '../middleware';

export interface S3Environment {
  logger: Logger;
  config: Config;
  scheduler: PluginTaskScheduler;
  discovery: PluginEndpointDiscovery;
  identity: IdentityApi;
  permissions: PermissionEvaluator;
  tokenManager: TokenManager;
}

export interface S3BuilderReturn {
  router: express.Router;
}

export class S3Builder {
  private refreshInterval: HumanDuration | undefined = undefined;
  private client?: S3Client;
  private credentialsProvider?: CredentialsProvider;
  private bucketsProvider?: BucketsProvider;
  private statsProvider?: BucketStatsProvider;
  private s3Middleware: express.RequestHandler = noopMiddleware();

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

    const credentialsProvider =
      this.credentialsProvider ?? this.buildCredentialsProvider();

    this.bucketsProvider =
      this.bucketsProvider ??
      (await S3BucketsProvider.create(
        logger,
        scheduler,
        credentialsProvider,
        this.statsProvider,
        this.refreshInterval,
      ));

    this.env.logger.info(
      `Found ${this.bucketsProvider.getAllBuckets().length} S3 buckets`,
    );

    this.client =
      this.client ??
      new S3Client({
        bucketsProvider: this.bucketsProvider,
        discoveryApi: discovery,
      });

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
  public setClient(client: S3Client) {
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
   */
  public setRefreshInterval(refreshInterval: HumanDuration) {
    this.refreshInterval = refreshInterval;
    return this;
  }

  /**
   * Sets the middleware to be used in the s3 backend. By default it's a no-op middleware.
   * Used to authenticate the requests from the frontend, specially the streaming ones, 
   * as it's not possible to add the headers in the frontend plugin.
   * 
   * This is needed to use the permissions setup. Even though, in a development setup this
   * command can be skipped, otherwise the requests to the backend will all return a 401.
   * @param middleware - The middleware used in the s3 backend. If not set,
   * the default one will be used
   * @returns
   */
  public async useMiddleware(
    middleware?: (
      config: Config,
      appEnv: S3Environment,
    ) => Promise<express.RequestHandler>,
  ) {
    this.s3Middleware = middleware
      ? await middleware(this.env.config, this.env)
      : await s3Middleware(this.env.config, this.env);
    return this;
  }

  /**
   * Analyzes the identity of the user that made the request and checks
   * for permissions to make such request. Throws an error if the request
   * is not authorized or the user has no permissions.
   *
   * @param request - The received request
   */
  private async evaluateRequest(
    request: express.Request,
    permission: AuthorizePermissionRequest | QueryPermissionRequest,
  ): Promise<{
    decision: PolicyDecision;
  }> {
    // If not in production, allow all the requests
    if (process.env.NODE_ENV !== 'production') {
      return {
        decision: { result: AuthorizeResult.ALLOW },
      };
    }

    const user = await this.env.identity.getIdentity({ request });
    if (!user) {
      throw new AuthenticationError(
        "Missing 'Authorization' header in request",
      );
    }

    const decision = (
      await this.env.permissions.authorize(
        [permission as AuthorizePermissionRequest],
        { token: user.token },
      )
    )[0];

    if (decision.result === AuthorizeResult.DENY) {
      throw new NotAllowedError('Unauthorized');
    }

    return { decision };
  }

  /**
   * Builds the backend routes for S3.
   *
   * @param client - The S3 client used to list the secrets.
   * @returns The generated backend router
   */
  protected buildRouter(client: S3Client): express.Router {
    const router = Router();
    router.use(express.json());
    router.use(cookieParser());

    router.get('/health', (_, res) => {
      res.json({ status: 'ok' });
    });

    router.get('/cookie', this.s3Middleware, (_req, res) => {
      res.status(200).send('Setting S3 cookie');
    });

    router.get('/buckets', this.s3Middleware, async (req, res) => {
      await this.evaluateRequest(req, {
        permission: permissions.s3ViewerBucketsList,
      });

      const buckets = this.bucketsProvider?.getAllBuckets();
      if (!buckets) {
        res.sendStatus(404);
      }
      res.json(buckets);
    });
    router.get('/buckets/by-endpoint', this.s3Middleware, async (req, res) => {
      await this.evaluateRequest(req, {
        permission: permissions.s3ViewerBucketsList,
      });

      const { endpoint } = req.query;
      const bucketsByEndpoint = this.bucketsProvider?.getBucketsByEndpoint(
        endpoint as string,
      );
      if (!bucketsByEndpoint) {
        res.sendStatus(404);
      }
      res.json(bucketsByEndpoint);
    });

    router.get('/buckets/grouped', this.s3Middleware, async (req, res) => {
      await this.evaluateRequest(req, {
        permission: permissions.s3ViewerBucketsList,
      });

      const groupedBuckets = this.bucketsProvider?.getGroupedBuckets();
      if (!groupedBuckets) {
        res.sendStatus(404);
      }
      res.json(groupedBuckets);
    });

    router.get(`/bucket/:bucket`, this.s3Middleware, async (req, res) => {
      await this.evaluateRequest(req, {
        permission: permissions.s3ViewerBucketsRead,
      });

      const { bucket } = req.params;
      const { endpoint } = req.query;
      const bucketInfo = this.bucketsProvider?.getBucketInfo(
        endpoint as string,
        bucket,
      );
      if (!bucketInfo) {
        res.sendStatus(404);
      }
      res.json(bucketInfo);
    });

    router.get('/bucket/:bucket/keys', this.s3Middleware, async (req, res) => {
      await this.evaluateRequest(req, {
        permission: permissions.s3ViewerBucketsRead,
      });

      const { bucket } = req.params;
      const { continuationToken, pageSize, folder, prefix, endpoint } =
        req.query;
      try {
        const data = await client.listBucketKeys(
          endpoint as string,
          bucket,
          continuationToken as string,
          Number(pageSize as string),
          folder as string,
          prefix as string,
        );
        res.json(data);
      } catch (e) {
        assertError(e);
        this.env.logger.error(e.message);
        res.status(400).send(e.message);
      }
    });

    router.get('/bucket/:bucket/:key', this.s3Middleware, async (req, res) => {
      await this.evaluateRequest(req, {
        permission: permissions.s3ViewerObjectRead,
      });

      const { bucket, key } = req.params;
      const { endpoint } = req.query;
      try {
        const data = await client.headObject(endpoint as string, bucket, key);
        res.json(data);
      } catch (e) {
        assertError(e);
        this.env.logger.error(e.message);
        res.status(400).send(e.message);
      }
    });

    router.get('/stream/:bucket/:key', this.s3Middleware, async (req, res) => {
      await this.evaluateRequest(req, {
        permission: permissions.s3ViewerObjectDownload,
      });

      const { bucket, key } = req.params;
      const { endpoint } = req.query;

      try {
        const data = await client.headObject(endpoint as string, bucket, key);
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${data.downloadName}"`,
        );
        res.setHeader('Content-Type', data.contentType);
        if (data.contentLength) {
          res.setHeader('Content-Length', data.contentLength);
        }
      } catch (e) {
        assertError(e);
        this.env.logger.error(e.message);
        res.status(400).send(e.message);
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

    router.use(this.s3Middleware, errorHandler());

    return router;
  }
}
