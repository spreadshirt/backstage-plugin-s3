# @spreadshirt/backstage-plugin-s3-viewer-common

## 0.5.14

### Patch Changes

- 77b192a: Bump dependencies to Backstage 1.39.0

## 0.5.13

### Patch Changes

- 8d33528: Bump Backstage dependencies to version 1.38.1

## 0.5.12

### Patch Changes

- bdcc773: Bump backstage dependencies to version 1.37.0

## 0.5.11

### Patch Changes

- 7618c00: Bump backstage dependencies to version 1.35.0

## 0.5.10

### Patch Changes

- 9cda47c: Bump backstage to version 1.33.5

## 0.5.9

### Patch Changes

- 56350c5: Fix release process due to 'workspace' references not being resolved.
  To do that, the previous setup using the exact version in the `package.json`
  has been brought back.

## 0.5.8

### Patch Changes

- c6b6505: Bump Backstage dependencies to version 1.32.2

## 0.5.7

### Patch Changes

- cbcd1a3: Bump Backstage dependencies to version 1.31.1

## 0.5.6

### Patch Changes

- aad8768: Bump Backstage dependencies to version 1.30.4

## 0.5.5

### Patch Changes

- b8e88a4: Bump `aws-sdk` dependencies to newer versions
- b4e3d65: Bump backstage dependencies to version `1.29.2`

## 0.5.4

### Patch Changes

- 2598ba2: Fix backstage package metadata

## 0.5.3

### Patch Changes

- c8ca029: Bump Backstage dependencies to version 1.28.4

## 0.5.2

### Patch Changes

- b23661d: Bump backstage dependencies to version 1.27.2

## 0.5.1

### Patch Changes

- 76eda39: Bump backstage dependencies to version 1.26.0

## 0.5.0

### Minor Changes

- 444ccef: **BREAKING**: Replace `setTokenCookie` with new method integrated into the S3Api `setCookie()`.

  Due to the new authentication backend provided by Backstage in the version 1.24.0, we
  can now use this endpoint and simplify the whole setup.

### Patch Changes

- 8cab3c0: Bump backstage dependencies to version 1.25.0

## 0.4.0

### Minor Changes

- 84db8bf: **BREAKING**: Moved some types that were part of `@spreadshirt/backstage-plugin-s3-viewer-backend` to this package.
  If you were using any of these types, please import them using `@spreadshirt/backstage-plugin-s3-viewer-common`:
  `BucketDetailsFilter`, `BucketDetailsFilters`, `S3Platform`, `BucketCredentials`, `AllowedBuckets`

### Patch Changes

- 58ccb15: Make sure the new `s3-viewer` API endpoint is used for the cookie instead of the old `s3`

## 0.3.9

### Patch Changes

- 05dfc57: Bump backstage packages to version `1.23.1`

## 0.3.8

### Patch Changes

- 5f98357: Bump backstage dependencies to version 1.22.1

## 0.3.7

### Patch Changes

- 133e6f1: Bump backstage dependencies to version 1.21.1

## 0.3.6

### Patch Changes

- e0db1fd: Bump Backstage dependencies to version 1.21.2

## 0.3.5

### Patch Changes

- 2f463a3: Bump backstage dependencies to v1.19.2

## 0.3.4

### Patch Changes

- a9414c1: Update backstage to 1.18.1

## 0.3.3

### Patch Changes

- 086b5aa: Bump Backstage to version 1.17.4

## 0.3.2

### Patch Changes

- 5d7ad9b: Bump dependencies to backstage 1.16.0
- d6a18e0: Security updates found by [dependabot](https://github.com/spreadshirt/backstage-plugin-s3/security/dependabot).
  Fixed some criticals for `loader-utils`, `@xmldom/xmldom` and high alerts for
  `yaml`, `webpack`, `knex`, `luxon`, `json5` or `minimatch`

## 0.3.1

### Patch Changes

- 9a3fcf3: Align aws-sdk dependencies with backstage 1.15.0
- 1965d2c: Bump dependencies to Backstage 1.15.0
- 1965d2c: Remove deprecated `BackstageTheme` and unnecessary package import

## 0.3.0

### Minor Changes

- e83665c: **BREAKING**: Migrated to AWS-SDK version 3. Now the platform config requires a new field called `region`. If not present, the plugin will fail on startup.

### Patch Changes

- 30f0a93: Fix small issue while paging keys and remove unused field in `ListBucketKeysResult`
- 466d55f: Bump backstage dependencies to version `1.14.1` & align some internal `aws-sdk` dependencies

## 0.2.5

### Patch Changes

- 797eb6a: Bump Backstage packages to version `1.13.0`

## 0.2.4

### Patch Changes

- 97d5616: Upgrade dependencies to Backstage 1.12.1

## 0.2.3

### Patch Changes

- cf3bd09: Upgrade backstage dependencies to version 1.11.0

## 0.2.2

### Patch Changes

- 860ef59: Upgrade backstage dependencies to version `1.10.1`

## 0.2.1

### Patch Changes

- 55629e3: Update dependencies to Backstage 1.9.1

## 0.2.0

### Minor Changes

- caaac67: Add permissions to plugin

## 0.1.4

### Patch Changes

- 74fef18: Update dependencies to backstage 1.8.2

## 0.1.3

### Patch Changes

- 91c40a8: Update dependencies to backstage 1.7.0

## 0.1.2

### Patch Changes

- 58dcfce: Upgrade dependencies to backstage 1.6.0 & migrate to react-router v6 stable

## 0.1.1

### Patch Changes

- 8deb36f: Initial plugin version
