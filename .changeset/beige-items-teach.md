---
'@spreadshirt/backstage-plugin-s3-viewer-backend': minor
---

Add new cluster location using IAM roles. Defined by using the platform
type `iam-role`.

This locator is similar to the `config` and `radosgw-admin`, but 
it doesn't need any credentials to be set. Check the 
[README file](https://github.com/spreadshirt/backstage-plugin-s3/blob/main/plugins/s3-viewer-backend/README.md) 
to see an example configuration and the needed parameters.
