import { createRouteRef } from '@backstage/core-plugin-api';

export const rootRouteRef = createRouteRef({
  id: 's3-viewer',
  params: ['endpoint', 'bucket', '*'],
});
