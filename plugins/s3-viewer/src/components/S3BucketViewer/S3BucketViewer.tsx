import React from 'react';
import Alert from '@material-ui/lab/Alert';
import { BucketDetails } from '@spreadshirt/backstage-plugin-s3-viewer-common';
import { humanFileSize } from '../../utils';
import { Divider, Grid, Typography } from '@material-ui/core';
import { Progress, StructuredMetadataTable } from '@backstage/core-components';

type S3BucketViewProps = {
  bucketInfo: BucketDetails | undefined;
  loadingBucketInfo: boolean;
  errorBucketInfo: Error | undefined;
};

export const S3BucketViewer = ({
  bucketInfo,
  loadingBucketInfo,
  errorBucketInfo,
}: S3BucketViewProps) => {
  if (loadingBucketInfo) {
    return <Progress />;
  } else if (errorBucketInfo) {
    return <Alert severity="error">{errorBucketInfo.message}</Alert>;
  }

  const parsePolicy = (policy: Record<string, any>) => {
    const result: Record<string, any> = {};
    if (policy.ID) {
      result.ID = policy.ID;
    }
    if (policy.Status) {
      result.Status = policy.Status;
    }

    if (policy.Expiration) {
      result.Expiration = Object.entries(policy.Expiration)
        .map(([key, value]) => `After ${value} ${key.toLowerCase()}`)
        .join(', ');
    }

    const incompleteUpload = Object.values(
      policy.AbortIncompleteMultipartUpload || {},
    )
      .map(value => `${value} days`)
      .join('');

    result.AbortIncompleteMultipartUpload = incompleteUpload || 'Not Set';

    return result;
  };

  const getBucketInfoMetadata = (data: BucketDetails | undefined) => {
    if (!data) {
      return {};
    }

    const metadata: Record<string, any> = {
      Endpoint: data.endpoint,
      Owner: data.owner,
      Objects: data.objects,
      Size: `${humanFileSize(data.size)} (${data.size} bytes)`,
    };

    if (data.policy.length > 0) {
      metadata.Lifecycle = parsePolicy(data.policy[0]);
    }

    return metadata;
  };

  return (
    <>
      <Typography variant="h5">{bucketInfo?.bucket || ''}</Typography>
      <Divider style={{ marginTop: 20, marginBottom: 20 }} />
      <Grid container>
        <Grid item xs={12}>
          <StructuredMetadataTable
            metadata={getBucketInfoMetadata(bucketInfo)}
          />
        </Grid>
      </Grid>
    </>
  );
};
