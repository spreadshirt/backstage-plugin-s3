# @spreadshirt/backstage-plugin-s3-viewer-backend

A backend for the s3-viewer. This plugin connects to the AWS S3 instances and fetches the data requested by the frontend.

![S3 Viewer Plugin Overview](../../demo/examples/img1.png)

## Introduction

Amazon Simple Storage Service (Amazon S3) is an object storage service that offers industry-leading scalability, data availability, security, and performance.

With this plugin, you will be able to navigate around your internal AWS S3 storage using a table view, get information about a certain bucket or object, preview the object and download it.

It also includes a permission integration, to restrict access to certain data within your S3 instance.

## Getting started

If you want to use the plugin add the following line in the `src/index.ts`:

```typescript
// In packages/backend/src/index.ts

backend.add(import('@spreadshirt/backstage-plugin-s3-viewer-backend'));
```

This line will initialize the backend with all the default configurations. It is possible to customize it by adding a backend module to our app, by doing something like:

```typescript
import { s3ViewerExtensionPoint } from '@spreadshirt/backstage-plugin-s3-viewer-node';

const s3ViewerExtensions = createBackendModule({
  pluginId: 's3-viewer',
  moduleId: 'extensions',
  register(reg) {
    reg.registerInit({
      deps: {
        extension: s3ViewerExtensionPoint,
      },
      async init({ extension }) {
        /// ...
      },
    });
  },
});

backend.add(s3ViewerExtensions());
```

The `extensions` type contains all the needed functions to override any of the elements that are defined in the next section.

## Configuration

This plugin allows fetching the buckets from different endpoints and using different approaches. This is a full example entry in `app-config.yaml`:

```yaml
s3:
  showBucketDetails: true # Optional default (true)
  audit:
    download:
      severityLevel: low # Optional - default is 'medium'
  bucketLocatorMethods:
    - type: config
      platforms:
        - endpoint: http://endpoint-one.com
          name: endpoint-one-name
          region: us-east-1
          accessKeyId: ${ENDPOINT_ONE_ACCESS_KEY}
          secretAccessKey: ${ENDPOINT_ONE_SECRET_KEY}
        - endpoint: http://endpoint-two.com
          name: endpoint-two-name
          region: us-east-1
          accessKeyId: ${ENDPOINT_TWO_ACCESS_KEY}
          secretAccessKey: ${ENDPOINT_TWO_SECRET_KEY}
    - type: radosgw-admin
      platforms:
        - endpoint: http://radosgw-endpoint.com
          name: radosgw-endpoint-name
          region: us-east-1
          accessKeyId: ${RADOSGW_ACCESS_KEY}
          secretAccessKey: ${RADOSGW_SECRET_KEY}
    - type: iam-role
      platforms:
        - endpoint: http://iam-endpoint.com
          name: iam-endpoint-name
          region: us-east-1
  allowedBuckets:
    - platform: endpoint-one-name
      buckets:
        - allowed-bucket-one
        - allowed-bucket-two
    - platform: radosgw-endpoint-name
      buckets:
        - other-allowed-bucket
    - platform: iam-endpoint-name
      buckets:
        - another-bucket-name
  bucketRefreshSchedule:
    frequency: { minutes: 30 }
    timeout: { minutes: 1 }
```

### showBucketDetails

This is an optional setting which allows you to hide the bucket details tab from thew viewer page.

Can be useful in situations where a common service account is used for bucket management rather than individuals.

### audit

This lists any audit levels as per the [Backstage Auditor Service](https://backstage.io/docs/backend-system/core-services/auditor/)

Example:

```yaml
s3:
  audit:
    download:
      severityLevel: low # Optional - default is medium
```

This is a setting specifically for the `Download` category to audit it. This replaces the generic logger that was there in case of an error.

Recommended (default) is `medium` however and it's up to your requirements, you may wish to have them only for debug so set it to `low`. See [Audit Severity Mappings](https://backstage.io/docs/backend-system/core-services/auditor/#severity-levels-and-default-mappings).



### bucketLocatorMethods

This is an array used to determine where to retrieve buckets from.

Valid bucket locator methods are:

- config
- radosgw-admin
- iam-role
- custom `CredentialsProvider`

`config`

With this method, the endpoints are defined in the configuration file and the bucket locator will then make requests there to fetch all the needed information.

`radosgw-admin`

With this locator, the configuration file will contain the endpoint and the credentials for the [radosgw-admin API](https://docs.ceph.com/en/latest/radosgw/adminops/). Then, it will request all the buckets inside and fetch the corresponding credentials for each of them.

`iam-role`:

With this location, the configuration file will contain the endpoint and region needed to access the S3 buckets. In this case no credentials are needed because the [IAM roles](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html) are used instead.

`custom CredentialsProvider`

It is also possible to create a new CredentialsProvider if that is required for your use case. The needed interface just needs a `getBucketCredentials()` function, which will list all the buckets and the corresponding credentials for them. You could just check the `config` and `radosgw-admin` examples. Finally, to use the custom locator you will need to set it before calling the `builder.build()` method. Doing something like this:

```typescript
  const builder = S3Builder.createBuilder({
    auth: env.auth,
    config: env.config,
    logger: env.logger,
    scheduler: env.scheduler,
    discovery: env.discovery,
    permissions: env.permissions,
    httpAuth: env.httpAuth,
  }).setCredentialsProvider(new CustomCredentialsProvider());

  const { router } = await builder.build();
```

Both `config` and `radosgw-admin` have the same parameters. The `iam-role` have also the same parameters except the credentials. They are all explained below:

`platforms`

An array of platforms from where to retrieve the buckets.

`platforms.\*.endpoint`

The endpoint is used to fetch the bucket information.

`platforms.\*.region`

The region where the platform is located. This is required since the AWS SDK v3.

`platforms.\*.name` __(optional)__

A name to identify the endpoint. This value will be used in the URL for the `s3-viewer`, so a simplified name would make navigation easier. If not present, the value will be equal to the endpoint.

`platforms.\*.accessKeyId`

The accessKeyId is used to access the platform information or to make requests to radosgw-admin. Right now, it's more than enough to use a key with `read` permissions. The `iam-role` provider doesn't need this parameter.

`platforms.\*.secretAccessKey`

The secretAccessKey is used to access the platform information or to make requests to radosgw-admin. Right now, it's more than enough to use a key with `read` permissions. The `iam-role` provider doesn't need this parameter.

### allowedBuckets

For security, when selecting the `radosgw-admin` mode, you need to specify a list of buckets that are whitelisted. It can be done by doing regex as well. So `test-bucket-.*` would allow `test-bucket-one`, `test-bucket-two` and so on.

To achieve that you need to specify the __platform name__ and then an array of buckets to be allowed. You can add as much as you want. And if a platform is not defined here, by default all the buckets will be allowed.

### bucketRefreshSchedule

If set, the buckets provider will be executed with the defined schedule.

## Customization

Apart from the custom `CredentialsProvider`, it is also possible to make more changes to the plugin, so that it can match your internal requirements.

### S3 Client

First of all, the client used to communicate with the S3 buckets can be overwritten. This client is the one used to list the bucket keys, get the object data and stream the contents of an object. The generated client must implement the `S3Api`. To attach it to the builder, use the method `setClient`:

```typescript
  const builder = S3Builder.createBuilder({
    auth: env.auth,
    config: env.config,
    logger: env.logger,
    scheduler: env.scheduler,
    discovery: env.discovery,
    permissions: env.permissions,
    httpAuth: env.httpAuth,
  }).setClient(new CustomS3Client());

  const { router } = await builder.build();
```

In some cases you might need to use the internal `bucketsProvider` to fetch information for a bucket before making any request. In order to do that, the `S3Api` interface comes with an optional method `setBucketsProvider`. If defined in your client, the `build()` method will inject the `bucketsProvider` for you.

### Buckets Provider

It is responsible for fetching all the bucket information for the obtained platforms and credentials, which were fetched by the `CredentialsProvider`. This interface is used in the router, so the data can be properly displayed later in the UI. This must implement the interface `BucketsProvider`. Use the method `setBucketsProvider` to override it:

```typescript
  const builder = S3Builder.createBuilder({
    auth: env.auth,
    config: env.config,
    logger: env.logger,
    scheduler: env.scheduler,
    discovery: env.discovery,
    permissions: env.permissions,
    httpAuth: env.httpAuth,
  }).setBucketsProvider(new CustomBucketsProvider());

  const { router } = await builder.build();
```

### Bucket Stats Provider

By default, the S3 API doesn't provide a straightforward way to fetch information for the buckets, especially the number of objects inside or the size in MB of it. Due to this, this plugin will always return `zero` for those 2 values unless this provider is defined by the user. An example to fetch this data is by using the `radosgw-admin` API, so if you're using the `radosgw-admin` method to locate buckets, it might be useful to implement this as well. As a hint, the endpoint to fetch the bucket information is `<ENDPOINT>/admin/bucket?bucket=<BUCKET_NAME>&format=json`, and the returned object will contain that information under `usage.rgw.main`. The defined provider has to implement the interface `BucketStatsProvider`, and as for the other customizations, they will only be used if it's properly attached to the builder:

```typescript
  const builder = S3Builder.createBuilder({
    auth: env.auth,
    config: env.config,
    logger: env.logger,
    scheduler: env.scheduler,
    discovery: env.discovery,
    permissions: env.permissions,
    httpAuth: env.httpAuth,
  }).setBucketStatsProvider(new CustomBucketStatsProvider());

  const { router } = await builder.build();
```

### Refresh Interval

Finally, it might be useful to refresh the bucket information, so that this data is always up to date. By default the refresh is disabled and it has to be defined by the user. To use it, the user just needs to set the frequency directly in the configuration file. For example, to refresh the list of buckets every half hour and using a timeout of 1 minute:

```yaml
s3:
  bucketRefreshSchedule:
    frequency: { minutes: 30 }
    timeout: { minutes: 1 }
```
### Refresh API

To execute an adhoc refresh call rather than specific schedules a `POST` API is now available.

This requires a `service` token as discussed in [Backstage Service to Service Auth](https://backstage.io/docs/auth/service-to-service-auth/)


#### Examples:

[Static Access Token](https://backstage.io/docs/auth/service-to-service-auth/#static-tokens)
```yaml
backend:
  auth:
    externalAccess:
      - type: static
        options:
          token: ${S3_API_REFRESH_TOKEN} 
          # Can generate with node -p 'require("crypto").randomBytes(24).toString("base64")'
          subject: s3-viewier-api-test-token
        accessRestrictions:
          - plugin: s3-viewer
```
[Plugin to Plugin Auth](https://backstage.io/docs/auth/service-to-service-auth/#standard-plugin-to-plugin-auth)

```ts
const { token } = await auth.getPluginRequestToken({
  onBehalfOf: await auth.getOwnServiceCredentials(),
  targetPluginId: 's3-viewer', 
});
```

To verify it's working:

`curl -X POST http://localhost:7007/api/s3-viewer/buckets/refresh -v -H "Authorization: Bearer ${S3_API_REFRESH_TOKEN}"`



## Permissions Setup

The information present in the S3 buckets can be dangerous to be shared with all the Backstage users. Therefore, the permissions setup is needed. To make it work every request to this plugin needs to be authenticated. Most cases are already handled by the authentication service provided by Backstage. 
However, the preview and download of data from S3 require the Backstage `user-cookie` to be set as the requests come directly from browser interactions (`img` element and downloads) and those can't set the token using the fetchApi. The sign in has to be extended to make sure the cookie is set for the s3-viewer:

1. Customize the `SignInPage` to add a token as soon as a user is logged in:
  ```typescript
  // In packages/app/src/App.tsx
  // ...
  import { S3ApiRef } from '@spreadshirt/backstage-plugin-s3-viewer';

  const app = createApp({
    // ...

    components: {
      SignInPage: props => {
        const s3ViewerApi = useApi(S3ApiRef);
        return (
         <SignInPage // Or ProxiedSignInPage
            {...props}
            providers={['guest', 'custom', ...providers]}
            onSignInSuccess={async (identityApi: IdentityApi) => {
              props.onSignInSuccess(identityApi);
              await s3ViewerApi.setCookie();
            }}
          />
        );
      },
    },

    // ...
  });
  ```

2. Then, enable this feature in the backend. For that, add this function before the `build()` step:
  ```typescript
  const builder = S3Builder.createBuilder({
    auth: env.auth,
    config: env.config,
    logger: env.logger,
    scheduler: env.scheduler,
    discovery: env.discovery,
    permissions: env.permissions,
    httpAuth: env.httpAuth,
  }).useMiddleware();

  const { router } = await builder.build();
  ```

Once this setup is done, you will need to extend the permission policy to check for the available permissions and `ALLOW` or `DENY` access to any data you want. This step is completely up to the end user, as the way of obtaining these permissions might differ for every company. The following example would allow listing all the buckets and keys, but deny downloading and previewing the objects:

```typescript
  // In packages/backend/src/plugins/permission.ts
  import { S3_VIEWER_RESOURCE_TYPE, s3ViewerPermissions } from '@spreadshirt/backstage-plugin-s3-viewer-common';
  // other imports...

  exporrt class CustomPolicy implements PermissionPolicy {
    async handle(
    request: PolicyQuery,
    user?: BackstageIdentityResponse,
  ): Promise<PolicyDecision> {
    // other permission checks

    if (isResourcePermission(request.permission, S3_VIEWER_RESOURCE_TYPE)) {
      if (isPermission(request.permission, s3ViewerPermissions.s3ObjectDownload)) {
        return { result: AuthorizeResult.DENY };
      }
      return { result: AuthorizeResult.ALLOW };
    }

    return { result: AuthorizeResult.ALLOW };
  }
  
```

It's also possible to use conditional permissions. This allows the backend to filter elements depending on certain conditions. Right now it's possible to make conditional decisions on the bucket name and the bucket's owner. If a conditional permission is used, the backend will then apply a filter, so the frontend won't display the buckets that are not matching the conditions.

In the following example, we are allowing all the users to **list** all the buckets with owner `team-one` or `team-two`, but then restricting the **read** access to the buckets that are only owned by `team-one` (therefore, no bucket information will be available and no keys will be displayed in the table). Finally, the other requests of type `S3_VIEWER_RESOURCE_TYPE` will be denied: 

```typescript
  // In packages/backend/src/plugins/permission.ts
  import { S3_VIEWER_RESOURCE_TYPE, s3ViewerPermissions } from '@spreadshirt/backstage-plugin-s3-viewer-common';
  // other imports...

  exporrt class CustomPolicy implements PermissionPolicy {
    async handle(
    request: PolicyQuery,
    user?: BackstageIdentityResponse,
  ): Promise<PolicyDecision> {
    // other permission checks

    if (isResourcePermission(request.permission, S3_VIEWER_RESOURCE_TYPE)) {
      if (isPermission(request.permission, s3ViewerPermissions.s3BucketList)) {
        return createS3ViewerBucketsConditionalDecision(
          request.permission,
          s3ViewerBucketConditions.isBucketOwner({
            owners: ['team-one', 'team-two'],
          }),
        );
      }
      if (isPermission(request.permission, s3ViewerPermissions.s3BucketRead)) {
        return createS3ViewerBucketsConditionalDecision(
          request.permission,
          s3ViewerBucketConditions.isBucketOwner({
            owners: ['team-one'],
          }),
        );
      }
      return { result: AuthorizeResult.DENY };
    }

    return { result: AuthorizeResult.ALLOW };
  }
  
```

In case the access to buckets and other resources is dependent on the logged-in user, then you will need to fetch that information from an external source and apply the conditional decisions accordingly. This is not provided by the s3 plugin.
