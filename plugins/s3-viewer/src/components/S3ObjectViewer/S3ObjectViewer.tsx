import React, { useState } from 'react';
import { FetchObjectResult } from '@spreadshirt/backstage-plugin-s3-viewer-common';
import {
  Box,
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import { humanFileSize } from '../../utils';
import {
  LinkButton,
  Progress,
  StructuredMetadataTable,
} from '@backstage/core-components';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@mui/icons-material/Close';

const useStyles = makeStyles(() =>
  createStyles({
    margin: {
      marginTop: '10px',
      marginBottom: '10px',
    },
    loading: {
      width: '90%',
    },
    preview: {
      textAlign: 'center',
      maxWidth: '50%',
      maxHeight: '300px',
    },
  }),
);

type S3PreviewProps = {
  objectInfo: FetchObjectResult | undefined;
};

export const S3Preview = ({ objectInfo }: S3PreviewProps) => {
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
      ].includes(obj.contentType) &&
      // fall back to detecting based on file name if type is unknown
      !(
        ['', 'binary/octet-stream', 'application/octet-stream'].includes(
          obj.contentType,
        ) && obj.name.match(/\.(gif|ico|jpg|jpeg|png|svg|tiff)$/)
      )
    ) {
      return false;
    }

    return true;
  };

  const [isPreviewLoading, setIsPreviewLoading] = useState(
    isPreviewAvailable(objectInfo),
  );

  const [showVideo, setShowVideo] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  if (objectInfo?.contentType === 'video/mp4') {
    return (
      <>
        <Box>
          <Button
            variant="contained"
            onClick={() => setShowVideo(true)}
            startIcon={<OndemandVideoIcon />}
          >
            Play Video
          </Button>
        </Box>

        <Dialog
          open={showVideo}
          onClose={() => setShowVideo(false)}
          fullScreen={fullScreen}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <span>Video Preview</span>
              <IconButton
                aria-label="close"
                onClick={() => setShowVideo(false)}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent dividers>
            <Box
              component="video"
              controls
              autoPlay
              sx={{
                width: '100%',
                borderRadius: 2,
                backgroundColor: 'black',
              }}
            >
              <source src={objectInfo.downloadUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </Box>

            <Box mt={2}>
              <Typography variant="body2" color="textSecondary">
                File name: {objectInfo.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Content type: {objectInfo.contentType}
              </Typography>
            </Box>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  if (!isPreviewAvailable(objectInfo) || !objectInfo) {
    return <Typography variant="body2">no preview available</Typography>;
  }

  return (
    <>
      {isPreviewLoading && <Progress className={classes.loading} />}
      <img
        title={`Preview for "${objectInfo.downloadName}"`}
        alt={`Preview for "${objectInfo.downloadName}"`}
        src={objectInfo.downloadUrl}
        loading="lazy"
        className={classes.preview}
        onLoad={() => setIsPreviewLoading(false)}
        onError={() => setIsPreviewLoading(false)}
      />
    </>
  );
};

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
          className={classes.margin}
        >
          <S3Preview objectInfo={objectInfo} />
        </Grid>
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Grid item xs={6}>
            <LinkButton
              style={{ textDecoration: 'none' }}
              variant="outlined"
              title={`Download ${objectInfo.downloadName}`}
              to={objectInfo.downloadUrl}
              download={objectInfo.downloadName}
            >
              Download
            </LinkButton>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
