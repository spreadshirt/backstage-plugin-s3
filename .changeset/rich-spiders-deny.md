---
'@spreadshirt/backstage-plugin-s3-viewer-backend': minor
'@spreadshirt/backstage-plugin-s3-viewer-common': minor
---

**BREAKING**: Replace `setTokenCookie` with new method integrated into the S3Api `setCookie()`.

Due to the new authentication backend provided by Backstage in the version 1.24.0, we
can now use this endpoint and simplify the whole setup.