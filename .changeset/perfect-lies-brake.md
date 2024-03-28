---
'@spreadshirt/backstage-plugin-s3-viewer-backend': minor
---

**BREAKING**: Migrate backend plugin to use the new auth service.

No changes are required if running in the new backend system.

In case you're still using the old backend system you'll need to make sure the 
new `auth` and `httpAuth` are sent, while the `identity` and `tokenManager` are not needed any longer.