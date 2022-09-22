import React, { useEffect, useState } from 'react';
import { FetchObjectResult } from '@spreadshirt/backstage-plugin-s3-viewer-common';
import {
  createStyles,
  Divider,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { humanFileSize } from '../../utils';
import {
  Button,
  Progress,
  StructuredMetadataTable,
} from '@backstage/core-components';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles(() =>
  createStyles({
    loadingContainer: {
      width: '100%',
    },
    previewContainer: {
      marginBottom: '20px',
      textAlign: 'center',
    },
    preview: {
      maxWidth: '100%',
      maxHeight: '300px',
    },
  }),
);

type S3ObjectViewProps = {
  objectInfo: FetchObjectResult | undefined;
  loadingObjectInfo: boolean;
  errorObjectInfo: Error | undefined;
};

export const S3ObjectViewer = ({
  objectInfo,
  loadingObjectInfo,
  errorObjectInfo,
}: S3ObjectViewProps) => {
  const classes = useStyles();

  const isPreviewAvailable = (obj: FetchObjectResult | undefined) => {
    if (!obj) {
      return false;
    }

    // Content bigger than 2MB
    if (!obj.contentLength || obj.contentLength > 2000000) {
      return false;
    }

    if (
      ![
        'image/gif',
        'image/jpeg',
        'image/svg+xml',
        'image/tiff',
        'image/x-icon',
        'image/jpg',
        'image/png',
      ].includes(obj.contentType)
    ) {
      return false;
    }

    return true;
  };

  const [isPreviewLoading, setIsPreviewLoading] = useState(
    isPreviewAvailable(objectInfo),
  );

  useEffect(
    () => setIsPreviewLoading(isPreviewAvailable(objectInfo)),
    [objectInfo],
  );

  if (loadingObjectInfo) {
    return <Progress />;
  } else if (errorObjectInfo) {
    return <Alert severity="error">{errorObjectInfo.message}</Alert>;
  } else if (!objectInfo) {
    return <Alert severity="error">Object not found</Alert>;
  }

  const getMetadata = (params: FetchObjectResult | undefined) => ({
    LastModified: params?.lastModified || '-',
    Size: params
      ? `${humanFileSize(params.contentLength)} (${params.contentLength} bytes)`
      : '-',
    ContentType: params?.contentType || '-',
    Etag: params?.etag || '-',
  });

  return (
    <>
      <Typography variant="h5">{objectInfo.name}</Typography>
      <Divider style={{ marginTop: 20, marginBottom: 20 }} />
      <Grid container>
        <Grid item xs={12}>
          <StructuredMetadataTable metadata={getMetadata(objectInfo)} />
        </Grid>
        <Grid item xs={12}>
          <Divider style={{ marginTop: 20, marginBottom: 20 }} />
        </Grid>
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Grid item xs={10} className={classes.loadingContainer}>
            {isPreviewLoading && <Progress />}
          </Grid>
        </Grid>
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          {isPreviewAvailable(objectInfo) && (
            <Grid item xs={6} className={classes.previewContainer}>
              <img
                title={`Preview for "${objectInfo.downloadName}"`}
                alt={`Preview for "${objectInfo.downloadName}"`}
                src={objectInfo.downloadUrl}
                loading="lazy"
                className={classes.preview}
                onLoad={() => setIsPreviewLoading(false)}
                onError={() => setIsPreviewLoading(false)}
              />
            </Grid>
          )}
        </Grid>
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Grid item xs={6}>
            <Button
              style={{ textDecoration: 'none' }}
              variant="outlined"
              to={objectInfo.downloadUrl}
            >
              Download
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
