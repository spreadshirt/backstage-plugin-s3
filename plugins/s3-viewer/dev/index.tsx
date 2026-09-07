import { createDevApp } from '@backstage/frontend-dev-utils';
import catalogPlugin from '@backstage/plugin-catalog/alpha';
import s3ViewerPlugin from '../src/alpha';

createDevApp({
  features: [catalogPlugin, s3ViewerPlugin],
});
