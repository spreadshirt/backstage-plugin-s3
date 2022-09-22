import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { s3ViewerPlugin, S3ViewerPage } from '../src/plugin';

createDevApp()
  .registerPlugin(s3ViewerPlugin)
  .addPage({
    element: <S3ViewerPage />,
    title: 'Root Page',
    path: '/s3-viewer',
  })
  .render();
