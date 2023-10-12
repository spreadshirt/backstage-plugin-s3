import {
  BucketStatsProvider,
  BucketsProvider,
  CredentialsProvider,
  S3Api,
  s3ViewerExtensionPoint,
} from '@spreadshirt/backstage-plugin-s3-viewer-node';
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { S3Builder } from './S3Builder';
import express from 'express';

export const s3ViewerPlugin = createBackendPlugin({
  pluginId: 's3-viewer',
  register(env) {
    let s3Client: S3Api;
    let s3CredentialsProvider: CredentialsProvider;
    let s3BucketsProvider: BucketsProvider;
    let s3BucketStatsProvider: BucketStatsProvider;
    let s3Middleware: express.RequestHandler;

    env.registerExtensionPoint(s3ViewerExtensionPoint, {
      setClient(client) {
        if (s3Client !== undefined) {
          throw new Error('A S3 client has been already set');
        }
        s3Client = client;
      },
      setCredentialsProvider(credentialsProvider) {
        if (s3CredentialsProvider !== undefined) {
          throw new Error('A credentials provider has been already set');
        }
        s3CredentialsProvider = credentialsProvider;
      },
      setBucketsProvider(bucketsProvider) {
        if (s3BucketsProvider !== undefined) {
          throw new Error('A buckets provider has been already set');
        }
        s3BucketsProvider = bucketsProvider;
      },
      setBucketStatsProvider(bucketStatsProvider) {
        if (s3BucketStatsProvider !== undefined) {
          throw new Error('A bucket stats provider has been already set');
        }
        s3BucketStatsProvider = bucketStatsProvider;
      },
      setPermissionMiddleware(middleware) {
        if (s3Middleware !== undefined) {
          throw new Error('A middleware has been already set');
        }
        s3Middleware = middleware;
      },
    });

    env.registerInit({
      deps: {
        logger: coreServices.logger,
        config: coreServices.rootConfig,
        scheduler: coreServices.scheduler,
        discovery: coreServices.discovery,
        identity: coreServices.identity,
        permissions: coreServices.permissions,
        tokenManager: coreServices.tokenManager,
        httpRouter: coreServices.httpRouter,
      },
      async init(deps) {
        let builder = S3Builder.createBuilder(deps);

        if (s3Client) {
          builder = builder.setClient(s3Client);
        }
        if (s3CredentialsProvider) {
          builder = builder.setCredentialsProvider(s3CredentialsProvider);
        }
        if (s3BucketsProvider) {
          builder = builder.setBucketsProvider(s3BucketsProvider);
        }
        if (s3BucketStatsProvider) {
          builder = builder.setBucketStatsProvider(s3BucketStatsProvider);
        }
        if (deps.config.getOptionalBoolean('s3.permissionMiddleware')) {
          builder = await builder.useMiddleware(s3Middleware);
        }

        const { router } = await builder.build();
        deps.httpRouter.use(router);
      },
    });
  },
});
