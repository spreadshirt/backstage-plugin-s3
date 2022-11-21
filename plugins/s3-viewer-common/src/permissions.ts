import { createPermission } from '@backstage/plugin-permission-common';

export const S3_VIEWER_RESOURCE_TYPE = 's3-viewer.resource';

const s3ViewerBucketsList = createPermission({
  name: 's3-viewer.buckets.list',
  attributes: { action: 'read' },
  resourceType: S3_VIEWER_RESOURCE_TYPE,
});

const s3ViewerBucketsRead = createPermission({
  name: 's3-viewer.buckets.read',
  attributes: { action: 'read' },
  resourceType: S3_VIEWER_RESOURCE_TYPE,
});

const s3ViewerObjectRead = createPermission({
  name: 's3-viewer.object.read',
  attributes: { action: 'read' },
  resourceType: S3_VIEWER_RESOURCE_TYPE,
});

const s3ViewerObjectDownload = createPermission({
  name: 's3-viewer.object.download',
  attributes: { action: 'read' },
  resourceType: S3_VIEWER_RESOURCE_TYPE,
});

export const permissions = {
  s3ViewerBucketsList,
  s3ViewerBucketsRead,
  s3ViewerObjectRead,
  s3ViewerObjectDownload,
};
