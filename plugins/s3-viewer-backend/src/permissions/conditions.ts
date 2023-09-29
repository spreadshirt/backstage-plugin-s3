import {
  ConditionTransformer,
  createConditionExports,
  createConditionTransformer,
} from '@backstage/plugin-permission-node';
import {
  BucketDetailsFilters,
  S3_VIEWER_RESOURCE_TYPE,
} from '@spreadshirt/backstage-plugin-s3-viewer-common';
import { rules } from './rules';

const { conditions, createConditionalDecision } = createConditionExports({
  pluginId: 's3-viewer',
  resourceType: S3_VIEWER_RESOURCE_TYPE,
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
