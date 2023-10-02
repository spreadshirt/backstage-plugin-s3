---
'@spreadshirt/backstage-plugin-s3-viewer-backend': minor
---

Add support to the [new backend system](https://backstage.io/docs/backend-system/). 

Follow the instructions in the [README.md](https://github.com/spreadshirt/backstage-plugin-s3/blob/main/plugins/s3-viewer-backend/README.md#new-backend-system)

**DEPRECATION**: The method `setRefreshInterval` has been deprecated in favor of the usage of the configuration file to schedule the refresh.
From now on, the schedule should be set using the `app-config.yaml` file. This method will be kept for some time as a fallback if the schedule
has not been set via the configuration file.