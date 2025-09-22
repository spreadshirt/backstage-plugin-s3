import {
  ConditionTransformer,
  createConditionExports,
  createConditionTransformer,
} from '@backstage/plugin-permission-node';
import { BucketDetailsFilters } from '@spreadshirt/backstage-plugin-s3-viewer-common';
import { rules } from './rules';
import { s3ViewerBucketPermissionResourceRef } from '@spreadshirt/backstage-plugin-s3-viewer-node';

const { conditions, createConditionalDecision } = createConditionExports({
  resourceRef: s3ViewerBucketPermissionResourceRef,
  rules,
});

/**
 * @public
 */
export const s3ViewerBucketConditions = conditions;

/**
 * @public
 */
export const createS3ViewerBucketsConditionalDecision =
  createConditionalDecision;

export const transformConditions: ConditionTransformer<BucketDetailsFilters> =
  createConditionTransformer(Object.values(rules));
