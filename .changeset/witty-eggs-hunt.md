---
'@spreadshirt/backstage-plugin-s3-viewer-backend': patch
---

Upgrade backstage dependencies to version `1.10.1`

Prepare plugin to use some of the new BackendServices, if they are already in use. This applies to
the Discovery, Logger and TokenManager so far. For end-users nothing will change, it's just an 
internal change.
