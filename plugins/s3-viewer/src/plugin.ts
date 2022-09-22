import {
  createApiFactory,
  createComponentExtension,
  createPlugin,
  DiscoveryApi,
  discoveryApiRef,
} from '@backstage/core-plugin-api';
import { S3Client, S3ApiRef } from './api';

import { rootRouteRef } from './routes';

export const s3ViewerPlugin = createPlugin({
  id: 's3-viewer',
  apis: [
    createApiFactory({
      api: S3ApiRef,
      deps: { discoveryApi: discoveryApiRef },
      factory: ({ discoveryApi }: { discoveryApi: DiscoveryApi }) =>
        new S3Client({
          discoveryApi,
        }),
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
