import { useCallback, useEffect, useRef, useState } from 'react';
import useAsync from 'react-use/lib/useAsync';
import { Content, Table, TableColumn } from '@backstage/core-components';
import { useApi, useRouteRefParams } from '@backstage/core-plugin-api';
import { KeyData } from '@spreadshirt/backstage-plugin-s3-viewer-common';
import { createStyles, Grid, makeStyles, Typography } from '@material-ui/core';
import SubdirectoryArrowLeftIcon from '@material-ui/icons/SubdirectoryArrowLeft';
import { S3BucketTreePicker } from '../S3BucketTreePicker';
import { S3OverviewCard } from '../S3OverviewCard';
import { S3ApiRef } from '../../api';
import { rootRouteRef } from '../../routes';
import { getFolderFromUrlDir, getPathFromUrlDir } from '../../utils';

const useStyles = makeStyles(() =>
  createStyles({
    content: {
      width: '100%',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
  }),
);

const updateSearchParams = (
  newBucket: string,
  newEndpoint: string,
  newPath: string,
) => {
  let url = `/s3-viewer`;
  if (newBucket && newEndpoint) {
    url += `/${newEndpoint}/${newBucket}`;
    if (newPath) {
      url += `/${newPath}`;
    }
  }
  window.history.pushState(null, '', url);
};

type LocationInfo = {
  endpoint: string;
  bucket: string;
  key: string;
  folder: string;
};

export const S3ViewerContent = () => {
  const s3Api = useApi(S3ApiRef);
  const classes = useStyles();
  const tableRef = useRef<any>();
  const urlParams = useRouteRefParams(rootRouteRef);

  const [locationInfo, setLocationInfo] = useState<LocationInfo>({
    endpoint: urlParams.endpoint ?? '',
    bucket: urlParams.bucket ?? '',
    key: getPathFromUrlDir(
      urlParams['*'].replace(`${urlParams.endpoint}/${urlParams.bucket}`, ''),
    ),
    folder: getFolderFromUrlDir(
      urlParams['*'].replace(`${urlParams.endpoint}/${urlParams.bucket}`, ''),
    ),
  });
  const [pageSize, setPageSize] = useState(20);
  const [token, setToken] = useState(['']);

  const columns: TableColumn<KeyData>[] = [
    {
      title: 'Key',
      field: 'name',
      render: row => (
        <Typography
          onClick={() => {
            if (!row.isFolder) {
              setLocationInfo({
                bucket: locationInfo.bucket,
                endpoint: locationInfo.endpoint,
                key: locationInfo.folder + row.name,
                folder: locationInfo.folder,
              });
            } else {
              setLocationInfo({
                bucket: locationInfo.bucket,
                endpoint: locationInfo.endpoint,
                key: locationInfo.key,
                folder: locationInfo.folder + row.name,
              });
              setToken(['']);
              tableRef.current?.onQueryChange();
            }
            updateSearchParams(
              locationInfo.bucket,
              locationInfo.endpoint,
              locationInfo.folder + row.name,
            );
          }}
          style={{ cursor: 'pointer' }}
        >
          {row.name}
        </Typography>
      ),
    },
  ];

  const {
    value: bucketInfo,
    loading: loadingBucketInfo,
    error: errorBucketInfo,
  } = useAsync(async () => {
    if (!locationInfo.bucket || !locationInfo.endpoint) {
      return undefined;
    }
    return s3Api.getBucketInfo(locationInfo.endpoint, locationInfo.bucket);
  }, [locationInfo.endpoint, locationInfo.bucket]);

  const {
    value: objectInfo,
    loading: loadingObjectInfo,
    error: errorObjectInfo,
  } = useAsync(async () => {
    if (!locationInfo.bucket || !locationInfo.endpoint || !locationInfo.key) {
      return undefined;
    }
    return s3Api.getObjectMetadata(
      locationInfo.endpoint,
      locationInfo.bucket,
      locationInfo.key,
    );
  }, [locationInfo.endpoint, locationInfo.bucket, locationInfo.key]);

  const loadData = async (
    queryPage: number,
    queryPageSize: number,
    querySearch: string,
  ) => {
    const res = await s3Api.listBucketKeys(
      locationInfo.endpoint,
      locationInfo.bucket,
      token[queryPage],
      queryPageSize,
      locationInfo.folder,
      querySearch,
    );

    const newToken = [...token];
    if (res.next) {
      newToken[queryPage + 1] = res.next;
      setToken(newToken);
    }

    // Because the S3 API does not return the total count of objects, fake the count
    let totalCount = 100000;

    // Update total count if this is the last page to prevent going to an invalid page.
    if (res.keys.length < queryPageSize) {
      totalCount = queryPage * queryPageSize + res.keys.length;
    }

    return {
      data: res.keys,
      page: queryPage,
      totalCount: totalCount,
    };
  };

  const handleBackClicked = (_event: any) => {
    const folders = locationInfo.folder.split('/').filter(f => f);
    let folderNew = '';
    if (folders.length > 1) {
      folderNew = `${folders.slice(0, folders.length - 1).join('/')}/`;
    }
    setLocationInfo({
      bucket: locationInfo.bucket,
      endpoint: locationInfo.endpoint,
      key: locationInfo.key,
      folder: folderNew,
    });
    updateSearchParams(locationInfo.bucket, locationInfo.endpoint, folderNew);
    tableRef.current?.onQueryChange();
  };

  const updateTreeViewValues = useCallback(
    (newBucket: string, newEndpoint: string) => {
      setLocationInfo({
        endpoint: newEndpoint,
        bucket: newBucket,
        key: '',
        folder: '',
      });
      updateSearchParams(newBucket, newEndpoint, '');
      setToken(['']);
      tableRef.current?.onQueryChange();
    },
    [],
  );

  useEffect(() => {
    setLocationInfo({
      endpoint: urlParams.endpoint ?? '',
      bucket: urlParams.bucket ?? '',
      key: getPathFromUrlDir(
        urlParams['*'].replace(`${urlParams.endpoint}/${urlParams.bucket}`, ''),
      ),
      folder: getFolderFromUrlDir(
        urlParams['*'].replace(`${urlParams.endpoint}/${urlParams.bucket}`, ''),
      ),
    });
    tableRef.current?.onQueryChange();
  }, [urlParams, tableRef]);

  return (
    <>
      <Content className={classes.content} noPadding>
        <Grid container spacing={1}>
          <Grid item xs={2}>
            <S3BucketTreePicker
              state={{ ...locationInfo }}
              updateTreeViewValues={updateTreeViewValues}
            />
          </Grid>
          <Grid item xs={6}>
            <Table<KeyData>
              tableRef={tableRef}
              columns={columns}
              actions={[
                {
                  icon: () => <SubdirectoryArrowLeftIcon />,
                  position: 'row',
                  disabled: !locationInfo.folder,
                  tooltip: 'Navigate Upwards',
                  isFreeAction: true,
                  onClick: handleBackClicked,
                },
              ]}
              data={async query => {
                // work around query being undefined once at start or bucket not selected
                if (!query || locationInfo.bucket === '') {
                  return { data: [], page: 0, totalCount: 0 };
                } else if (token.length === 1) {
                  query.page = 0;
                  query.totalCount = 0;
                }

                return loadData(query.page, query.pageSize, query.search);
              }}
              subtitle={
                locationInfo.folder &&
                `Current directory: ${locationInfo.folder}`
              }
              onRowsPerPageChange={newPageSize => setPageSize(newPageSize)}
              options={{
                sorting: false,
                paging: true,
                search: true,
                pageSize: pageSize,
                pageSizeOptions: [20, 40, 80],
                padding: 'dense',
                showFirstLastPageButtons: false,
                actionsColumnIndex: -1,
                emptyRowsWhenPaging: false,
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <S3OverviewCard
              bucketInfo={bucketInfo}
              loadingBucketInfo={loadingBucketInfo}
              errorBucketInfo={errorBucketInfo}
              objectInfo={objectInfo}
              loadingObjectInfo={loadingObjectInfo}
              errorObjectInfo={errorObjectInfo}
            />
          </Grid>
        </Grid>
      </Content>
    </>
  );
};
