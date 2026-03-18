import { createPermissionRule } from '@backstage/plugin-permission-node';
import { s3ViewerPermissionResourceRef } from '@spreadshirt/backstage-plugin-s3-viewer-common';
import { z } from 'zod';

const isBucketOwner = createPermissionRule({
  name: 'IS_BUCKET_OWNER',
  description: 'Should allow only if the bucket belongs to the user',
  resourceRef: s3ViewerPermissionResourceRef,
  paramsSchema: z.object({
    owners: z.array(z.string()).describe('List of owner entity refs'),
  }),
  apply: (list, { owners }) => owners.includes(list.owner),
  toQuery: ({ owners }) => ({
    property: 'owner',
    values: owners,
  }),
});

const isBucketNamed = createPermissionRule({
  name: 'IS_BUCKET_NAMED',
  description: 'Should allow only depending on the bucket name',
  resourceRef: s3ViewerPermissionResourceRef,
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
