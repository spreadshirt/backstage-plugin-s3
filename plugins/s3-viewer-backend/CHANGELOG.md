# @spreadshirt/backstage-plugin-s3-viewer-backend

## 0.4.0

### Minor Changes

- 7dfa4f9: Actually support custom S3 clients

## 0.3.2

### Patch Changes

- 5d7ad9b: Bump dependencies to backstage 1.16.0
- d6a18e0: Security updates found by [dependabot](https://github.com/spreadshirt/backstage-plugin-s3/security/dependabot).
  Fixed some criticals for `loader-utils`, `@xmldom/xmldom` and high alerts for
  `yaml`, `webpack`, `knex`, `luxon`, `json5` or `minimatch`
- Updated dependencies [5d7ad9b]
- Updated dependencies [d6a18e0]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.3.2

## 0.3.1

### Patch Changes

- 9a3fcf3: Align aws-sdk dependencies with backstage 1.15.0
- 1965d2c: Bump dependencies to Backstage 1.15.0
- 1965d2c: Remove deprecated `BackstageTheme` and unnecessary package import
- Updated dependencies [9a3fcf3]
- Updated dependencies [1965d2c]
- Updated dependencies [1965d2c]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.3.1

## 0.3.0

### Minor Changes

- e83665c: **BREAKING**: Migrated to AWS-SDK version 3. Now the platform config requires a new field called `region`. If not present, the plugin will fail on startup.

### Patch Changes

- 30f0a93: Fix small issue while paging keys and remove unused field in `ListBucketKeysResult`
- 466d55f: Bump backstage dependencies to version `1.14.1` & align some internal `aws-sdk` dependencies
- Updated dependencies [e83665c]
- Updated dependencies [30f0a93]
- Updated dependencies [466d55f]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.3.0

## 0.2.6

### Patch Changes

- 797eb6a: Bump Backstage packages to version `1.13.0`
- Updated dependencies [797eb6a]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.2.5

## 0.2.5

### Patch Changes

- 97d5616: Upgrade dependencies to Backstage 1.12.1
- Updated dependencies [97d5616]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.2.4

## 0.2.4

### Patch Changes

- cf3bd09: Upgrade backstage dependencies to version 1.11.0
- Updated dependencies [cf3bd09]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.2.3

## 0.2.3

### Patch Changes

- 860ef59: Upgrade backstage dependencies to version `1.10.1`

  Prepare plugin to use some of the new BackendServices, if they are already in use. This applies to
  the Discovery, Logger and TokenManager so far. For end-users nothing will change, it's just an
  internal change.

- Updated dependencies [860ef59]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.2.2

## 0.2.2

### Patch Changes

- 1a1cc50: Speed up backend startup by not waiting for the `S3BucketsProvider` to fetch all the buckets when the `S3Builder.build()` method is called. Let it do it asynchronously.
- 74f89f9: Implement isolated testing environment thanks to a docker container with `ceph` and add a `config.d.ts` for good practices.

## 0.2.1

### Patch Changes

- 55629e3: Update dependencies to Backstage 1.9.1
- Updated dependencies [55629e3]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.2.1

## 0.2.0

### Minor Changes

- aa8f726: **BREAKING**: The s3-viewer-backend `createRouter` now requires that the `identityApi`, `permissionEvaluator` and `tokenManager` are passed to the router.

  These changes are **required** to `packages/backend/src/plugins/s3.ts`

  This change makes the requests to the s3 endpoint to be sent by a logged in user.

  ```diff
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
  +   identity: env.identity,
  +   permissions: env.permissions,
  +   tokenManager: env.tokenManager,
      }).build();
      return router;
  }
  ```

  Also possible to attach a middleware, which will be required to use the permissions in the plugin. For that, use the async function `useMiddleware()`. A custom middleware can also be used if that is needed.

### Patch Changes

- Updated dependencies [caaac67]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.2.0

## 0.1.7

### Patch Changes

- 74fef18: Update dependencies to backstage 1.8.2
- Updated dependencies [74fef18]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.1.4

## 0.1.6

### Patch Changes

- 91c40a8: Update dependencies to backstage 1.7.0
- Updated dependencies [91c40a8]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.1.3

## 0.1.5

### Patch Changes

- 58dcfce: Upgrade dependencies to backstage 1.6.0 & migrate to react-router v6 stable
- Updated dependencies [58dcfce]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.1.2

## 0.1.4

### Patch Changes

- b9f9f42: Change excludedBuckets by allowedBuckets when using the `radosgw-admin` bucketLocatorMethod.

  By doing this, we secure which buckets are listed per platform, allowing the use of regex patterns
  to reduce the list size. If no allowedBuckets are defined for a platform, then all the buckets will
  be allowed by default.

## 0.1.3

### Patch Changes

- 5ad44d7: Fix discoveryApi call by getting the externalBaseUrl instead of the baseUrl

## 0.1.2

### Patch Changes

- 8deb36f: Initial plugin version
- Updated dependencies [8deb36f]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.1.1
