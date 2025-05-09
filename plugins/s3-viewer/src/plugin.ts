import {
  createApiFactory,
  createComponentExtension,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import { S3Client, S3ApiRef } from './api';

import { rootRouteRef } from './routes';
import { useEntity } from '@backstage/plugin-catalog-react';

export const s3ViewerPlugin = createPlugin({
  id: 's3-viewer',
  apis: [
    createApiFactory({
      api: S3ApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: deps => new S3Client(deps),
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

export const S3ViewerPage = s3ViewerPlugin.provide(
  createRoutableExtension({
    name: 'S3ViewerPage',
    component: () =>
      import('./components/S3ViewerPage/S3ViewerPage').then(m => m.S3ViewerPage),
    mountPoint: rootRouteRef,
  }),
);