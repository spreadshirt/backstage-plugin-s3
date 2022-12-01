/*
 * Copyright 2022 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  BucketDetails,
  BucketStats,
} from '@spreadshirt/backstage-plugin-s3-viewer-common';

export type BucketDetailsFilter = {
  property: Exclude<keyof BucketDetails, keyof BucketStats | 'policy'>;
  values: Array<string | undefined>;
};

export type BucketDetailsFilters =
  | { anyOf: BucketDetailsFilters[] }
  | { allOf: BucketDetailsFilters[] }
  | { not: BucketDetailsFilters }
  | BucketDetailsFilter;

export const matches = (
  bucket: BucketDetails,
  filters?: BucketDetailsFilters,
): boolean => {
  if (!filters) {
    return true;
  }

  if ('allOf' in filters) {
    return filters.allOf.every(filter => matches(bucket, filter));
  }

  if ('anyOf' in filters) {
    return filters.anyOf.some(filter => matches(bucket, filter));
  }

  if ('not' in filters) {
    return !matches(bucket, filters.not);
  }

  return filters.values.includes(bucket[filters.property]);
};
