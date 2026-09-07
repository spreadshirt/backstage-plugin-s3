---
'@spreadshirt/backstage-plugin-s3-viewer-backend': minor
'@spreadshirt/backstage-plugin-s3-viewer-common': minor
'@spreadshirt/backstage-plugin-s3-viewer-node': minor
'@spreadshirt/backstage-plugin-s3-viewer': minor
'backend': minor
'app': minor
---

Add a New Frontend System `/alpha` entry with `PageBlueprint` and `ApiBlueprint`, while keeping the legacy plugin API. (Backwards Compatible)

Removed dependency 'stream' this was causing major issues with looping, as this is a core node package.

Converted the base application to New Frontend System

Upgraded to the latest backstage 1.54.X

Dependency cleanups

Upgrade compose setup