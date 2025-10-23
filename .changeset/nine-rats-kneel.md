---
'@spreadshirt/backstage-plugin-s3-viewer-backend': minor
---

Add AuditService to replace default logging on Download Events, also provided optional configuration settings.

Potentially breaking change if a user is manually creating a `S3Builder` will need to now add AuditService to list of deps.
