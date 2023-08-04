---
'@spreadshirt/backstage-plugin-s3-viewer-backend': minor
---

Extend the `S3Api` interface to allow injecting the `bucketsProvider` with the method `setBucketsProvider`. This is optional, and allows the `S3Builder` to inject the used `bucketsProvider` into your custom client, without needing to use a custom one or having to duplicate the default one.

This isn't breaking anything, since the new method is optional.