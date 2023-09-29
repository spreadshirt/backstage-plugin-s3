---
'@spreadshirt/backstage-plugin-s3-viewer-common': minor
---

**BREAKING**: Moved some types that were part of `@spreadshirt/backstage-plugin-s3-viewer-backend` to this package. 
If you were using any of these types, please import them using `@spreadshirt/backstage-plugin-s3-viewer-common`: 
`BucketDetailsFilter`, `BucketDetailsFilters`, `S3Platform`, `BucketCredentials`,  `AllowedBuckets`