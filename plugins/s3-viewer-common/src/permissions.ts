import {
  createPermission,
  ResourcePermission,
} from '@backstage/plugin-permission-common';

export const S3_VIEWER_RESOURCE_TYPE = 's3-viewer.bucket';

export type S3BucketDetailsPermission = ResourcePermission<
  typeof S3_VIEWER_RESOURCE_TYPE
>;

const s3BucketList = createPermission({
  name: 's3-viewer.bucket.list',
  attributes: { action: 'read' },
  resourceType: S3_VIEWER_RESOURCE_TYPE,
});

const s3BucketRead = createPermission({
  name: 's3-viewer.bucket.read',
  attributes: { action: 'read' },
  resourceType: S3_VIEWER_RESOURCE_TYPE,
});

const s3ObjectRead = createPermission({
  name: 's3-viewer.object.read',
  attributes: { action: 'read' },
  resourceType: S3_VIEWER_RESOURCE_TYPE,
});

const s3ObjectDownload = createPermission({
  name: 's3-viewer.object.download',
  attributes: { action: 'read' },
  resourceType: S3_VIEWER_RESOURCE_TYPE,
});

export const permissions = {
  s3BucketList,
  s3BucketRead,
  s3ObjectRead,
  s3ObjectDownload,
};
