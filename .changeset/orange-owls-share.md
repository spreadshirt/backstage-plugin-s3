---
'@spreadshirt/backstage-plugin-s3-viewer-backend': minor
---

**BREAKING**: Moved some types that were part of this package to `@spreadshirt/backstage-plugin-s3-viewer-common`. 
If you were using any of these types, please import them using `@spreadshirt/backstage-plugin-s3-viewer-common`: 
`BucketDetailsFilter`, `BucketDetailsFilters`, `S3Platform`, `BucketCredentials`,  `AllowedBuckets`