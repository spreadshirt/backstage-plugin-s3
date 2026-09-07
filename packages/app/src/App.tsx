import { Navigate } from 'react-router-dom';
import { SignInPage } from '@backstage/core-components';
import { S3ApiRef } from '@spreadshirt/backstage-plugin-s3-viewer';
import { IdentityApi, useApi } from '@backstage/core-plugin-api';
import { createApp } from '@backstage/frontend-defaults';
import { SignInPageBlueprint } from '@backstage/plugin-app-react';
import {
  createFrontendModule,
  PageBlueprint,
} from '@backstage/frontend-plugin-api';
import { navModule } from './modules/nav';

const homeRedirectPage = PageBlueprint.make({
  name: 'home-redirect',
  params: {
    path: '/',
    loader: async () => <Navigate to="/s3-viewer" replace />,
  },
});

const signInPage = SignInPageBlueprint.make({
  params: {
    loader: async () => props => {
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

const app = createApp({
  features: [
    navModule,
    createFrontendModule({
      pluginId: 'app',
      extensions: [signInPage, homeRedirectPage],
    }),
  ],
});

export default app.createRoot();
