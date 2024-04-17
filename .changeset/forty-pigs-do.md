---
'@spreadshirt/backstage-plugin-s3-viewer-backend': patch
---

Use the `LoggerService` instead of the winstonLogger helper method, since the upstream plugins support the new service type now
