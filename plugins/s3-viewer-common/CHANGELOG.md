# @spreadshirt/backstage-plugin-s3-viewer-common

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
