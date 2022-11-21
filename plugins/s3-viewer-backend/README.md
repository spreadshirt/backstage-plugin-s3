# @spreadshirt/backstage-plugin-s3-viewer-backend

A backend for the s3-viewer. This plugin connects to the AWS S3 instances and fetches the data requested by the frontend.

## Introduction

Amazon Simple Storage Service (Amazon S3) is an object storage service that offers industry-leading scalability, data availability, security, and performance.

With this plugin you will be able to navigate around your internal AWS S3 storage using a table view, as well as previewing and downloading the objects stored there.

It also includes a permission integration, to restrict access to certain data within your S3 instance.

## Getting started

To get started, follow these steps:

1. Install the plugin by running this command:
    ```bash
    # From your Backstage root directory
    yarn add --cwd packages/backend @spreadshirt/backstage-plugin-s3-viewer-backend
    ```

2. Create a file in `src/plugins/s3.ts` and add a reference to it in `src/index.ts`:
    ```typescript
    // In packages/backend/src/plugins/s3.ts
    import { S3Builder } from '@spreadshirt/backstage-plugin-s3-viewer-backend';
    import { Router } from 'express';
    import { PluginEnvironment } from '../types';
    export default async function createPlugin(
      env: PluginEnvironment,
    ): Promise<Router> {
      const { router } = S3Builder.createBuilder({
        config: env.config,
        logger: env.logger,
        scheduler: env.scheduler,
        discovery: env.discovery,
        identity: env.identity,
        permissions: env.permissions,
      }).build();
      return router;
    }
    ```

    ```diff
    diff --git a/packages/backend/src/index.ts b/packages/backend/src/index.ts
    index f2b14b2..2c64f47 100644
    --- a/packages/backend/src/index.ts
    +++ b/packages/backend/src/index.ts
    @@ -22,6 +22,7 @@ import { Config } from '@backstage/config';
     import app from './plugins/app';
    +import s3 from './plugins/s3';
     import scaffolder from './plugins/scaffolder';
    @@ -56,6 +57,7 @@ async function main() {
       const authEnv = useHotMemoize(module, () => createEnv('auth'));
    +  const s3Env = useHotMemoize(module, () => createEnv('s3'));
       const proxyEnv = useHotMemoize(module, () => createEnv('proxy'));
    @@ -63,6 +65,7 @@ async function main() {
       const apiRouter = Router();
       apiRouter.use('/catalog', await catalog(catalogEnv));
    +  apiRouter.use('/s3', await s3(s3Env));
       apiRouter.use('/scaffolder', await scaffolder(scaffolderEnv));
    ```

3. Add the configuration in the `app-config.yaml` file. This is explained in detail in the next section.

## Configuration

This plugin allows fetching the buckets from different endpoints and using different approaches. This is a full example entry in `app-config.yaml`:

```yaml
s3:
  bucketLocatorMethods:
    - type: config
      platforms:
        - endpoint: http://endpoint-one.com
          name: endpoint-one-name
          accessKeyId: ${ENDPOINT_ONE_ACCESS_KEY}
          secretAccessKey: ${ENDPOINT_ONE_SECRET_KEY}
        - endpoint: http://endpoint-two.com
          name: endpoint-two-name
          accessKeyId: ${ENDPOINT_TWO_ACCESS_KEY}
          secretAccessKey: ${ENDPOINT_TWO_SECRET_KEY}
    - type: radosgw-admin
      platforms:
        - endpoint: http://radosgw-endpoint.com
          name: radosgw-endpoint-name
          accessKeyId: ${RADOSGW_ACCESS_KEY}
          secretAccessKey: ${RADOSGW_SECRET_KEY}
  allowedBuckets:
    endpoint-one-name:
      - allowed-bucket-one
      - allowed-bucket-two
    radosgw-endpoint-name:
      - other-allowed-bucket
```

### bucketLocatorMethods

This is an array used to determine where to retrieve buckets from.

Valid bucket locator methods are:

- config
- radosgw-admin
- custom `CredentialsProvider`

`config`

With this method, the endpoints are defined in the configuration file and the bucket locator will then make requests there to fetch all the needed information.

`radosgw-admin`

With this locator, the configuration file will contain the endpoint and the credentials for the [radosgw-admin API](https://docs.ceph.com/en/latest/radosgw/adminops/). Then, it will request all the buckets inside and fetch the corresponding credentials for each of them.

`custom CredentialsProvider`

It is also possible to create a new CredentialsProvider if that is required for your use case. The needed interface just needs a `getBucketCredentials()` function, which will list all the buckets and the corresponding credentials for them. You could just check the `config` and `radosgw-admin` examples. Finally, to use the custom locator you will need to set it before calling the `builder.build()` method. Doing something like this:

```typescript
  const builder = S3Builder.createBuilder({
    config: env.config,
    logger: env.logger,
    scheduler: env.scheduler,
    discovery: env.discovery,
    identity: env.identity,
    permissions: env.permissions,
  }).setCredentialsProvider(new CustomCredentialsProvider());

  const { router } = await builder.build();
```

Both `config` and `radosgw-admin` have the same parameters. They are all explained below:

`platforms`

An array of platforms from where to retrieve the buckets.

`platforms.\*.endpoint`

The endpoint used to fetch the bucket information.

`platforms.\*.name` __(optional)__

A name to identify the endpoint. This value will be used in the URL for the `s3-viewer`, so a simplified name would make navigation easier. If not present, the value will be equal to the endpoint.

`platforms.\*.accessKeyId`

The accessKeyId to access the platform information or to make requests to radosgw-admin. Right now, it's more than enough to use a key with `read` permissions.

`platforms.\*.secretAccessKey`

The secretAccessKey to access the platform information or to make requests to radosgw-admin. Right now, it's more than enough to use a key with `read` permissions.

### allowedBuckets

For security, when selecting the `radosgw-admin` mode, you need to specify a list of buckets that are whitelisted. It can be done by doing regex as well. So `test-bucket-.*` would allow `test-bucket-one`, `test-bucket-two` and so on.

To achieve that you need to specify the __platform name__ and then an array of buckets to be allowed. You can add as much as you want. And if a platform is not defined here, by default all the buckets will be allowed.

## Customization

Apart from the custom `CredentialsProvider`, it is also possible to make more changes to the plugin, so that it can match your internal requirements.

### S3 Client

First of all, the client used to communicate with the S3 buckets can be overwritten. This client is the one used to list the bucket keys, get the object data and stream the contents of an object. The generated client must implement the `S3Api`. To attach it to the builder, use the method `setClient`:

```typescript
  const builder = S3Builder.createBuilder({
    config: env.config,
    logger: env.logger,
    scheduler: env.scheduler,
    discovery: env.discovery,
    identity: env.identity,
    permissions: env.permissions,
  }).setClient(new CustomS3Client());

  const { router } = await builder.build();
```

### Buckets Provider

It is responsible for fetching all the bucket information for the obtained platforms and credentials, which were fetched by the `CredentialsProvider`. This interface is used in the router, so the data can be properly displayed later in the UI. This must implement the interface `BucketsProvider`. Use the method `setBucketsProvider` to override it:

```typescript
  const builder = S3Builder.createBuilder({
    config: env.config,
    logger: env.logger,
    scheduler: env.scheduler,
    discovery: env.discovery,
    identity: env.identity,
    permissions: env.permissions,
  }).setBucketsProvider(new CustomBucketsProvider());

  const { router } = await builder.build();
```

### Bucket Stats Provider

By default, the S3 API doesn't provide a straight forward way to fetch information for the buckets, specially the number of objects inside or the size in MB of it. Due to this, this plugin will always return `zero` for those 2 values unless this provider is defined by the user. An example to fetch this data is by using the `radosgw-admin` API, so if you're using the `radosgw-admin` method to locate buckets, it might be useful to implement this as well. As a hint, the endpoint to fetch the bucket information is `<ENDPOINT>/admin/bucket?bucket=<BUCKET_NAME>&format=json`, and the returned object will contain that information under `usage.rgw.main`. The defined providr has to implement the interface `BucketStatsProvider`, and as for the other customizations, it will only be used if it's properly attached to the builder:

```typescript
  const builder = S3Builder.createBuilder({
    config: env.config,
    logger: env.logger,
    scheduler: env.scheduler,
    discovery: env.discovery,
    identity: env.identity,
    permissions: env.permissions,
  }).setBucketStatsProvider(new CustomBucketStatsProvider());

  const { router } = await builder.build();
```

### Refresh Interval

Finally, it might be useful to refresh the bucket information, so that this data is always up to date. By default, the refresh is disabled, and it has to be defined by the user. To use it, the user just needs to set the frequency of this update by using the `HumanDuration` type, as with the `scheduler` env.

```typescript
  const builder = S3Builder.createBuilder({
    config: env.config,
    logger: env.logger,
    scheduler: env.scheduler,
    discovery: env.discovery,
    identity: env.identity,
    permissions: env.permissions,
  }).setRefreshInternal({ minutes: 30 });

  const { router } = await builder.build();
```

## Permissions Setup

The information present in the S3 buckets can be dangerous to be shared to all the Backstage users. Therefore, the permissions setup is needed. In order to make it work, every request to this plugin needs to have an `Authorization` header or a cookie called `token`. To achieve that, you can follow this tutorial to [Authenticate API requests](https://github.com/backstage/backstage/blob/master/contrib/docs/tutorials/authenticate-api-requests.md). Note that the [service-to-service auth](https://backstage.io/docs/auth/service-to-service-auth) is also needed.

Once this setup is done, you will need to extend the permission policy to check for the available permissions and `ALLOW` or `DENY` the access to any data you want. This step is completely up to the end user, as the way of obtaining this permissions might differ from every company. The following example would allow to list all the buckets and keys, but deny downloading the objects:

```typescript
  // In packages/backend/src/plugins/permission.ts
  import { S3_VIEWER_RESOURCE_TYPE, permissions as s3ViewerPermissions } from '@spreadshirt/backstage-plugin-s3-viewer-common';
  // other imports...

  exporrt class CustomPolicy implements PermissionPolicy {
    async handle(
    request: PolicyQuery,
    user?: BackstageIdentityResponse,
  ): Promise<PolicyDecision> {
    // other permission checks

    if (isResourcePermission(request.permission, S3_VIEWER_RESOURCE_TYPE)) {
      if (isPermission(request.permission, s3ViewerPermissions.s3ViewerObjectDownload)) {
        return { result: AuthorizeResult.DENY };
      }
      return { result: AuthorizeResult.ALLOW };
    }

    return { result: AuthorizeResult.ALLOW };
  }
  }
  
```