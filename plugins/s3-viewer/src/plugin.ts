import {
  createApiFactory,
  createComponentExtension,
  createPlugin,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import { S3Client, S3ApiRef } from './api';

import { rootRouteRef } from './routes';

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
  createComponentExtension({
    name: 'S3ViewerPage',
    component: {
      lazy: () => import('./components/Router').then(m => m.Router),
    },
  }),
);
