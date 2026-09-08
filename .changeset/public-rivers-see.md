---
'@spreadshirt/backstage-plugin-s3-viewer': patch
---

Fix broken exports after Backstage 1.54.x update

The imports didn't work because they were written for CJS, which doesn't seem to
be exported for frontend plugins.
