import { discoveryApiRef, fetchApiRef } from '@backstage/core-plugin-api';
import {
  compatWrapper,
  convertLegacyRouteRef,
  convertLegacyRouteRefs,
} from '@backstage/core-compat-api';
import {
  ApiBlueprint,
  PageBlueprint,
  createFrontendPlugin,
} from '@backstage/frontend-plugin-api';
import StorageIcon from '@material-ui/icons/Storage';
import { S3ApiRef, S3Client } from './api';
import { rootRouteRef } from './routes';

const s3ViewerApi = ApiBlueprint.make({
  params: defineParams =>
    defineParams({
      api: S3ApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ discoveryApi, fetchApi }) =>
        new S3Client({ discoveryApi, fetchApi }),
    }),
});

const s3ViewerPage = PageBlueprint.make({
  params: {
    path: '/s3-viewer',
    title: 'S3 Viewer',
    icon: <StorageIcon fontSize="inherit" />,
    routeRef: convertLegacyRouteRef(rootRouteRef),
    loader: () =>
      import('./components/Router').then(m => compatWrapper(<m.Router />)),
  },
});

/**
 * @alpha
 */
export default createFrontendPlugin({
  pluginId: 's3-viewer',
  extensions: [s3ViewerApi, s3ViewerPage],
  routes: convertLegacyRouteRefs({
    root: rootRouteRef,
  }),
});
