import {
  ConditionTransformer,
  createConditionExports,
  createConditionTransformer,
} from '@backstage/plugin-permission-node';
import {
  BucketDetailsFilters,
  s3ViewerPermissionResourceRef,
} from '@spreadshirt/backstage-plugin-s3-viewer-common';
import { rules } from './rules';

const { conditions, createConditionalDecision } = createConditionExports({
  resourceRef: s3ViewerPermissionResourceRef,
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
