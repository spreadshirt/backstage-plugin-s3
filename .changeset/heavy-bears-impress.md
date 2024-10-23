---
'@spreadshirt/backstage-plugin-s3-viewer-backend': patch
'@spreadshirt/backstage-plugin-s3-viewer-common': patch
'@spreadshirt/backstage-plugin-s3-viewer-node': patch
'@spreadshirt/backstage-plugin-s3-viewer': patch
'app': patch
---

Fix release process due to 'workspace' references not being resolved.
To do that, the previous setup using the exact version in the `package.json`
has been brought back.
