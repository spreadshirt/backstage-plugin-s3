import { makeCreatePermissionRule } from '@backstage/plugin-permission-node';
import {
  S3_VIEWER_RESOURCE_TYPE,
  BucketDetails,
  BucketDetailsFilters,
} from '@spreadshirt/backstage-plugin-s3-viewer-common';
import { z } from 'zod';

const createS3ViewerBucketPermissionRule = makeCreatePermissionRule<
  BucketDetails,
  BucketDetailsFilters,
  typeof S3_VIEWER_RESOURCE_TYPE
>();

const isBucketOwner = createS3ViewerBucketPermissionRule({
  name: 'IS_BUCKET_OWNER',
  description: 'Should allow only if the bucket belongs to the user',
  resourceType: S3_VIEWER_RESOURCE_TYPE,
  paramsSchema: z.object({
    owners: z.array(z.string()).describe('List of owner entity refs'),
  }),
  apply: (list, { owners }) => owners.includes(list.owner),
  toQuery: ({ owners }) => ({
    property: 'owner',
    values: owners,
  }),
});

const isBucketNamed = createS3ViewerBucketPermissionRule({
  name: 'IS_BUCKET_NAMED',
  description: 'Should allow only depending on the bucket name',
  resourceType: S3_VIEWER_RESOURCE_TYPE,
  paramsSchema: z.object({
    names: z.array(z.string()).describe('List of bucket names'),
  }),
  apply: (list, { names }) => names.includes(list.bucket),
  toQuery: ({ names }) => ({
    property: 'bucket',
    values: names,
  }),
});

export const rules = { isBucketOwner, isBucketNamed };
