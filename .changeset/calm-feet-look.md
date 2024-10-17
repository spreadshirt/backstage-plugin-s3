---
'@spreadshirt/backstage-plugin-s3-viewer': patch
'@spreadshirt/backstage-plugin-s3-viewer-backend': patch
'@spreadshirt/backstage-plugin-s3-viewer-node': patch
---

Fix local dependencies for our plugins. This has been done by using the
[following script](https://github.com/backstage/backstage/blob/master/scripts/verify-local-dependencies.js) available
in the main Backstage repo.

This is also the way the community-plugin workspaces work, so it's good to follow their setup too.
