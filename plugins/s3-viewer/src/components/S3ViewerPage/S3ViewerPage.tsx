import { Content, Header, InfoCard, Page } from '@backstage/core-components';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { Grid } from '@material-ui/core';
import { S3ViewerContent } from '../S3ViewerContent';

export const S3ViewerPage = () => {
  const orgName =
    useApi(configApiRef).getOptionalString('organization.name') ?? 'Backstage';

  return (
    <Page themeId="tool">
      <Header title={`${orgName} S3 viewer`} />
      <Content>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <InfoCard>
              <S3ViewerContent />
            </InfoCard>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
