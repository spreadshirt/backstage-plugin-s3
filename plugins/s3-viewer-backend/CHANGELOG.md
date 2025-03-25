# @spreadshirt/backstage-plugin-s3-viewer-backend

## 0.10.4

### Patch Changes

- bdcc773: Bump backstage dependencies to version 1.37.0
- Updated dependencies [bdcc773]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.12
  - @spreadshirt/backstage-plugin-s3-viewer-node@0.2.12

## 0.10.3

### Patch Changes

- 413638f: Remove usage of MiddlewareFactory. The error handler is added by the framework directly
- 7618c00: Bump backstage dependencies to version 1.35.0
- Updated dependencies [7618c00]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.11
  - @spreadshirt/backstage-plugin-s3-viewer-node@0.2.11

## 0.10.2

### Patch Changes

- 9cda47c: Bump backstage to version 1.33.5
- Updated dependencies [9cda47c]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.10
  - @spreadshirt/backstage-plugin-s3-viewer-node@0.2.10

## 0.10.1

### Patch Changes

- 56350c5: Fix release process due to 'workspace' references not being resolved.
  To do that, the previous setup using the exact version in the `package.json`
  has been brought back.
- Updated dependencies [56350c5]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.9
  - @spreadshirt/backstage-plugin-s3-viewer-node@0.2.9

## 0.10.0

### Minor Changes

- 5b89c04: **BREAKING**: Removed old backend system methods and test suite, which was already deprecated and not maintained. A proper solution will be provided later on.

  To install the plugin refer to the [updated documentation](https://github.com/spreadshirt/backstage-plugin-s3/tree/main/plugins/s3-viewer#getting-started)

### Patch Changes

- 7fc3ecc: Fix local dependencies for our plugins. This has been done by using the
  [following script](https://github.com/backstage/backstage/blob/master/scripts/verify-local-dependencies.js) available
  in the main Backstage repo.

  This is also the way the community-plugin workspaces work, so it's good to follow their setup too.

- c6b6505: Bump Backstage dependencies to version 1.32.2
- 5b89c04: Fix yarn add command in the documentation
- Updated dependencies [7fc3ecc]
- Updated dependencies [c6b6505]
  - @spreadshirt/backstage-plugin-s3-viewer-node@0.2.8
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.8

## 0.9.7

### Patch Changes

- cbcd1a3: Bump Backstage dependencies to version 1.31.1
- Updated dependencies [cbcd1a3]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.7
  - @spreadshirt/backstage-plugin-s3-viewer-node@0.2.7

## 0.9.6

### Patch Changes

- 9d522dc: Replace some deprecations caused by the removal of the backend-tasks plugin and deprecate old backend system.
  Please, remove any usage of `RouterOptions` and `createRouter`.

  The old backend system methods will be completely removed in the next release, so none of the deprecations
  caused by these functions are going to be addressed.

  More info about this process [in this issue](https://github.com/backstage/community-plugins/issues/1176).

  To set up the backend using the new backend system, follow [this documentation](https://github.com/spreadshirt/backstage-plugin-s3/tree/main/plugins/s3-viewer-backend#new-backend-system).

- aad8768: Bump Backstage dependencies to version 1.30.4
- Updated dependencies [aad8768]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.6
  - @spreadshirt/backstage-plugin-s3-viewer-node@0.2.6

## 0.9.5

### Patch Changes

- b8e88a4: Bump `aws-sdk` dependencies to newer versions
- b4e3d65: Bump backstage dependencies to version `1.29.2`
- 58e068a: Fix some of the deprecations from the last Backstage version
- Updated dependencies [b8e88a4]
- Updated dependencies [b4e3d65]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.5
  - @spreadshirt/backstage-plugin-s3-viewer-node@0.2.5

## 0.9.4

### Patch Changes

- 2598ba2: Fix backstage package metadata
- Updated dependencies [2598ba2]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.4
  - @spreadshirt/backstage-plugin-s3-viewer-node@0.2.4

## 0.9.3

### Patch Changes

- c8ca029: Bump Backstage dependencies to version 1.28.4
- Updated dependencies [c8ca029]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.3
  - @spreadshirt/backstage-plugin-s3-viewer-node@0.2.3

## 0.9.2

### Patch Changes

- b23661d: Bump backstage dependencies to version 1.27.2
- Updated dependencies [b23661d]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.2
  - @spreadshirt/backstage-plugin-s3-viewer-node@0.2.2

## 0.9.1

### Patch Changes

- 5676413: Use the `LoggerService` instead of the winstonLogger helper method, since the upstream plugins support the new service type now
- 76eda39: Bump backstage dependencies to version 1.26.0
- Updated dependencies [76eda39]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.1
  - @spreadshirt/backstage-plugin-s3-viewer-node@0.2.1

## 0.9.0

### Minor Changes

- c843d39: **BREAKING**: Migrate backend plugin to use the new auth service.

  No changes are required if running in the new backend system.

  In case you're still using the old backend system you'll need to make sure the
  new `auth` and `httpAuth` are sent, while the `identity` and `tokenManager` are not needed any longer.

- 444ccef: **BREAKING**: Replace `setTokenCookie` with new method integrated into the S3Api `setCookie()`.

  Due to the new authentication backend provided by Backstage in the version 1.24.0, we
  can now use this endpoint and simplify the whole setup.

- 926d0c9: **BREAKING**: Remove the `middleware` from the s3-viewer.

  With the newly authentication backend system, the middleware is not needed any longer,
  so it can be completely removed instead of keeping it here. _NOTE_ that using this
  `s3-viewer` version will require you to be up-to-date with the latest Backstage version as well.

### Patch Changes

- de0b7d8: Fix typo in the documentation
- 8cab3c0: Bump backstage dependencies to version 1.25.0
- 275d24c: Use new `PermissionsService` type in the backend instead of the deprecated `PermissionEvaluator`
- Updated dependencies [8cab3c0]
- Updated dependencies [444ccef]
- Updated dependencies [926d0c9]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.5.0
  - @spreadshirt/backstage-plugin-s3-viewer-node@0.2.0

## 0.8.0

### Minor Changes

- d7091b6: Add support to the [new backend system](https://backstage.io/docs/backend-system/).

  Follow the instructions in the [README.md](https://github.com/spreadshirt/backstage-plugin-s3/blob/main/plugins/s3-viewer-backend/README.md#new-backend-system)

  **DEPRECATION**: The method `setRefreshInterval` has been deprecated in favor of the usage of the configuration file to schedule the refresh.
  From now on, the schedule should be set using the `app-config.yaml` file. This method will be kept for some time as a fallback if the schedule
  has not been set via the configuration file.

- 5bc27f0: Support overriding the default middleware used in the s3 backend. **NOTE** that
  the custom middleware will _only_ be used if the `s3.permissionMiddleware` is set to `true`.

  Also loosen up a little bit how the middleware has to be defined. Before it was required
  to receive a `Config` and the `appEnv`, but now it's up to the user to decide which parameters
  they need. This might require some breaking changes in your code, but we don't expect many people
  needing to use this customization.

- 692b6ec: **BREAKING**: Some interfaces are now part of the `@spreadshirt/backstage-plugin-s3-viewer-node` package. If you were
  using them, switch to this new package.
- 84db8bf: **BREAKING**: Moved some types that were part of this package to `@spreadshirt/backstage-plugin-s3-viewer-common`.
  If you were using any of these types, please import them using `@spreadshirt/backstage-plugin-s3-viewer-common`:
  `BucketDetailsFilter`, `BucketDetailsFilters`, `S3Platform`, `BucketCredentials`, `AllowedBuckets`

### Patch Changes

- 0940010: Import new types from `@spreadshirt/backstage-plugin-s3-viewer-common`
- Updated dependencies [c947924]
- Updated dependencies [84db8bf]
- Updated dependencies [5bc27f0]
- Updated dependencies [58ccb15]
  - @spreadshirt/backstage-plugin-s3-viewer-node@0.1.0
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.4.0

## 0.7.6

### Patch Changes

- 05dfc57: Bump backstage packages to version `1.23.1`
- Updated dependencies [05dfc57]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.3.9

## 0.7.5

### Patch Changes

- 5f98357: Bump backstage dependencies to version 1.22.1
- Updated dependencies [5f98357]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.3.8

## 0.7.4

### Patch Changes

- 6a8666a: Add legacy flag for local development. This flag can be removed once the
  migration to the new backend-system is done.
- 133e6f1: Bump backstage dependencies to version 1.21.1
- Updated dependencies [133e6f1]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.3.7

## 0.7.3

### Patch Changes

- e0db1fd: Bump Backstage dependencies to version 1.21.2
- Updated dependencies [e0db1fd]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.3.6

## 0.7.2

### Patch Changes

- 2f463a3: Bump backstage dependencies to v1.19.2
- Updated dependencies [2f463a3]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.3.5

## 0.7.1

### Patch Changes

- a9414c1: Update backstage to 1.18.1
- Updated dependencies [a9414c1]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.3.4

## 0.7.0

### Minor Changes

- c30652f: Add new cluster location using IAM roles. Defined by using the platform
  type `iam-role`.

  This locator is similar to the `config` and `radosgw-admin`, but
  it doesn't need any credentials to be set. Check the
  [README file](https://github.com/spreadshirt/backstage-plugin-s3/blob/main/plugins/s3-viewer-backend/README.md)
  to see an example configuration and the needed parameters.

## 0.6.0

### Minor Changes

- e70177b: **BREAKING**: The `allowedBuckets` configuration has changed. From now on, you must use a
  configuration like the following:

  ```yaml
  s3:
    bucketLocatorMethods:
      - type: config
        platforms:
          - endpoint: <ENDPOINT>
            name: test-platform
            accessKeyId: <ACCESS_KEY>
            secretAccessKey: <SECRET_KEY>
            region: <REGION>
    allowedBuckets:
      - platform: test-platform
        buckets:
          - bucket-name-one
          # ...
  ```

### Patch Changes

- f094173: Export function `matches` and type `BucketDetailsFilters` from the permissions folder.

  These 2 elements are needed to create a custom `BucketsProvider`.

- 086b5aa: Bump Backstage to version 1.17.4
- Updated dependencies [086b5aa]
  - @spreadshirt/backstage-plugin-s3-viewer-common@0.3.3

## 0.5.0

### Minor Changes

- 452c52d: Extend the `S3Api` interface to allow injecting the `bucketsProvider` with the method `setBucketsProvider`. This is optional, and allows the `S3Builder` to inject the used `bucketsProvider` into your custom client, without needing to use a custom one or having to duplicate the default one.

  This isn't breaking anything, since the new method is optional.

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
