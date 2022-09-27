---
'@spreadshirt/backstage-plugin-s3-viewer-backend': patch
---

Change excludedBuckets by allowedBuckets when using the `radosgw-admin` bucketLocatorMethod.

By doing this, we secure which buckets are listed per platform, allowing the use of regex patterns
to reduce the list size. If no allowedBuckets are defined for a platform, then all the buckets will
be allowed by default.
