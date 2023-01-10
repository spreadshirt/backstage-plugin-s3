---
'@spreadshirt/backstage-plugin-s3-viewer-backend': patch
---

Speed up backend startup by not waiting for the `S3BucketsProvider` to fetch all the buckets when the `S3Builder.build()` method is called. Let it do it asynchronously.
