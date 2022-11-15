import {
  createApiFactory,
  createComponentExtension,
  createPlugin,
  DiscoveryApi,
  discoveryApiRef,
  IdentityApi,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { S3Client, S3ApiRef } from './api';

import { rootRouteRef } from './routes';

export const s3ViewerPlugin = createPlugin({
  id: 's3-viewer',
  apis: [
    createApiFactory({
      api: S3ApiRef,
      deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef },
      factory: (deps: {
        discoveryApi: DiscoveryApi;
        identityApi: IdentityApi;
      }) => new S3Client(deps),
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

export const S3ViewerPage = s3ViewerPlugin.provide(
  createComponentExtension({
    name: 'S3ViewerPage',
    component: {
      lazy: () => import('./components/Router').then(m => m.Router),
    },
  }),
);
