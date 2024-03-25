---
'@spreadshirt/backstage-plugin-s3-viewer-backend': minor
'@spreadshirt/backstage-plugin-s3-viewer-node': minor
---

**BREAKING**: Remove the `middleware` from the s3-viewer.

With the newly authentication backend system, the middleware is not needed any longer,
so it can be completely removed instead of keeping it here. _NOTE_ that using this
`s3-viewer` version will require you to be up-to-date with the latest Backstage version as well.