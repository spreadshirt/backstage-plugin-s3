---
'@spreadshirt/backstage-plugin-s3-viewer-backend': patch
---

Replace some deprecations caused by the removal of the backend-tasks plugin and deprecate old backend system.
Please, remove any usage of `RouterOptions` and `createRouter`.

The old backend system methods will be completely removed in the next release, so none of the deprecations 
caused by these functions are going to be addressed.

More info about this process [in this issue](https://github.com/backstage/community-plugins/issues/1176).

To set up the backend using the new backend system, follow [this documentation](https://github.com/spreadshirt/backstage-plugin-s3/tree/main/plugins/s3-viewer-backend#new-backend-system).