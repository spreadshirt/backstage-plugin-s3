import { createPermissionResourceRef } from '@backstage/plugin-permission-node';
import {
  BucketDetails,
  BucketDetailsFilters,
  S3_VIEWER_RESOURCE_TYPE,
} from '@spreadshirt/backstage-plugin-s3-viewer-common';

export const s3ViewerBucketPermissionResourceRef = createPermissionResourceRef<
  BucketDetails,
  BucketDetailsFilters
>().with({
  pluginId: 's3-viewer',
  resourceType: S3_VIEWER_RESOURCE_TYPE,
});
