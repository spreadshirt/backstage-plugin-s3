---
'@spreadshirt/backstage-plugin-s3-viewer': minor
'@spreadshirt/backstage-plugin-s3-viewer-backend': minor
'@spreadshirt/backstage-plugin-s3-viewer-common': minor
---

**BREAKING**: Migrated to AWS-SDK version 3. Now the platform config requires a new field called `region`. If not present, the plugin will fail on startup.