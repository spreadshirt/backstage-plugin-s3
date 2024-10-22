import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { CatalogEntityPage, CatalogIndexPage } from '@backstage/plugin-catalog';
import { UserSettingsPage } from '@backstage/plugin-user-settings';
import { apis } from './apis';
import { entityPage } from './components/catalog/EntityPage';
import { Root } from './components/Root';

import {
  AlertDisplay,
  OAuthRequestDialog,
  SignInPage,
} from '@backstage/core-components';
import { createApp } from '@backstage/app-defaults';
import { AppRouter, FlatRoutes } from '@backstage/core-app-api';
import {
  S3ApiRef,
  S3ViewerPage,
} from '@spreadshirt/backstage-plugin-s3-viewer';
import { IdentityApi, useApi } from '@backstage/core-plugin-api';

const app = createApp({
  apis,
  components: {
    SignInPage: props => {
      const s3ViewerApi = useApi(S3ApiRef);

      async function onSignInSuccess(identityApi: IdentityApi) {
        props.onSignInSuccess(identityApi);
        await s3ViewerApi.setCookie();
      }
      return (
        <SignInPage
          {...props}
          auto
          providers={['guest']}
          onSignInSuccess={onSignInSuccess}
        />
      );
    },
  },
});

const routes = (
  <FlatRoutes>
    <Route path="/" element={<Navigate to="s3-viewer" />} />
    <Route path="/catalog" element={<CatalogIndexPage />} />
    <Route
      path="/catalog/:namespace/:kind/:name"
      element={<CatalogEntityPage />}
    >
      {entityPage}
    </Route>
    <Route path="/settings" element={<UserSettingsPage />} />
    <Route path="/s3-viewer" element={<S3ViewerPage />} />
  </FlatRoutes>
);

export default app.createRoot(
  <>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <Root>{routes}</Root>
    </AppRouter>
  </>,
);
