# @spreadshirt/backstage-plugin-s3-viewer-backend

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
