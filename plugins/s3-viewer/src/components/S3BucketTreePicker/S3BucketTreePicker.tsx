import { Fragment, useEffect, useState } from 'react';
import useAsync from 'react-use/lib/useAsync';
import { useApi } from '@backstage/core-plugin-api';
import { S3ApiRef } from '../../api';
import {
  Collapse,
  createStyles,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Progress } from '@backstage/core-components';
import Alert from '@material-ui/lab/Alert';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ClearIcon from '@material-ui/icons/Clear';

const useStyles = makeStyles(theme =>
  createStyles({
    list: {
      maxHeight: '80vh',
      overflow: 'auto',
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
    endpoint: {
      cursor: 'pointer',
    },
  }),
);

type S3BucketTreePickerProps = {
  state: {
    endpoint: string;
    bucket: string;
  };
  updateTreeViewValues: (newBucket: string, newEndpoint: string) => void;
};

export const S3BucketTreePicker = ({
  state = { bucket: '', endpoint: '' },
  updateTreeViewValues,
}: S3BucketTreePickerProps) => {
  const s3Api = useApi(S3ApiRef);
  const classes = useStyles();
  const [open, setOpen] = useState(state.endpoint);

  useEffect(() => {
    if (state.endpoint) {
      setOpen(state.endpoint);
    }
  }, [state.endpoint]);

  const handleCollapseClick = (value: string) => {
    if (open === value && open) {
      setOpen('');
    } else {
      setOpen(value);
    }
  };

  const {
    value: bucketsByEndpoint = {},
    loading,
    error,
  } = useAsync(async () => {
    const groupedBuckets = await s3Api.getGroupedBuckets();
    const endpoints = Object.keys(groupedBuckets);
    if (!open && endpoints.length > 0) {
      setOpen(endpoints[0]);
    }
    return groupedBuckets;
  });

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  } else if (Object.keys(bucketsByEndpoint).length === 0) {
    return <Typography>No buckets found</Typography>;
  }

  const isSelected = (endpoint: string, bucket: string): boolean => {
    return state.bucket === bucket && state.endpoint === endpoint;
  };

  return (
    <List dense className={classes.list}>
      <ListItem
        button
        onClick={() => updateTreeViewValues('', '')}
        selected={state.bucket === '' && state.endpoint === ''}
        disabled={isSelected('', '')}
      >
        <ListItemText primary="Clear (Reset)" />
        <ListItemIcon style={{ minWidth: '24px' }}>
          <ClearIcon />
        </ListItemIcon>
      </ListItem>
      {Object.entries(bucketsByEndpoint).map(
        ([endpointName, buckets], idxOne) => (
          <Fragment key={idxOne}>
            <ListItem
              className={classes.endpoint}
              onClick={() => handleCollapseClick(endpointName)}
            >
              <ListItemText primary={endpointName} />
              {open === endpointName ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open === endpointName} timeout="auto" unmountOnExit>
              <List dense disablePadding>
                {buckets.map((bucketName, idxTwo) => (
                  <ListItem
                    button
                    key={idxTwo}
                    className={classes.nested}
                    component="div"
                    selected={isSelected(endpointName, bucketName)}
                    onClick={() => {
                      updateTreeViewValues(bucketName, endpointName);
                    }}
                  >
                    <Tooltip title={bucketName}>
                      <ListItemText primary={bucketName} />
                    </Tooltip>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </Fragment>
        ),
      )}
    </List>
  );
};
