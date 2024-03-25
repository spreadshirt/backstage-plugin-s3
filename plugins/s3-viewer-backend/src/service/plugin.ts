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

export const s3ViewerPlugin = createBackendPlugin({
  pluginId: 's3-viewer',
  register(env) {
    let s3Client: S3Api;
    let s3CredentialsProvider: CredentialsProvider;
    let s3BucketsProvider: BucketsProvider;
    let s3BucketStatsProvider: BucketStatsProvider;

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
    });

    env.registerInit({
      deps: {
        auth: coreServices.auth,
        logger: coreServices.logger,
        config: coreServices.rootConfig,
        scheduler: coreServices.scheduler,
        discovery: coreServices.discovery,
        permissions: coreServices.permissions,
        httpAuth: coreServices.httpAuth,
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

        const { router } = await builder.build();
        deps.httpRouter.use(router);

        // Allow access with Backstage user-cookie as some requests happen client-side
        // from a `img` and `button` elements, which can't set the token via fetchApi.
        deps.httpRouter.addAuthPolicy({
          path: '/stream',
          allow: 'user-cookie',
        });
      },
    });
  },
});
