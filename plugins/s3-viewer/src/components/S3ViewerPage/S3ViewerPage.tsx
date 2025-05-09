import { InfoCard } from '@backstage/core-components';
import { Grid } from '@material-ui/core';
import { S3ViewerContent } from '../S3ViewerContent';
import { useEntity } from '@backstage/plugin-catalog-react';
import { S3_VIEWER_BUCKET } from '../../constant';
import { extractBucketAndPath } from '../../utils';

export const S3ViewerPage = () => {

  const { entity } = useEntity();
  const  s3ViewerAnnotations = entity.metadata?.annotations?.[S3_VIEWER_BUCKET];
  const { bucket, path } = extractBucketAndPath(s3ViewerAnnotations ?? '');

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <InfoCard>
          <S3ViewerContent bucketName={bucket} pathFolder={path}/>
        </InfoCard>
      </Grid>
    </Grid>
  );
};
