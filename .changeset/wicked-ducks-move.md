---
'@spreadshirt/backstage-plugin-s3-viewer-backend': minor
---

**BREAKING**: The `allowedBuckets` configuration has changed. From now on, you must use a
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