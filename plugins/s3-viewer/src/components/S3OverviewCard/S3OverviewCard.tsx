import React, { useEffect, useState } from 'react';
import { CardTab, TabbedCard } from '@backstage/core-components';
import {
  BucketDetails,
  FetchObjectResult,
} from '@spreadshirt/backstage-plugin-s3-viewer-common';
import { S3BucketViewer } from '../S3BucketViewer';
import { S3ObjectViewer } from '../S3ObjectViewer';

type S3OverviewCardProps = {
  bucketInfo: BucketDetails | undefined;
  loadingBucketInfo: boolean;
  errorBucketInfo: Error | undefined;
  objectInfo: FetchObjectResult | undefined;
  loadingObjectInfo: boolean;
  errorObjectInfo: Error | undefined;
};

export const S3OverviewCard = (props: S3OverviewCardProps) => {
  const [selectedTab, setSelectedTab] = useState<string | number>('bucket');

  useEffect(() => {
    if (props.loadingObjectInfo || props.errorObjectInfo) {
      setSelectedTab('object');
    } else if (!props.objectInfo && !props.loadingObjectInfo) {
      setSelectedTab('bucket');
    }
  }, [props]);

  const handleChange = (_ev: any, newSelectedTab: string | number) =>
    setSelectedTab(newSelectedTab);

  return (
    <TabbedCard value={selectedTab} onChange={handleChange}>
      <CardTab value="bucket" label="Bucket Details" key="bucket-details">
        <S3BucketViewer {...props} />
      </CardTab>
      <CardTab
        value="object"
        disabled={!props.objectInfo && !props.loadingObjectInfo}
        label="Object Details"
        key="object-details"
      >
        <S3ObjectViewer {...props} />
      </CardTab>
    </TabbedCard>
  );
};
